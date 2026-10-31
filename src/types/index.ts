export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  department?: string;
  // Student-specific fields
  batch?: string;          // e.g. "MBA 2025-27"
  section?: string;        // e.g. "Section B"
  rollNumber?: string;     // e.g. "MBA-2025-042"
  specialization?: string; // e.g. "Finance & FinTech"
  cgpa?: number;           // e.g. 3.84
  trimester?: number;      // e.g. 3
  // Faculty-specific fields
  designation?: string;    // e.g. "Associate Professor of Finance"
  officeRoom?: string;     // e.g. "Academic Block 2, Room 304"
  qualifications?: string; // e.g. "Ph.D. (IIM Ahmedabad), CFA"
}

export interface Course {
  id: string;
  code: string;            // e.g. "FIN-601"
  title: string;           // e.g. "Corporate Valuation & Financial Modeling"
  credits: number;         // e.g. 3
  trimester: number;
  facultyId: string;
  facultyName: string;
  description: string;
  department: string;
  schedule: string;        // e.g. "Mon, Wed 10:00 AM - 11:30 AM"
  room: string;            // e.g. "Lecture Hall 102"
  totalEnrolled: number;
  color?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  grade?: string;          // e.g. "A", "B+", "A-"
  gradePoint?: number;     // e.g. 4.0, 3.5
  status: 'active' | 'completed' | 'dropped';
}

export type MaterialType = 'pdf' | 'ppt' | 'link' | 'video' | 'doc';

export interface StudyMaterial {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  description: string;
  type: MaterialType;
  fileUrl: string;
  fileSize?: string;
  uploadedAt: string;
  uploadedBy: string;
  uploadedById?: string;
  moduleNumber: number;
}

export interface StudentPersonalMaterial {
  id: string;
  studentId: string;
  courseId?: string;
  courseCode?: string;
  title: string;
  description: string;
  type: MaterialType;
  fileUrl: string;
  fileSize?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  date: string;
  sessionNumber: number;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface AttendanceSummary {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: 'good' | 'warning' | 'critical'; // Good: >=80%, Warning: 75-79%, Critical: <75%
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  facultyId: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  submissionCount?: number;
  totalStudents?: number;
  status: 'open' | 'closed' | 'grading';
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseCode: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  notes?: string;
  marksObtained?: number;
  maxMarks: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  postedDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'students' | 'faculty';
  category: 'academic' | 'placement' | 'event' | 'administrative';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'grade' | 'announcement' | 'attendance';
  link?: string;
}
