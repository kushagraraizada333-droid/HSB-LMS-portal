-- ==============================================================================
-- Hari Shankar Singhania School of Business (HSB), Jaipur
-- Stage 2 Core Database Schema & Migrations: Profiles, Roles, Courses & Academic Modules
-- Hardened against privilege escalation with database-level constraints & triggers.
-- Copy and paste this script directly into Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped', 'waitlist');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE assignment_status AS ENUM ('open', 'grading', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('submitted', 'graded', 'late');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. CORE TABLES (9 Tables)
-- ==============================================================================

-- Table 1: PROFILES (Linked directly to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  phone TEXT,
  department TEXT,
  batch TEXT,
  section TEXT,
  roll_number TEXT UNIQUE,
  specialization TEXT,
  cgpa NUMERIC(3,2) DEFAULT 0.00,
  trimester INT DEFAULT 1,
  designation TEXT,
  office_room TEXT,
  qualifications TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_roll ON public.profiles(roll_number);

-- Table 2: COURSES
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  credits INT NOT NULL DEFAULT 3,
  trimester INT NOT NULL DEFAULT 1,
  faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  faculty_name TEXT,
  department TEXT NOT NULL,
  description TEXT,
  schedule TEXT,
  room TEXT,
  color TEXT DEFAULT 'from-blue-700 to-indigo-900',
  syllabus JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_code ON public.courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_trimester ON public.courses(trimester);
CREATE INDEX IF NOT EXISTS idx_courses_faculty ON public.courses(faculty_id);

-- Table 3: ENROLLMENTS (Students enrolled in courses)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status enrollment_status NOT NULL DEFAULT 'active',
  grade TEXT,
  grade_point NUMERIC(3,2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);

-- Table 4: STUDY MATERIALS
CREATE TABLE IF NOT EXISTS public.study_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'pdf',
  file_url TEXT NOT NULL,
  file_size TEXT,
  module_number INT NOT NULL DEFAULT 1,
  uploaded_by TEXT NOT NULL,
  uploaded_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_materials_course ON public.study_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_study_materials_uploader ON public.study_materials(uploaded_by_id);

-- Table 4B: STUDENT PERSONAL MATERIALS
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

-- Table 5: ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_date DATE DEFAULT CURRENT_DATE,
  due_date TIMESTAMPTZ NOT NULL,
  max_marks INT NOT NULL DEFAULT 100,
  weightage INT NOT NULL DEFAULT 20,
  rubric JSONB DEFAULT '[]'::JSONB,
  status assignment_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_course ON public.assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_faculty ON public.assignments(faculty_id);

-- Table 6: SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size TEXT,
  notes TEXT,
  marks_obtained INT,
  feedback TEXT,
  status submission_status NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_id);

-- Table 7: ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_topic TEXT,
  status attendance_status NOT NULL DEFAULT 'present',
  recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, student_id, session_date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_course_student ON public.attendance_records(course_id, student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_records(session_date);

-- Table 8: ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL DEFAULT 'academic',
  target_audience TEXT NOT NULL DEFAULT 'all',
  posted_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 9: NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'announcement',
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);

-- ==============================================================================
-- 4. SECURITY FUNCTIONS (SECURITY DEFINER with fixed search_path)
-- ==============================================================================

-- Helper function: Check if authenticated user is student
CREATE OR REPLACE FUNCTION public.is_student()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'student'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Helper function: Check if authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Helper function: Check if authenticated user is faculty
CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'faculty'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Helper function: Check if authenticated user is enrolled in course
CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE course_id = p_course_id
      AND student_id = auth.uid()
      AND status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Helper function: Check if authenticated user is assigned faculty for course
CREATE OR REPLACE FUNCTION public.is_course_faculty(p_course_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = p_course_id
      AND faculty_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Restrict function execution: Revoke from PUBLIC and anon, grant to authenticated and service_role
REVOKE ALL ON FUNCTION public.is_student() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_student() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_student() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_student() TO service_role;

REVOKE ALL ON FUNCTION public.is_faculty() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_faculty() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_faculty() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_faculty() TO service_role;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

REVOKE ALL ON FUNCTION public.is_enrolled(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_enrolled(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_enrolled(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_enrolled(UUID) TO service_role;

REVOKE ALL ON FUNCTION public.is_course_faculty(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_course_faculty(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_course_faculty(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_course_faculty(UUID) TO service_role;

-- ==============================================================================
-- 5. AUTOMATIC REGISTRATION & PRIVILEGE ESCALATION GUARDS (Rule 9)
-- ==============================================================================

-- Auto-profile trigger: Public registration is strictly assigned 'student'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    roll_number,
    batch,
    section,
    specialization,
    designation,
    department
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    -- SECURITY RULE 9: Every public signup is strictly forced to 'student'
    -- Metadata roles ('faculty', 'admin') are strictly ignored.
    'student'::user_role,
    NEW.raw_user_meta_data->>'roll_number',
    COALESCE(NEW.raw_user_meta_data->>'batch', 'MBA 2025-27'),
    COALESCE(NEW.raw_user_meta_data->>'section', 'Section B'),
    NEW.raw_user_meta_data->>'specialization',
    NEW.raw_user_meta_data->>'designation',
    NEW.raw_user_meta_data->>'department'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to prevent users from elevating their own role or CGPA via UPDATE
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent non-admins from changing their role
  IF (NEW.role IS DISTINCT FROM OLD.role) THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
    END IF;
  END IF;

  -- Prevent students from changing their own CGPA
  IF (NEW.cgpa IS DISTINCT FROM OLD.cgpa) THEN
    IF NOT (public.is_faculty() OR public.is_admin()) THEN
      RAISE EXCEPTION 'Unauthorized: Students cannot modify their own CGPA.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_protect_profile_role ON public.profiles;
CREATE TRIGGER trigger_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_role();

-- Trigger to prevent students from tampering with marks_obtained or feedback on submissions
CREATE OR REPLACE FUNCTION public.protect_submission_grading()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.marks_obtained IS DISTINCT FROM OLD.marks_obtained OR NEW.feedback IS DISTINCT FROM OLD.feedback) THEN
    IF NOT (public.is_faculty() OR public.is_admin()) THEN
      RAISE EXCEPTION 'Unauthorized: Only faculty or administrators can assign marks or feedback.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_protect_submission_grading ON public.submissions;
CREATE TRIGGER trigger_protect_submission_grading
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_submission_grading();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- A. PROFILES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Role cannot be changed via update unless user is already admin
    AND (public.is_admin() OR role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
  );

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- B. COURSES POLICIES
-- ------------------------------------------------------------------------------
REVOKE ALL ON TABLE public.courses FROM anon, PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.courses TO authenticated;
GRANT ALL ON TABLE public.courses TO service_role;

DROP POLICY IF EXISTS "Courses viewable by all authenticated users" ON public.courses;
CREATE POLICY "Courses viewable by all authenticated users"
  ON public.courses FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Faculty can update their own courses" ON public.courses;
CREATE POLICY "Faculty can update their own courses"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (faculty_id = auth.uid() OR public.is_admin())
  WITH CHECK (faculty_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- C. ENROLLMENTS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Students view own enrollments, faculty and admin view all" ON public.enrollments;
CREATE POLICY "Students view own enrollments, faculty and admin view all"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = enrollments.course_id AND c.faculty_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Admins and authorized faculty manage enrollments" ON public.enrollments;
CREATE POLICY "Admins and authorized faculty manage enrollments"
  ON public.enrollments FOR ALL
  TO authenticated
  USING (
    public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = enrollments.course_id AND c.faculty_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = enrollments.course_id AND c.faculty_id = auth.uid()
      )
    )
  );

-- ------------------------------------------------------------------------------
-- D. STUDY MATERIALS POLICIES
-- ------------------------------------------------------------------------------
REVOKE ALL ON TABLE public.study_materials FROM anon;
REVOKE ALL ON TABLE public.study_materials FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.study_materials TO authenticated;
GRANT ALL ON TABLE public.study_materials TO service_role;

DROP POLICY IF EXISTS "Study materials viewable by all authenticated users" ON public.study_materials;
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

DROP POLICY IF EXISTS "Faculty and admin manage study materials" ON public.study_materials;
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
-- D2. STUDENT PERSONAL MATERIALS POLICIES
-- ------------------------------------------------------------------------------
REVOKE ALL ON TABLE public.student_materials FROM anon;
REVOKE ALL ON TABLE public.student_materials FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.student_materials TO authenticated;
GRANT ALL ON TABLE public.student_materials TO service_role;

ALTER TABLE public.student_materials ENABLE ROW LEVEL SECURITY;

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
-- E. ASSIGNMENTS POLICIES
-- ------------------------------------------------------------------------------
-- Enrolled students and authorized faculty read assignments
DROP POLICY IF EXISTS "Enrolled students and faculty view assignments" ON public.assignments;
CREATE POLICY "Enrolled students and faculty view assignments"
  ON public.assignments FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR assignments.faculty_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = assignments.course_id AND c.faculty_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = assignments.course_id AND e.student_id = auth.uid()
    )
  );

-- Only authorized faculty or admins can create assignments
DROP POLICY IF EXISTS "Faculty and admin create assignments" ON public.assignments;
CREATE POLICY "Faculty and admin create assignments"
  ON public.assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_faculty()
      AND (
        assignments.faculty_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.courses c
          WHERE c.id = assignments.course_id AND c.faculty_id = auth.uid()
        )
      )
    )
  );

-- Only authorized faculty or admins can edit assignments
DROP POLICY IF EXISTS "Faculty and admin update assignments" ON public.assignments;
CREATE POLICY "Faculty and admin update assignments"
  ON public.assignments FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR (
      public.is_faculty()
      AND (
        assignments.faculty_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.courses c
          WHERE c.id = assignments.course_id AND c.faculty_id = auth.uid()
        )
      )
    )
  )
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_faculty()
      AND (
        assignments.faculty_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.courses c
          WHERE c.id = assignments.course_id AND c.faculty_id = auth.uid()
        )
      )
    )
  );

-- Only authorized faculty or admins can delete assignments
DROP POLICY IF EXISTS "Faculty and admin delete assignments" ON public.assignments;
CREATE POLICY "Faculty and admin delete assignments"
  ON public.assignments FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
    OR (
      public.is_faculty()
      AND (
        assignments.faculty_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.courses c
          WHERE c.id = assignments.course_id AND c.faculty_id = auth.uid()
        )
      )
    )
  );

-- ------------------------------------------------------------------------------
-- F. SUBMISSIONS POLICIES
-- ------------------------------------------------------------------------------
-- Students read own submissions; faculty reads submissions for taught courses; admins read all
DROP POLICY IF EXISTS "View submissions" ON public.submissions;
CREATE POLICY "View submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.assignments a
        JOIN public.courses c ON c.id = a.course_id
        WHERE a.id = submissions.assignment_id AND c.faculty_id = auth.uid()
      )
    )
  );

-- Students can insert their own submissions (cannot pre-assign marks or feedback)
DROP POLICY IF EXISTS "Students submit own assignments" ON public.submissions;
CREATE POLICY "Students submit own assignments"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND marks_obtained IS NULL
    AND feedback IS NULL
  );

-- Students can update notes/files on un-graded submissions; Faculty can grade and provide feedback
DROP POLICY IF EXISTS "Students update own un-graded submission" ON public.submissions;
CREATE POLICY "Students update own un-graded submission"
  ON public.submissions FOR UPDATE
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.assignments a
        JOIN public.courses c ON c.id = a.course_id
        WHERE a.id = submissions.assignment_id AND c.faculty_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    -- If student, cannot alter marks or feedback
    (
      student_id = auth.uid()
      AND marks_obtained IS NULL
      AND feedback IS NULL
    )
    OR public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.assignments a
        JOIN public.courses c ON c.id = a.course_id
        WHERE a.id = submissions.assignment_id AND c.faculty_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Admins and students delete submissions" ON public.submissions;
CREATE POLICY "Admins and students delete submissions"
  ON public.submissions FOR DELETE
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- G. ATTENDANCE RECORDS POLICIES
-- ------------------------------------------------------------------------------
-- Students read only their own attendance; faculty reads attendance for their taught courses; admins read all
DROP POLICY IF EXISTS "View attendance records" ON public.attendance_records;
CREATE POLICY "View attendance records"
  ON public.attendance_records FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = attendance_records.course_id AND c.faculty_id = auth.uid()
      )
    )
  );

-- Only faculty who teach the course or admins can insert attendance (Students CANNOT insert)
DROP POLICY IF EXISTS "Faculty record attendance for taught courses" ON public.attendance_records;
CREATE POLICY "Faculty record attendance for taught courses"
  ON public.attendance_records FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = attendance_records.course_id AND c.faculty_id = auth.uid()
      )
    )
  );

-- Only faculty who teach the course or admins can update attendance (Students CANNOT update)
DROP POLICY IF EXISTS "Faculty update attendance for taught courses" ON public.attendance_records;
CREATE POLICY "Faculty update attendance for taught courses"
  ON public.attendance_records FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = attendance_records.course_id AND c.faculty_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = attendance_records.course_id AND c.faculty_id = auth.uid()
      )
    )
  );

-- Only faculty who teach the course or admins can delete attendance records
DROP POLICY IF EXISTS "Faculty delete attendance for taught courses" ON public.attendance_records;
CREATE POLICY "Faculty delete attendance for taught courses"
  ON public.attendance_records FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
    OR (
      public.is_faculty()
      AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = attendance_records.course_id AND c.faculty_id = auth.uid()
      )
    )
  );

-- ------------------------------------------------------------------------------
-- H. ANNOUNCEMENTS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Announcements viewable by authenticated users" ON public.announcements;
CREATE POLICY "Announcements viewable by authenticated users"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Faculty and Admin create announcements" ON public.announcements;
CREATE POLICY "Faculty and Admin create announcements"
  ON public.announcements FOR ALL
  TO authenticated
  USING (public.is_faculty() OR public.is_admin())
  WITH CHECK (public.is_faculty() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- I. NOTIFICATIONS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Faculty and Admins can create notifications" ON public.notifications;
CREATE POLICY "Faculty and Admins can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (public.is_faculty() OR public.is_admin());

-- ==============================================================================
-- 7. SEED DATA (Official HSB Academic Courses)
-- ==============================================================================

INSERT INTO public.courses (code, title, credits, trimester, department, description, schedule, room, color)
VALUES
  ('PRD-601', 'Product Strategy & AI-Driven Business Models', 3, 3, 'Product & AI Leadership', 'Foundations of tech-product discovery, GenAI integration frameworks, unit economics, and platform network effects.', 'Mon & Wed, 10:00 AM - 11:30 AM', 'Amphitheater Hall 1 (HSB Campus)', 'from-blue-700 to-indigo-900'),
  ('FIN-602', 'Corporate Valuation & Financial Modeling', 3, 3, 'Finance & Economics', 'Advanced DCF modeling, LBO scenarios, merger synergies, and venture investing frameworks.', 'Tue & Thu, 11:45 AM - 01:15 PM', 'Executive Seminar Hall B', 'from-blue-800 to-slate-900'),
  ('MKT-605', 'Digital Customer Intelligence & Growth Hacking', 3, 3, 'Marketing & Digital Strategy', 'Omnichannel attribution, customer lifetime value (LTV), cohort retention curves, and algorithmic experimentation.', 'Mon & Fri, 02:00 PM - 03:30 PM', 'Design Thinking Studio 2', 'from-sky-700 to-blue-900'),
  ('STR-604', 'Technology, Design & Competitive Strategy', 3, 3, 'Technology, Design & Operations', 'Business model innovation at the intersection of design thinking, computational technology, and strategic moats.', 'Wed & Fri, 03:45 PM - 05:15 PM', 'Case Amphitheater C', 'from-indigo-800 to-blue-950'),
  ('ANL-603', 'Data Science & SQL for Executive Decision Making', 2, 3, 'Analytics & Information Systems', 'Querying enterprise data warehouses, predictive cohort modeling in Python, and automated business KPI pipelines.', 'Saturday, 09:30 AM - 01:00 PM', 'FinTech & Simulation Lab', 'from-blue-600 to-indigo-800')
ON CONFLICT (code) DO NOTHING;

-- ==============================================================================
-- 8. STORAGE BUCKETS & HARDENED STORAGE RLS POLICIES
-- ==============================================================================

-- A. Official Course Study Materials Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'study-materials',
  'study-materials',
  false,
  52428800,
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

-- B. Student Personal Uploads Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-materials',
  'student-materials',
  false,
  52428800,
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

-- Note: storage.objects is owned by supabase_storage_admin and has RLS enabled by default.
-- Omitting redundant ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY to prevent ERROR 42501 in SQL Editor.

-- Official Materials: Enrolled students and authorised faculty
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

-- Student Personal Storage: Isolated by student UUID folder (${auth.uid()}/...)
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

