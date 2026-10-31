import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Enrollment, Course } from '../types';
import { MOCK_COURSES } from '../data/mockData';

export interface EnrolledCourseView extends Enrollment {
  course?: Course;
}

export const enrollmentService = {
  /**
   * Fetch courses in which a student is enrolled.
   */
  async getStudentEnrollments(studentId: string): Promise<EnrolledCourseView[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_COURSES.map((c, idx) => ({
        id: `enr_${idx + 1}`,
        studentId,
        courseId: c.id,
        status: 'active',
        enrolledAt: '2026-08-01',
        course: c,
      }));
    }

    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        id,
        student_id,
        course_id,
        status,
        grade,
        grade_point,
        enrolled_at,
        courses (
          id,
          code,
          title,
          credits,
          trimester,
          faculty_id,
          faculty_name,
          department,
          description,
          schedule,
          room,
          color
        )
      `)
      .eq('student_id', studentId);

    if (error) {
      console.warn('[enrollmentService] Error querying enrollments:', error.message);
      if (error.code === 'PGRST205' || error.code === '42P01') {
        return MOCK_COURSES.map((c, idx) => ({
          id: `enr_${idx + 1}`,
          studentId,
          courseId: c.id,
          status: 'active',
          enrolledAt: '2026-08-01',
          course: c,
        }));
      }
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      courseId: row.course_id,
      studentId: row.student_id,
      status: row.status,
      grade: row.grade || undefined,
      gradePoint: row.grade_point ? Number(row.grade_point) : undefined,
      enrolledAt: row.enrolled_at,
      course: row.courses
        ? {
            id: row.courses.id,
            code: row.courses.code,
            title: row.courses.title,
            credits: row.courses.credits,
            trimester: row.courses.trimester,
            facultyId: row.courses.faculty_id || '',
            facultyName: row.courses.faculty_name || '',
            department: row.courses.department,
            description: row.courses.description || '',
            schedule: row.courses.schedule || '',
            room: row.courses.room || '',
            totalEnrolled: 62,
            color: row.courses.color || 'from-blue-700 to-indigo-900',
          }
        : undefined,
    }));
  },

  /**
   * Enroll a student into a course.
   */
  async enrollStudent(studentId: string, courseId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return true;
    }

    const { error } = await supabase.from('enrollments').insert({
      student_id: studentId,
      course_id: courseId,
      status: 'active',
    });

    if (error) {
      console.error('[enrollmentService] Enrollment failed:', error.message);
      return false;
    }

    return true;
  },
};
