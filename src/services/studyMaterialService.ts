import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StudyMaterial, StudentPersonalMaterial, MaterialType } from '../types';

// Maximum allowed file size: 50 MB
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

// Allowed file extensions
export const ALLOWED_EXTENSIONS = [
  'pdf',
  'ppt',
  'pptx',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'txt',
  'zip',
  'png',
  'jpg',
  'jpeg',
];

export const formatBytes = (bytes: number, decimals = 1): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const detectMaterialType = (fileName: string, mimeType?: string): MaterialType => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf' || mimeType?.includes('pdf')) return 'pdf';
  if (ext === 'ppt' || ext === 'pptx' || mimeType?.includes('presentation')) return 'ppt';
  if (ext === 'doc' || ext === 'docx' || mimeType?.includes('word')) return 'doc';
  if (ext === 'xls' || ext === 'xlsx' || mimeType?.includes('spreadsheet')) return 'doc';
  return 'pdf';
};

export interface UploadMaterialParams {
  file: File;
  courseId: string;
  courseCode: string;
  title: string;
  description: string;
  moduleNumber: number;
  uploadedBy: string;
  uploadedById?: string;
  onProgress?: (percent: number) => void;
}

export interface UploadStudentMaterialParams {
  file: File;
  studentId: string;
  title: string;
  description?: string;
  courseId?: string;
  courseCode?: string;
  onProgress?: (percent: number) => void;
}

export const studyMaterialService = {
  // ============================================================================
  // SECTION 1: OFFICIAL COURSE STUDY MATERIALS (Faculty & Admin)
  // ============================================================================

  /**
   * Fetch official study materials for courses.
   * Supabase RLS ensures:
   * - Students only receive rows for courses they are enrolled in.
   * - Faculty only receive rows for courses they teach or published.
   * - Admins receive all rows.
   */
  async getMaterials(): Promise<StudyMaterial[]> {
    let dbMaterials: StudyMaterial[] = [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('study_materials')
          .select('*')
          .order('uploaded_at', { ascending: false });

        if (!error && data) {
          dbMaterials = data.map((row: any) => ({
            id: row.id,
            courseId: row.course_id,
            courseCode: row.course_code,
            title: row.title,
            description: row.description || '',
            type: (row.type as MaterialType) || 'pdf',
            fileUrl: row.file_url,
            fileSize: row.file_size || 'Document',
            uploadedAt: row.uploaded_at
              ? row.uploaded_at.split('T')[0]
              : new Date().toISOString().split('T')[0],
            uploadedBy: row.uploaded_by || 'Faculty Member',
            uploadedById: row.uploaded_by_id,
            moduleNumber: row.module_number || 1,
          }));
        } else if (error) {
          console.warn('[studyMaterialService] Database query note:', error.message);
        }
      } catch (err) {
        console.warn('[studyMaterialService] Error connecting to study_materials table:', err);
      }
    }

    // Return only actual database records stored in public.study_materials
    return dbMaterials;
  },

  /**
   * Fetch materials specifically for a course by courseId or courseCode.
   */
  async getMaterialsByCourse(courseId: string, courseCode?: string): Promise<StudyMaterial[]> {
    const all = await this.getMaterials();
    return all.filter((m) => {
      if (m.courseId === courseId) return true;
      if (courseCode && m.courseCode.toLowerCase() === courseCode.toLowerCase()) return true;
      return false;
    });
  },

  /**
   * Upload an official study material to the private 'study-materials' Supabase Storage bucket
   * and store metadata in public.study_materials.
   * Requires authenticated faculty or administrator credentials.
   */
  async uploadMaterial(params: UploadMaterialParams): Promise<StudyMaterial> {
    const {
      file,
      courseId,
      courseCode,
      title,
      description,
      moduleNumber,
      uploadedBy,
      uploadedById,
      onProgress,
    } = params;

    // 1. File Validation
    if (!file) {
      throw new Error('Please select a valid file from your computer to upload.');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `File size (${formatBytes(file.size)}) exceeds the maximum allowed limit of ${formatBytes(
          MAX_FILE_SIZE_BYTES
        )}.`
      );
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      throw new Error(
        `File format ".${extension}" is not supported. Please upload a PDF, PowerPoint (.ppt, .pptx), Word document (.doc, .docx), Excel sheet (.xls, .xlsx), or text document.`
      );
    }

    if (!isSupabaseConfigured()) {
      throw new Error('Supabase client is not configured.');
    }

    if (onProgress) onProgress(20);

    // 2. Storage Path within 'study-materials' bucket
    const sanitizedCourseCode = courseCode.replace(/[^a-zA-Z0-9_-]/g, '_');
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const storagePath = `${sanitizedCourseCode}/${timestamp}_${sanitizedFileName}`;

    if (onProgress) onProgress(40);

    // 3. Upload File to Supabase Storage Bucket ('study-materials')
    const { error: storageError } = await supabase.storage
      .from('study-materials')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      });

    if (storageError) {
      console.error('[studyMaterialService] Storage upload error:', storageError);

      if (
        storageError.message?.toLowerCase().includes('bucket not found') ||
        (storageError as any).statusCode === '404'
      ) {
        throw new Error(
          'Supabase Storage bucket "study-materials" not found. Please execute the migration script in supabase/migrations/20261030_study_materials_storage.sql in your Supabase SQL Editor.'
        );
      }

      if (
        storageError.message?.toLowerCase().includes('row-level security') ||
        (storageError as any).statusCode === '403'
      ) {
        throw new Error(
          'Storage permission denied: Only authorized faculty members and administrators can publish official study materials.'
        );
      }

      throw new Error(`Storage upload failed: ${storageError.message}`);
    }

    if (onProgress) onProgress(70);

    // 4. Resolve Course UUID
    let validCourseUuid = courseId;
    const isUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!isUuidPattern.test(courseId)) {
      try {
        const { data: matchedCourse } = await supabase
          .from('courses')
          .select('id')
          .eq('code', courseCode)
          .maybeSingle();

        if (matchedCourse?.id) {
          validCourseUuid = matchedCourse.id;
        }
      } catch (err) {
        console.warn('[studyMaterialService] UUID lookup warning:', err);
      }
    }

    const detectedType = detectMaterialType(file.name, file.type);
    const fileSizeFormatted = formatBytes(file.size);

    if (onProgress) onProgress(85);

    // 5. Store File Metadata in public.study_materials
    const insertPayload: Record<string, any> = {
      course_id: validCourseUuid,
      course_code: courseCode,
      title: title.trim(),
      description: description.trim(),
      type: detectedType,
      file_url: storagePath,
      file_size: fileSizeFormatted,
      module_number: Number(moduleNumber) || 1,
      uploaded_by: uploadedBy,
      uploaded_at: new Date().toISOString(),
    };

    if (uploadedById && isUuidPattern.test(uploadedById)) {
      insertPayload.uploaded_by_id = uploadedById;
    }

    const { data: dbData, error: dbError } = await supabase
      .from('study_materials')
      .insert(insertPayload)
      .select()
      .single();

    if (dbError) {
      console.error('[studyMaterialService] Database insert error:', dbError);
      throw new Error(`Failed to record material in academic database: ${dbError.message}`);
    }

    if (onProgress) onProgress(100);

    return {
      id: dbData.id,
      courseId: dbData.course_id,
      courseCode: dbData.course_code,
      title: dbData.title,
      description: dbData.description || '',
      type: dbData.type as MaterialType,
      fileUrl: dbData.file_url,
      fileSize: dbData.file_size,
      uploadedAt: dbData.uploaded_at ? dbData.uploaded_at.split('T')[0] : new Date().toISOString().split('T')[0],
      uploadedBy: dbData.uploaded_by,
      uploadedById: dbData.uploaded_by_id,
      moduleNumber: dbData.module_number,
    };
  },

  /**
   * Securely download official study material from private bucket.
   * Access is verified by Supabase Storage RLS.
   */
  async downloadMaterial(material: StudyMaterial): Promise<void> {
    const fileUrl = material.fileUrl;

    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (fileUrl.startsWith('#')) {
      const sampleContent = `Hari Shankar Singhania School of Business (HSB)\nCourse: ${material.courseCode}\nTitle: ${material.title}\nUploaded By: ${material.uploadedBy}\n\nAcademic course deliverable reading.`;
      const blob = new Blob([sampleContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${material.courseCode}_Module${material.moduleNumber}_${material.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      return;
    }

    if (!isSupabaseConfigured()) {
      throw new Error('Supabase client is not configured.');
    }

    // Request secure signed URL from private bucket (300 seconds validity)
    const { data: signedData, error: signError } = await supabase.storage
      .from('study-materials')
      .createSignedUrl(fileUrl, 300);

    if (signError) {
      console.error('[studyMaterialService] Signed URL creation error:', signError);
      throw new Error(
        signError.message?.includes('row-level security')
          ? 'Access denied: You must be actively enrolled in this course to download its study materials.'
          : signError.message || 'Failed to generate secure download link.'
      );
    }

    if (signedData?.signedUrl) {
      try {
        const response = await fetch(signedData.signedUrl);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        const suggestedName = fileUrl.split('/').pop() || `${material.title}.${material.type}`;
        a.download = suggestedName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        return;
      } catch (fetchErr) {
        window.open(signedData.signedUrl, '_blank');
        return;
      }
    }
  },

  /**
   * Delete official study material (Faculty/Admin only).
   */
  async deleteMaterial(id: string, fileUrl?: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase client is not configured.');
    }

    const isUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!isUuidPattern.test(id)) {
      throw new Error('Invalid material ID. Cannot delete non-database record.');
    }

    const { error: dbError } = await supabase
      .from('study_materials')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw new Error(`Failed to delete record: ${dbError.message}`);
    }

    if (fileUrl && !fileUrl.startsWith('http') && !fileUrl.startsWith('#')) {
      await supabase.storage.from('study-materials').remove([fileUrl]);
    }
  },

  // ============================================================================
  // SECTION 2: STUDENT PERSONAL STUDY UPLOADS (Isolated per Student UUID)
  // ============================================================================

  /**
   * Fetch personal study files uploaded by the authenticated student.
   * Supabase RLS enforces student_id = auth.uid().
   */
  async getStudentPersonalMaterials(): Promise<StudentPersonalMaterial[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('student_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('[studyMaterialService] Student personal materials note:', error?.message);
        return [];
      }

      return data.map((row: any) => ({
        id: row.id,
        studentId: row.student_id,
        courseId: row.course_id,
        courseCode: row.course_code,
        title: row.title,
        description: row.description || '',
        type: (row.type as MaterialType) || 'pdf',
        fileUrl: row.file_url,
        fileSize: row.file_size || 'Document',
        createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      }));
    } catch (err) {
      console.warn('[studyMaterialService] Error fetching student personal materials:', err);
      return [];
    }
  },

  /**
   * Upload a private personal study file into the isolated 'student-materials' bucket.
   * Path is strictly partitioned by student UUID: `${studentId}/${timestamp}_${fileName}`.
   * RLS guarantees only this student can read, download, or delete this file.
   */
  async uploadStudentPersonalMaterial(
    params: UploadStudentMaterialParams
  ): Promise<StudentPersonalMaterial> {
    const { file, studentId, title, description, courseId, courseCode, onProgress } = params;

    if (!file) throw new Error('Please select a file to upload.');
    if (!studentId) throw new Error('Authentication required: Student identifier missing.');

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size (${formatBytes(file.size)}) exceeds the maximum allowed limit of 50 MB.`);
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      throw new Error(`File format ".${extension}" is not supported.`);
    }

    if (onProgress) onProgress(20);

    // Storage path strictly partitioned by student UUID
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const storagePath = `${studentId}/${timestamp}_${sanitizedFileName}`;

    if (onProgress) onProgress(45);

    // Upload to 'student-materials' bucket
    const { error: storageError } = await supabase.storage
      .from('student-materials')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      });

    if (storageError) {
      console.error('[studyMaterialService] Student storage upload error:', storageError);
      throw new Error(`Storage upload failed: ${storageError.message}`);
    }

    if (onProgress) onProgress(75);

    const detectedType = detectMaterialType(file.name, file.type);
    const fileSizeFormatted = formatBytes(file.size);

    // Insert metadata into public.student_materials
    const { data: dbData, error: dbError } = await supabase
      .from('student_materials')
      .insert({
        student_id: studentId,
        course_id: courseId || null,
        course_code: courseCode || null,
        title: title.trim(),
        description: description?.trim() || null,
        type: detectedType,
        file_url: storagePath,
        file_size: fileSizeFormatted,
      })
      .select()
      .single();

    if (dbError) {
      console.error('[studyMaterialService] Student materials database insert error:', dbError);
      throw new Error(`Failed to save personal file metadata: ${dbError.message}`);
    }

    if (onProgress) onProgress(100);

    return {
      id: dbData.id,
      studentId: dbData.student_id,
      courseId: dbData.course_id,
      courseCode: dbData.course_code,
      title: dbData.title,
      description: dbData.description || '',
      type: dbData.type as MaterialType,
      fileUrl: dbData.file_url,
      fileSize: dbData.file_size,
      createdAt: dbData.created_at ? dbData.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    };
  },

  /**
   * Securely download student personal file from 'student-materials' bucket.
   */
  async downloadStudentPersonalMaterial(material: StudentPersonalMaterial): Promise<void> {
    const { data: signedData, error: signError } = await supabase.storage
      .from('student-materials')
      .createSignedUrl(material.fileUrl, 300);

    if (signError || !signedData?.signedUrl) {
      throw new Error(signError?.message || 'Access denied: Unable to access personal study file.');
    }

    try {
      const response = await fetch(signedData.signedUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = material.fileUrl.split('/').pop() || material.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(signedData.signedUrl, '_blank');
    }
  },

  /**
   * Delete student personal file from both database and 'student-materials' storage bucket.
   */
  async deleteStudentPersonalMaterial(id: string, fileUrl: string): Promise<void> {
    const { error: dbError } = await supabase
      .from('student_materials')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw new Error(`Failed to delete record: ${dbError.message}`);
    }

    if (fileUrl) {
      await supabase.storage.from('student-materials').remove([fileUrl]);
    }
  },
};
