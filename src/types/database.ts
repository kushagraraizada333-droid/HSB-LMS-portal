export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'student' | 'faculty' | 'admin';
export type EnrollmentStatus = 'active' | 'completed' | 'dropped' | 'waitlist';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type AssignmentStatus = 'open' | 'grading' | 'closed';
export type SubmissionStatus = 'submitted' | 'graded' | 'late';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: UserRole;
          avatar_url: string | null;
          phone: string | null;
          department: string | null;
          batch: string | null;
          section: string | null;
          roll_number: string | null;
          specialization: string | null;
          cgpa: number | null;
          trimester: number | null;
          designation: string | null;
          office_room: string | null;
          qualifications: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: UserRole;
          avatar_url?: string | null;
          phone?: string | null;
          department?: string | null;
          batch?: string | null;
          section?: string | null;
          roll_number?: string | null;
          specialization?: string | null;
          cgpa?: number | null;
          trimester?: number | null;
          designation?: string | null;
          office_room?: string | null;
          qualifications?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          phone?: string | null;
          department?: string | null;
          batch?: string | null;
          section?: string | null;
          roll_number?: string | null;
          specialization?: string | null;
          cgpa?: number | null;
          trimester?: number | null;
          designation?: string | null;
          office_room?: string | null;
          qualifications?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          code: string;
          title: string;
          credits: number;
          trimester: number;
          faculty_id: string | null;
          faculty_name: string | null;
          department: string;
          description: string | null;
          schedule: string | null;
          room: string | null;
          color: string | null;
          syllabus: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          credits?: number;
          trimester?: number;
          faculty_id?: string | null;
          faculty_name?: string | null;
          department: string;
          description?: string | null;
          schedule?: string | null;
          room?: string | null;
          color?: string | null;
          syllabus?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          title?: string;
          credits?: number;
          trimester?: number;
          faculty_id?: string | null;
          faculty_name?: string | null;
          department?: string;
          description?: string | null;
          schedule?: string | null;
          room?: string | null;
          color?: string | null;
          syllabus?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          status: EnrollmentStatus;
          grade: string | null;
          grade_point: number | null;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          status?: EnrollmentStatus;
          grade?: string | null;
          grade_point?: number | null;
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          status?: EnrollmentStatus;
          grade?: string | null;
          grade_point?: number | null;
          enrolled_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          course_id: string;
          faculty_id: string | null;
          title: string;
          description: string | null;
          assigned_date: string;
          due_date: string;
          max_marks: number;
          weightage: number;
          rubric: Json | null;
          status: AssignmentStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          faculty_id?: string | null;
          title: string;
          description?: string | null;
          assigned_date?: string;
          due_date: string;
          max_marks?: number;
          weightage?: number;
          rubric?: Json | null;
          status?: AssignmentStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          faculty_id?: string | null;
          title?: string;
          description?: string | null;
          assigned_date?: string;
          due_date?: string;
          max_marks?: number;
          weightage?: number;
          rubric?: Json | null;
          status?: AssignmentStatus;
          created_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          file_url: string;
          file_name: string;
          file_size: string | null;
          notes: string | null;
          marks_obtained: number | null;
          feedback: string | null;
          status: SubmissionStatus;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          file_url: string;
          file_name: string;
          file_size?: string | null;
          notes?: string | null;
          marks_obtained?: number | null;
          feedback?: string | null;
          status?: SubmissionStatus;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          student_id?: string;
          file_url?: string;
          file_name?: string;
          file_size?: string | null;
          notes?: string | null;
          marks_obtained?: number | null;
          feedback?: string | null;
          status?: SubmissionStatus;
          submitted_at?: string;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          course_id: string;
          student_id: string;
          session_date: string;
          session_topic: string | null;
          status: AttendanceStatus;
          recorded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          student_id: string;
          session_date: string;
          session_topic?: string | null;
          status?: AttendanceStatus;
          recorded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          student_id?: string;
          session_date?: string;
          session_topic?: string | null;
          status?: AttendanceStatus;
          recorded_by?: string | null;
          created_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string | null;
          author_name: string;
          author_role: string | null;
          priority: string;
          category: string;
          target_audience: string;
          posted_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_id?: string | null;
          author_name: string;
          author_role?: string | null;
          priority?: string;
          category?: string;
          target_audience?: string;
          posted_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          author_id?: string | null;
          author_name?: string;
          author_role?: string | null;
          priority?: string;
          category?: string;
          target_audience?: string;
          posted_date?: string;
          created_at?: string;
        };
      };
    };
  };
}
