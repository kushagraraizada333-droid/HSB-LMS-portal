import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Course } from '../types';

export const courseService = {
  /**
   * Fetch all courses from Supabase courses table.
   * Throws an error on failure — no mock data fallbacks.
   */
  async getAllCourses(): Promise<Course[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Missing environment variables.');
    }

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('code', { ascending: true });

    if (error) {
      console.error('[courseService] Failed to fetch courses from Supabase:', error.message);
      throw new Error(`Failed to load courses from database: ${error.message}`);
    }

    // Return real database records (which may be empty [] if no courses have been inserted)
    return (data || []).map((row: any) => ({
      id: row.id,
      code: row.code,
      title: row.title,
      credits: row.credits,
      trimester: row.trimester,
      facultyId: row.faculty_id || '',
      facultyName: row.faculty_name || 'Prof. Faculty Member',
      department: row.department,
      description: row.description || '',
      schedule: row.schedule || 'TBA',
      room: row.room || 'Amphitheater Hall 1 (HSB Campus)',
      totalEnrolled: 0,
      color: row.color || 'from-blue-700 to-indigo-900',
    }));
  },

  /**
   * Fetch courses assigned to a faculty member.
   */
  async getCoursesByFaculty(facultyId: string): Promise<Course[]> {
    const all = await this.getAllCourses();
    return all.filter((c) => c.facultyId === facultyId);
  },

  /**
   * Create a new course record in Supabase courses table.
   */
  async createCourse(courseData: {
    code: string;
    title: string;
    credits: number;
    trimester: number;
    department: string;
    facultyName?: string;
    facultyId?: string;
    description?: string;
    schedule?: string;
    room?: string;
  }): Promise<Course> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase
      .from('courses')
      .insert({
        code: courseData.code,
        title: courseData.title,
        credits: courseData.credits,
        trimester: courseData.trimester,
        department: courseData.department,
        faculty_name: courseData.facultyName || null,
        faculty_id: courseData.facultyId || null,
        description: courseData.description || null,
        schedule: courseData.schedule || null,
        room: courseData.room || null,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create course in Supabase');
    }

    const row = data as any;
    return {
      id: row.id,
      code: row.code,
      title: row.title,
      credits: row.credits,
      trimester: row.trimester,
      facultyId: row.faculty_id || '',
      facultyName: row.faculty_name || '',
      department: row.department,
      description: row.description || '',
      schedule: row.schedule || '',
      room: row.room || '',
      totalEnrolled: 0,
      color: row.color || 'from-blue-700 to-indigo-900',
    };
  },
};
