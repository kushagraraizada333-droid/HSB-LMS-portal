-- ==============================================================================
-- Hari Shankar Singhania School of Business (HSB), Jaipur
-- Production Migration: Hardened Study Materials Storage & Academic RLS
--
-- Security Guarantees:
-- 1. Permissive Policy Elimination:
--    - Explicitly drops and replaces the live permissive policy
--      "Study materials viewable by all authenticated users" (USING true).
-- 2. Anonymous Privilege Hardening:
--    - Revokes all table privileges from anon and PUBLIC on public.courses,
--      public.study_materials, and public.student_materials.
--    - Grants required CRUD privileges strictly to authenticated and service_role.
-- 3. Existing Helper Function Preservation & Lockdown:
--    - Preserves existing is_admin() and is_faculty() implementations completely (no recreation).
--    - Revokes execution privileges on both functions from PUBLIC and anon.
--    - Grants execution strictly to authenticated and service_role.
-- 4. Missing Helper Functions Created:
--    - Creates is_student(), is_enrolled(UUID), and is_course_faculty(UUID) with
--      SECURITY DEFINER and fixed search_path = public.
-- 5. Strict Role & Course Isolation:
--    - Faculty can upload/update/delete official materials ONLY for courses explicitly assigned to them.
--    - Students can download official materials ONLY for courses with active enrollments.
--    - Student personal files are strictly isolated to their own UUID folder in 'student-materials'.
-- 6. Zero Data Overwrite:
--    - Contains ZERO insert or update statements on courses, profiles, or enrollments.
--    - 100% safe to execute against the current live database.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. RESTRICT EXECUTION OF EXISTING HELPER FUNCTIONS (Preserves Definitions)
-- ------------------------------------------------------------------------------
-- Both is_admin() and is_faculty() already exist in production.
-- Their definitions are NOT recreated or altered.
-- We revoke execution from PUBLIC and anon, granting strictly to authenticated and service_role.

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_faculty() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_faculty() TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 2. CREATE GENUINELY MISSING HELPER FUNCTIONS (SECURITY DEFINER with fixed search_path)
-- ------------------------------------------------------------------------------

-- Helper A: Check if authenticated user has verified student role
CREATE OR REPLACE FUNCTION public.is_student()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'student'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Helper B: Check if authenticated user is actively enrolled in a given course
CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE course_id = p_course_id
      AND student_id = auth.uid()
      AND status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Helper C: Check if authenticated user is assigned faculty for a given course
CREATE OR REPLACE FUNCTION public.is_course_faculty(p_course_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = p_course_id
      AND faculty_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Lock down execution privileges on newly created helper functions
REVOKE ALL ON FUNCTION public.is_student() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_student() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_enrolled(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_enrolled(UUID) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_course_faculty(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_course_faculty(UUID) TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 3. SCHEMA ADJUSTMENTS & BASE TABLE PRIVILEGE HARDENING
-- ------------------------------------------------------------------------------

-- Ensure uploaded_by_id column exists on public.study_materials to track uploader UUID
ALTER TABLE public.study_materials
  ADD COLUMN IF NOT EXISTS uploaded_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_study_materials_uploader ON public.study_materials(uploaded_by_id);

-- Create separate metadata table for student personal study materials
CREATE TABLE IF NOT EXISTS public.student_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  course_code TEXT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'pdf',
  file_url TEXT NOT NULL,
  file_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_materials_student ON public.student_materials(student_id);
CREATE INDEX IF NOT EXISTS idx_student_materials_course ON public.student_materials(course_id);

-- Revoke all privileges from anon and PUBLIC on sensitive academic tables
REVOKE ALL ON TABLE public.courses FROM anon, PUBLIC;
REVOKE ALL ON TABLE public.study_materials FROM anon, PUBLIC;
REVOKE ALL ON TABLE public.student_materials FROM anon, PUBLIC;

-- Grant necessary privileges to authenticated users and internal service_role
-- (Row Level Security policies control actual row-level CRUD permissions)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.courses TO authenticated;
GRANT ALL ON TABLE public.courses TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.study_materials TO authenticated;
GRANT ALL ON TABLE public.study_materials TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.student_materials TO authenticated;
GRANT ALL ON TABLE public.student_materials TO service_role;

-- ------------------------------------------------------------------------------
-- 4. PRIVATE STORAGE BUCKETS (50 MB limit, restricted MIME types)
-- ------------------------------------------------------------------------------

-- A. Official Course Study Materials Bucket (Faculty & Admin materials)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'study-materials',
  'study-materials',
  false, -- Strictly private
  52428800, -- 50 MB limit
  ARRAY[
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- B. Student Personal Uploads Bucket (Student private notes and drafts)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-materials',
  'student-materials',
  false, -- Strictly private
  52428800, -- 50 MB limit
  ARRAY[
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip',
    'image/png',
    'image/jpeg'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------------------------
-- 5. TARGETED REMOVAL OF OBSOLETE & PERMISSIVE MATERIAL POLICIES
-- ------------------------------------------------------------------------------
-- Removes the live permissive "USING true" study materials policy and all legacy policies.
-- Unrelated tables (profiles, courses, enrollments, assignments, submissions,
-- attendance, announcements, notifications) are completely untouched.

-- A. Drop live permissive policy and any legacy variants on public.study_materials
DROP POLICY IF EXISTS "Study materials viewable by all authenticated users" ON public.study_materials;
DROP POLICY IF EXISTS "Faculty and admin manage study materials" ON public.study_materials;
DROP POLICY IF EXISTS "Study materials viewable in preview" ON public.study_materials;
DROP POLICY IF EXISTS "Preview mode study materials insert" ON public.study_materials;
DROP POLICY IF EXISTS "Enrolled students, assigned faculty, and admins view study materials" ON public.study_materials;
DROP POLICY IF EXISTS "Assigned faculty and admins publish study materials" ON public.study_materials;
DROP POLICY IF EXISTS "Authorised faculty and admins update study materials" ON public.study_materials;
DROP POLICY IF EXISTS "Authorised faculty and admins delete study materials" ON public.study_materials;

-- B. Obsolete policies on public.student_materials
DROP POLICY IF EXISTS "Students manage own personal study materials" ON public.student_materials;

-- C. Obsolete storage policies on storage.objects for study & student materials
DROP POLICY IF EXISTS "Allow anon read study materials in preview" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon upload study materials in preview" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read study materials" ON storage.objects;
DROP POLICY IF EXISTS "Faculty and admin can upload study materials" ON storage.objects;
DROP POLICY IF EXISTS "Faculty and admin can update study materials" ON storage.objects;
DROP POLICY IF EXISTS "Faculty and admin can delete study materials" ON storage.objects;
DROP POLICY IF EXISTS "Enrolled students and authorised faculty download study materials" ON storage.objects;
DROP POLICY IF EXISTS "Authorised faculty and admins upload study materials" ON storage.objects;
DROP POLICY IF EXISTS "Authorised faculty and admins update storage study materials" ON storage.objects;
DROP POLICY IF EXISTS "Authorised faculty and admins delete storage study materials" ON storage.objects;
DROP POLICY IF EXISTS "Students manage own personal storage files" ON storage.objects;

-- D. Legacy anonymous courses policy cleanup if present
-- (Leaves existing authenticated courses policies completely untouched)
DROP POLICY IF EXISTS "Courses viewable by everyone" ON public.courses;
DROP POLICY IF EXISTS "Allow anon read courses" ON public.courses;

-- ------------------------------------------------------------------------------
-- 6. HARDENED DATABASE RLS POLICIES: public.study_materials
-- ------------------------------------------------------------------------------

ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Policy 6A (SELECT):
-- Enrolled students, assigned faculty, and admins can view official study materials.
-- Replaces the live "USING true" policy with strict enrollment and course-faculty verification.
DROP POLICY IF EXISTS "Enrolled students, assigned faculty, and admins view study materials" ON public.study_materials;
CREATE POLICY "Enrolled students, assigned faculty, and admins view study materials"
  ON public.study_materials FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR (
      public.is_faculty()
      AND public.is_course_faculty(study_materials.course_id)
    )
    OR (
      public.is_student()
      AND public.is_enrolled(study_materials.course_id)
    )
  );

-- Policy 6B (INSERT):
-- ONLY administrators and faculty explicitly assigned to the course can publish official materials.
-- Unassigned courses cannot be uploaded to by general faculty. Students cannot upload.
DROP POLICY IF EXISTS "Assigned faculty and admins publish study materials" ON public.study_materials;
CREATE POLICY "Assigned faculty and admins publish study materials"
  ON public.study_materials FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_faculty()
      AND public.is_course_faculty(study_materials.course_id)
    )
  );

-- Policy 6C (UPDATE):
-- ONLY administrators and faculty explicitly assigned to the course can update materials.
DROP POLICY IF EXISTS "Authorised faculty and admins update study materials" ON public.study_materials;
CREATE POLICY "Authorised faculty and admins update study materials"
  ON public.study_materials FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR (
      public.is_faculty()
      AND public.is_course_faculty(study_materials.course_id)
    )
  )
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_faculty()
      AND public.is_course_faculty(study_materials.course_id)
    )
  );

-- Policy 6D (DELETE):
-- ONLY administrators and faculty explicitly assigned to the course can delete materials.
DROP POLICY IF EXISTS "Authorised faculty and admins delete study materials" ON public.study_materials;
CREATE POLICY "Authorised faculty and admins delete study materials"
  ON public.study_materials FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
    OR (
      public.is_faculty()
      AND public.is_course_faculty(study_materials.course_id)
    )
  );

-- ------------------------------------------------------------------------------
-- 7. HARDENED DATABASE RLS POLICIES: public.student_materials
-- ------------------------------------------------------------------------------

ALTER TABLE public.student_materials ENABLE ROW LEVEL SECURITY;

-- Policy 7A:
-- Authenticated users with the 'student' role can manage ONLY their own personal notes.
-- student_id must match auth.uid() AND user must possess verified student role.
-- Faculty and admin accounts cannot access student personal files.
DROP POLICY IF EXISTS "Students manage own personal study materials" ON public.student_materials;
CREATE POLICY "Students manage own personal study materials"
  ON public.student_materials FOR ALL
  TO authenticated
  USING (
    student_id = auth.uid()
    AND public.is_student()
  )
  WITH CHECK (
    student_id = auth.uid()
    AND public.is_student()
  );

-- ------------------------------------------------------------------------------
-- 8. HARDENED STORAGE RLS POLICIES: storage.objects
-- ------------------------------------------------------------------------------

-- Note: In Supabase, storage.objects is owned by supabase_storage_admin and has
-- Row Level Security enabled by default upon project initialization. Running ALTER TABLE
-- here causes Postgres ERROR 42501 (must be owner of table objects) when executed
-- as the postgres role in the SQL Editor. We omit the redundant ALTER TABLE command;
-- full storage RLS enforcement is guaranteed by the policies below.

-- Policy 8A (study-materials SELECT):
-- Enrolled students, assigned faculty, and admins can download official study materials.
DROP POLICY IF EXISTS "Enrolled students and authorised faculty download study materials" ON storage.objects;
CREATE POLICY "Enrolled students and authorised faculty download study materials"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'study-materials'
  AND (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.study_materials sm
      WHERE sm.file_url = storage.objects.name
      AND (
        (public.is_faculty() AND public.is_course_faculty(sm.course_id))
        OR (public.is_student() AND public.is_enrolled(sm.course_id))
      )
    )
  )
);

-- Policy 8B (study-materials INSERT):
-- ONLY administrators and faculty explicitly assigned to the course can upload to study-materials.
-- Unassigned faculty or courses where faculty_id IS NULL cannot be uploaded to.
DROP POLICY IF EXISTS "Authorised faculty and admins upload study materials" ON storage.objects;
CREATE POLICY "Authorised faculty and admins upload study materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'study-materials'
  AND (
    public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE (
          c.code = split_part(name, '/', 1)
          OR replace(c.code, '-', '_') = split_part(name, '/', 1)
          OR c.id::text = split_part(name, '/', 1)
        )
        AND c.faculty_id = auth.uid()
      )
    )
  )
);

-- Policy 8C (study-materials UPDATE):
-- ONLY administrators and faculty explicitly assigned to the course can update storage files.
-- Supports lookup both by database metadata or directly by course assignment prefix.
DROP POLICY IF EXISTS "Authorised faculty and admins update storage study materials" ON storage.objects;
CREATE POLICY "Authorised faculty and admins update storage study materials"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'study-materials'
  AND (
    public.is_admin()
    OR (
      public.is_faculty()
      AND (
        EXISTS (
          SELECT 1 FROM public.study_materials sm
          WHERE sm.file_url = storage.objects.name
          AND public.is_course_faculty(sm.course_id)
        )
        OR EXISTS (
          SELECT 1 FROM public.courses c
          WHERE (
            c.code = split_part(name, '/', 1)
            OR replace(c.code, '-', '_') = split_part(name, '/', 1)
            OR c.id::text = split_part(name, '/', 1)
          )
          AND c.faculty_id = auth.uid()
        )
      )
    )
  )
);

-- Policy 8D (study-materials DELETE):
-- ONLY administrators and faculty explicitly assigned to the course can delete storage files.
-- Supports lookup both by database metadata or directly by course assignment prefix,
-- ensuring deletion succeeds regardless of whether the database row or storage file is deleted first.
DROP POLICY IF EXISTS "Authorised faculty and admins delete storage study materials" ON storage.objects;
CREATE POLICY "Authorised faculty and admins delete storage study materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'study-materials'
  AND (
    public.is_admin()
    OR (
      public.is_faculty()
      AND (
        EXISTS (
          SELECT 1 FROM public.study_materials sm
          WHERE sm.file_url = storage.objects.name
          AND public.is_course_faculty(sm.course_id)
        )
        OR EXISTS (
          SELECT 1 FROM public.courses c
          WHERE (
            c.code = split_part(name, '/', 1)
            OR replace(c.code, '-', '_') = split_part(name, '/', 1)
            OR c.id::text = split_part(name, '/', 1)
          )
          AND c.faculty_id = auth.uid()
        )
      )
    )
  )
);

-- Policy 8E (student-materials ISOLATION):
-- Students can ONLY upload, read, update, and delete files within their own UUID folder.
-- Path format enforced: `${auth.uid()}/...`
-- Requires verified student role: public.is_student() = true.
-- Faculty and admin accounts cannot access student files.
DROP POLICY IF EXISTS "Students manage own personal storage files" ON storage.objects;
CREATE POLICY "Students manage own personal storage files"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'student-materials'
  AND split_part(name, '/', 1) = auth.uid()::text
  AND public.is_student()
)
WITH CHECK (
  bucket_id = 'student-materials'
  AND split_part(name, '/', 1) = auth.uid()::text
  AND public.is_student()
);
