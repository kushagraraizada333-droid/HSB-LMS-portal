import {
  UserProfile,
  Course,
  StudyMaterial,
  AttendanceSummary,
  Assignment,
  AssignmentSubmission,
  Announcement,
  NotificationItem
} from '../types';

export const HSB_CAMPUS_INFO = {
  name: 'Hari Shankar Singhania School of Business',
  shortName: 'HSB',
  institution: 'Hari Shankar Singhania School of Business',
  location: 'P.O. Mahapura, Ajmer Road, Jaipur – 302 026, Rajasthan, India',
  website: 'https://hsb.edu.in',
  contactPhone: '+91 99297 56620',
  contactEmail: 'info@hsb.edu.in',
  admissionsEmail: 'admissions@hsb.edu.in',
  tagline: 'A Specialist for the AI Age | 2-Year Residential MBA',
};

export const DEMO_USERS: Record<string, UserProfile> = {
  student: {
    id: 'usr_student_01',
    email: 'arjun.mehta@hsb.edu.in',
    name: 'Arjun Mehta',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    batch: 'MBA Cohort 2025-27',
    section: 'Section B',
    rollNumber: 'HSB-MBA-2025-042',
    specialization: 'Product Management & AI Strategy',
    cgpa: 3.84,
    trimester: 3,
    phone: '+91 98765 43210',
    department: 'Hari Shankar Singhania School of Business'
  },
  faculty: {
    id: 'usr_faculty_01',
    email: 's.jenkins@hsb.edu.in',
    name: 'Prof. Sarah Jenkins, Ph.D.',
    role: 'faculty',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    designation: 'Chair, Center for Product Leadership & Professor of Valuation',
    department: 'Finance, Strategy & AI Business Models',
    officeRoom: 'Management Block, Room 204, HSB Campus, Jaipur',
    qualifications: 'Ph.D. (Wharton), CFA Charterholder, M.Sc. (LSE)',
    phone: '+91 99297 56620'
  },
  admin: {
    id: 'usr_admin_01',
    email: 'registrar@hsb.edu.in',
    name: 'Dr. Vikram Sen',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    designation: 'Chief Academic Registrar & Director of Student Affairs',
    department: 'Office of Academic Affairs, HSB Jaipur',
    officeRoom: 'Administrative Block, Central Campus, Jaipur',
    phone: '+91 99297 56620'
  }
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs_01',
    code: 'PRD-601',
    title: 'Product Strategy & AI-Driven Business Models',
    credits: 3,
    trimester: 3,
    facultyId: 'usr_faculty_01',
    facultyName: 'Prof. Sarah Jenkins, Ph.D.',
    description: 'Foundations of tech-product discovery, GenAI integration frameworks, unit economics, and platform network effects.',
    department: 'Product & AI Leadership',
    schedule: 'Mon & Wed, 10:00 AM - 11:30 AM',
    room: 'Amphitheater Hall 1 (HSB Campus)',
    totalEnrolled: 62,
    color: 'from-blue-700 to-indigo-900'
  },
  {
    id: 'crs_02',
    code: 'FIN-602',
    title: 'Corporate Valuation & Financial Modeling',
    credits: 3,
    trimester: 3,
    facultyId: 'usr_faculty_02',
    facultyName: 'Dr. Anand Kulkarni',
    description: 'Advanced DCF modeling, LBO scenarios, merger synergies, and venture investing frameworks.',
    department: 'Finance & Economics',
    schedule: 'Tue & Thu, 11:45 AM - 01:15 PM',
    room: 'Executive Seminar Hall B',
    totalEnrolled: 62,
    color: 'from-blue-800 to-slate-900'
  },
  {
    id: 'crs_03',
    code: 'MKT-605',
    title: 'Digital Customer Intelligence & Growth Hacking',
    credits: 3,
    trimester: 3,
    facultyId: 'usr_faculty_03',
    facultyName: 'Prof. Ritu Oberoi',
    description: 'Omnichannel attribution, customer lifetime value (LTV), cohort retention curves, and algorithmic experimentation.',
    department: 'Marketing & Digital Strategy',
    schedule: 'Mon & Fri, 02:00 PM - 03:30 PM',
    room: 'Design Thinking Studio 2',
    totalEnrolled: 58,
    color: 'from-sky-700 to-blue-900'
  },
  {
    id: 'crs_04',
    code: 'STR-604',
    title: 'Technology, Design & Competitive Strategy',
    credits: 3,
    trimester: 3,
    facultyId: 'usr_faculty_04',
    facultyName: 'Prof. David Vance',
    description: 'Business model innovation at the intersection of design thinking, computational technology, and strategic moats.',
    department: 'Strategy & Leadership',
    schedule: 'Wed & Fri, 03:45 PM - 05:15 PM',
    room: 'Case Amphitheater C',
    totalEnrolled: 54,
    color: 'from-indigo-800 to-blue-950'
  },
  {
    id: 'crs_05',
    code: 'ANL-603',
    title: 'Data Science & SQL for Executive Decision Making',
    credits: 2,
    trimester: 3,
    facultyId: 'usr_faculty_05',
    facultyName: 'Dr. Meera Nambiar',
    description: 'Querying enterprise data warehouses, predictive cohort modeling in Python, and automated business KPI pipelines.',
    department: 'Analytics & Information Systems',
    schedule: 'Saturday, 09:30 AM - 01:00 PM',
    room: 'FinTech & Simulation Lab',
    totalEnrolled: 62,
    color: 'from-blue-600 to-indigo-800'
  }
];

export const MOCK_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat_01',
    courseId: 'crs_01',
    courseCode: 'PRD-601',
    title: 'Session 01-04: AI Product Discovery & Market Validation Framework',
    description: 'Comprehensive guide covering problem validation, prompt-engineering pipelines for user interviews, and PRD blueprints.',
    type: 'pdf',
    fileUrl: '#download-prd-guide',
    fileSize: '4.8 MB',
    uploadedAt: '2026-10-18',
    uploadedBy: 'Prof. Sarah Jenkins, Ph.D.',
    moduleNumber: 1
  },
  {
    id: 'mat_02',
    courseId: 'crs_01',
    courseCode: 'PRD-601',
    title: 'Harvard & HSB Case Study: Enterprise AI Agents in Supply Chains',
    description: 'Mandatory preparatory reading for Week 4 seminar discussion. Includes financial metrics and operational audit logs.',
    type: 'pdf',
    fileUrl: '#download-case-study',
    fileSize: '2.1 MB',
    uploadedAt: '2026-10-21',
    uploadedBy: 'Prof. Sarah Jenkins, Ph.D.',
    moduleNumber: 2
  },
  {
    id: 'mat_03',
    courseId: 'crs_02',
    courseCode: 'FIN-602',
    title: 'Lecture Slides: Multi-Stage DCF & Terminal Value Sensitivity',
    description: 'Official slide deck covering WACC computations, normalized capital expenditures, and Monte Carlo risk simulations.',
    type: 'ppt',
    fileUrl: '#download-dcf-deck',
    fileSize: '11.8 MB',
    uploadedAt: '2026-10-24',
    uploadedBy: 'Dr. Anand Kulkarni',
    moduleNumber: 2
  },
  {
    id: 'mat_04',
    courseId: 'crs_03',
    courseCode: 'MKT-605',
    title: 'Kaggle Dataset: SaaS Subscriber Retention & Churn Probabilities',
    description: 'Sanitized dataset with 30,000 observations and exploratory survival analysis scripts for the term lab.',
    type: 'link',
    fileUrl: 'https://github.com/hsb-jaipur/mba-analytics-datasets',
    uploadedAt: '2026-10-22',
    uploadedBy: 'Prof. Ritu Oberoi',
    moduleNumber: 2
  },
  {
    id: 'mat_05',
    courseId: 'crs_05',
    courseCode: 'ANL-603',
    title: 'PostgreSQL & Window Functions Playbook for Business Analysts',
    description: 'Reference handbook on CTEs, recursive queries, and JSONB aggregations for marketing attribution models.',
    type: 'pdf',
    fileUrl: '#download-sql-playbook',
    fileSize: '1.6 MB',
    uploadedAt: '2026-10-10',
    uploadedBy: 'Dr. Meera Nambiar',
    moduleNumber: 1
  }
];

export const MOCK_ATTENDANCE_SUMMARY: AttendanceSummary[] = [
  {
    courseId: 'crs_01',
    courseCode: 'PRD-601',
    courseTitle: 'Product Strategy & AI Business Models',
    totalClasses: 22,
    attendedClasses: 20,
    percentage: 90.9,
    status: 'good'
  },
  {
    courseId: 'crs_02',
    courseCode: 'FIN-602',
    courseTitle: 'Corporate Valuation & Financial Modeling',
    totalClasses: 20,
    attendedClasses: 18,
    percentage: 90.0,
    status: 'good'
  },
  {
    courseId: 'crs_03',
    courseCode: 'MKT-605',
    courseTitle: 'Digital Customer Intelligence & Growth',
    totalClasses: 21,
    attendedClasses: 18,
    percentage: 85.7,
    status: 'good'
  },
  {
    courseId: 'crs_04',
    courseCode: 'STR-604',
    courseTitle: 'Technology, Design & Competitive Strategy',
    totalClasses: 19,
    attendedClasses: 15,
    percentage: 78.9,
    status: 'warning'
  },
  {
    courseId: 'crs_05',
    courseCode: 'ANL-603',
    courseTitle: 'Data Science & SQL for Decision Making',
    totalClasses: 12,
    attendedClasses: 12,
    percentage: 100.0,
    status: 'good'
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_01',
    courseId: 'crs_01',
    courseCode: 'PRD-601',
    courseTitle: 'Product Strategy & AI Business Models',
    facultyId: 'usr_faculty_01',
    title: 'Executive Deliverable: Autonomous AI Agent PRD & Go-To-Market Plan',
    description: 'Construct a complete product requirements document (PRD) with pricing architecture, target personas, and risk bounds for an autonomous enterprise workflow agent. Submit your 4-page memo and spreadsheet model.',
    assignedDate: '2026-10-15',
    dueDate: '2026-11-04 23:59',
    maxMarks: 50,
    submissionCount: 48,
    totalStudents: 62,
    status: 'open'
  },
  {
    id: 'asg_02',
    courseId: 'crs_02',
    courseCode: 'FIN-602',
    courseTitle: 'Corporate Valuation & Financial Modeling',
    facultyId: 'usr_faculty_02',
    title: 'Syndicate Project: LBO Valuation for B2B FinTech Platform',
    description: 'Model senior debt tranches, mezzanine financing, and exit multiple sensitivity across conservative, base, and aggressive scenarios for a Series C target.',
    assignedDate: '2026-10-18',
    dueDate: '2026-11-09 18:00',
    maxMarks: 100,
    submissionCount: 12,
    totalStudents: 15,
    status: 'open'
  },
  {
    id: 'asg_03',
    courseId: 'crs_03',
    courseCode: 'MKT-605',
    courseTitle: 'Digital Customer Intelligence & Growth',
    facultyId: 'usr_faculty_03',
    title: 'Lab Submission 2: Survival Modeling for Subscription Retention',
    description: 'Fit Cox proportional hazards regression models on the SaaS dataset, estimate hazard ratios, and plot Kaplan-Meier customer survival curves.',
    assignedDate: '2026-10-08',
    dueDate: '2026-10-25 23:59',
    maxMarks: 30,
    submissionCount: 57,
    totalStudents: 58,
    status: 'grading'
  },
  {
    id: 'asg_04',
    courseId: 'crs_05',
    courseCode: 'ANL-603',
    courseTitle: 'Data Science & SQL for Executive Decision Making',
    facultyId: 'usr_faculty_05',
    title: 'SQL Sprint: Multi-Touch Conversion Attribution Queries',
    description: 'Author window functions, self-joins, and common table expressions to attribute user conversions across Linear and Time-Decay attribution schemas.',
    assignedDate: '2026-09-28',
    dueDate: '2026-10-12 23:59',
    maxMarks: 25,
    submissionCount: 62,
    totalStudents: 62,
    status: 'closed'
  }
];

export const MOCK_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub_01',
    assignmentId: 'asg_03',
    assignmentTitle: 'Lab Submission 2: Survival Modeling for Subscription Retention',
    courseCode: 'MKT-605',
    studentId: 'usr_student_01',
    studentName: 'Arjun Mehta',
    studentRoll: 'HSB-MBA-2025-042',
    submittedAt: '2026-10-24 19:42',
    fileName: 'Arjun_Mehta_HSB_MKT605_Lab2_Survival.pdf',
    fileSize: '3.4 MB',
    notes: 'Cross-validated Python lifelines library survival bounds against R survival package.',
    marksObtained: 28,
    maxMarks: 30,
    feedback: 'Rigorous statistical interpretation of hazard ratios. Excellent clarity in visualization of retention curves.',
    status: 'graded'
  },
  {
    id: 'sub_02',
    assignmentId: 'asg_04',
    assignmentTitle: 'SQL Sprint: Multi-Touch Conversion Attribution Queries',
    courseCode: 'ANL-603',
    studentId: 'usr_student_01',
    studentName: 'Arjun Mehta',
    studentRoll: 'HSB-MBA-2025-042',
    submittedAt: '2026-10-11 21:15',
    fileName: 'Arjun_Mehta_HSB_ANL603_Attribution.sql',
    fileSize: '18 KB',
    notes: 'All 8 query schemas executed with optimized execution plans.',
    marksObtained: 25,
    maxMarks: 25,
    feedback: 'Flawless query plan and clean indexing syntax.',
    status: 'graded'
  },
  {
    id: 'sub_03',
    assignmentId: 'asg_01',
    assignmentTitle: 'Executive Deliverable: Autonomous AI Agent PRD',
    courseCode: 'PRD-601',
    studentId: 'usr_student_02',
    studentName: 'Priya Sharma',
    studentRoll: 'HSB-MBA-2025-018',
    submittedAt: '2026-10-27 14:30',
    fileName: 'Priya_Sharma_HSB_AI_Agent_PRD.pdf',
    fileSize: '4.9 MB',
    notes: 'Attached sensitivity model in appendix.',
    maxMarks: 50,
    status: 'submitted'
  },
  {
    id: 'sub_04',
    assignmentId: 'asg_01',
    assignmentTitle: 'Executive Deliverable: Autonomous AI Agent PRD',
    courseCode: 'PRD-601',
    studentId: 'usr_student_03',
    studentName: 'Rohan Gupta',
    studentRoll: 'HSB-MBA-2025-067',
    submittedAt: '2026-10-27 18:10',
    fileName: 'Rohan_Gupta_HSB_PRD601_Deliverable.pdf',
    fileSize: '3.1 MB',
    notes: 'Submitted on behalf of Syndicate 4.',
    maxMarks: 50,
    status: 'submitted'
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_01',
    title: 'Campus Placement Season: Summer Internship Drive Kickoff (CRPC)',
    content: 'The Corporate Relations & Placement Committee (CRPC) at HSB Jaipur is pleased to announce that Summer Internship recruitment commences for the MBA Class of 2027 on November 15, 2026. Top consulting firms, leading tech enterprises, and prominent corporate partners from the JK Organisation will be conducting pre-placement talks starting next Monday. Verified CV submissions close on November 5.',
    authorName: 'Placement Office (CRPC)',
    authorRole: 'HSB Corporate Relations & Placements',
    postedDate: '2026-10-27',
    priority: 'urgent',
    targetAudience: 'students',
    category: 'placement'
  },
  {
    id: 'ann_02',
    title: 'Guest Masterclass: AI Product Leadership in Modern Enterprises',
    content: 'We are honored to host Mr. Rajesh Iyer, Senior Product Director at an enterprise AI unicorn, for an interactive seminar in the Main Amphitheater. Open to all candidates enrolled in Product Strategy (PRD-601) and Data Science electives. Attendance is mandatory.',
    authorName: 'Prof. Sarah Jenkins, Ph.D.',
    authorRole: 'Chair, Center for Product Leadership',
    postedDate: '2026-10-25',
    priority: 'high',
    targetAudience: 'all',
    category: 'academic'
  },
  {
    id: 'ann_03',
    title: 'Mid-Trimester Examination Protocol & Turnitin Guidelines',
    content: 'Mid-Trimester exams for Trimester III will take place between November 18 and November 24, 2026. Closed-book protocols apply for analytical subjects. Turnitin similarity scores for case submissions must remain below 12%. No grace extensions will be permitted without prior written medical approval from the Registrar.',
    authorName: 'Dr. Vikram Sen',
    authorRole: 'Chief Academic Registrar, HSB Jaipur',
    postedDate: '2026-10-20',
    priority: 'high',
    targetAudience: 'all',
    category: 'administrative'
  },
  {
    id: 'ann_04',
    title: 'Annual HSB Jaipur Innovation & Product Conclave 2026',
    content: 'Delegate pass registrations for the Annual HSB Jaipur Innovation & Product Conclave are now live. Keynote speakers include global Product Leaders, Founders, and Venture Partners. Student organizing committee volunteers receive experiential leadership credits.',
    authorName: 'Student Affairs Council',
    authorRole: 'HSB Student Leadership',
    postedDate: '2026-10-18',
    priority: 'medium',
    targetAudience: 'all',
    category: 'event'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'Grade Published: MKT-605',
    message: 'Prof. Ritu Oberoi has graded your Lab 2 submission (28/30 marks awarded).',
    timestamp: '15 mins ago',
    read: false,
    type: 'grade',
    link: '/student/grades'
  },
  {
    id: 'notif_02',
    title: 'Upcoming Deadline in 6 Days',
    message: 'PRD-601: Autonomous AI Agent PRD memo is due on Nov 4.',
    timestamp: '2 hours ago',
    read: false,
    type: 'assignment',
    link: '/student/assignments'
  },
  {
    id: 'notif_03',
    title: 'CRPC Summer Internship Bulletin',
    message: 'Summer Internship Drive 2026-27 schedule published by Corporate Relations.',
    timestamp: '5 hours ago',
    read: true,
    type: 'announcement',
    link: '/student/announcements'
  },
  {
    id: 'notif_04',
    title: 'Attendance Notice: STR-604',
    message: 'Your current attendance in STR-604 is 78.9%. Minimum required is 80%.',
    timestamp: '1 day ago',
    read: true,
    type: 'attendance',
    link: '/student/attendance'
  }
];

export const MOCK_STUDENTS_LIST: UserProfile[] = [
  {
    id: 'usr_student_01',
    email: 'arjun.mehta@hsb.edu.in',
    name: 'Arjun Mehta',
    role: 'student',
    batch: 'MBA 2025-27',
    section: 'Section B',
    rollNumber: 'HSB-MBA-2025-042',
    specialization: 'Product Management & AI Strategy',
    cgpa: 3.84,
    trimester: 3,
    phone: '+91 98765 43210',
    department: 'Hari Shankar Singhania School of Business'
  },
  {
    id: 'usr_student_02',
    email: 'priya.sharma@hsb.edu.in',
    name: 'Priya Sharma',
    role: 'student',
    batch: 'MBA 2025-27',
    section: 'Section A',
    rollNumber: 'HSB-MBA-2025-018',
    specialization: 'Marketing & Digital Strategy',
    cgpa: 3.92,
    trimester: 3,
    phone: '+91 98765 43211',
    department: 'Hari Shankar Singhania School of Business'
  },
  {
    id: 'usr_student_03',
    email: 'rohan.gupta@hsb.edu.in',
    name: 'Rohan Gupta',
    role: 'student',
    batch: 'MBA 2025-27',
    section: 'Section B',
    rollNumber: 'HSB-MBA-2025-067',
    specialization: 'Finance, FinTech & Valuation',
    cgpa: 3.71,
    trimester: 3,
    phone: '+91 98765 43212',
    department: 'Hari Shankar Singhania School of Business'
  },
  {
    id: 'usr_student_04',
    email: 'ananya.iyer@hsb.edu.in',
    name: 'Ananya Iyer',
    role: 'student',
    batch: 'MBA 2025-27',
    section: 'Section A',
    rollNumber: 'HSB-MBA-2025-009',
    specialization: 'Technology & Operations Excellence',
    cgpa: 3.89,
    trimester: 3,
    phone: '+91 98765 43213',
    department: 'Hari Shankar Singhania School of Business'
  },
  {
    id: 'usr_student_05',
    email: 'kabir.verma@hsb.edu.in',
    name: 'Kabir Verma',
    role: 'student',
    batch: 'MBA 2025-27',
    section: 'Section C',
    rollNumber: 'HSB-MBA-2025-112',
    specialization: 'AI Analytics & Strategy',
    cgpa: 3.65,
    trimester: 3,
    phone: '+91 98765 43214',
    department: 'Hari Shankar Singhania School of Business'
  },
  {
    id: 'usr_student_06',
    email: 'tanya.deshmukh@hsb.edu.in',
    name: 'Tanya Deshmukh',
    role: 'student',
    batch: 'MBA 2024-26',
    section: 'Section A',
    rollNumber: 'HSB-MBA-2024-031',
    specialization: 'Product Leadership & Design',
    cgpa: 3.78,
    trimester: 6,
    phone: '+91 98765 43215',
    department: 'Hari Shankar Singhania School of Business'
  }
];

export const MOCK_FACULTY_LIST: UserProfile[] = [
  {
    id: 'usr_faculty_01',
    email: 's.jenkins@hsb.edu.in',
    name: 'Prof. Sarah Jenkins, Ph.D.',
    role: 'faculty',
    designation: 'Chair, Center for Product Leadership & Professor of Valuation',
    department: 'Finance, Strategy & AI Business Models',
    officeRoom: 'Management Block, Room 204, HSB Campus, Jaipur',
    qualifications: 'Ph.D. (Wharton), CFA, M.Sc. (LSE)',
    phone: '+91 99297 56620'
  },
  {
    id: 'usr_faculty_02',
    email: 'a.kulkarni@hsb.edu.in',
    name: 'Dr. Anand Kulkarni',
    role: 'faculty',
    designation: 'Professor of Corporate Finance & Private Equity',
    department: 'Finance & Economics',
    officeRoom: 'Management Block, Room 212, HSB Campus',
    qualifications: 'Ph.D. (IIM Ahmedabad), FPM',
    phone: '+91 99297 56621'
  },
  {
    id: 'usr_faculty_03',
    email: 'r.oberoi@hsb.edu.in',
    name: 'Prof. Ritu Oberoi',
    role: 'faculty',
    designation: 'Chair, Center for Customer Intelligence & Digital Growth',
    department: 'Marketing & Digital Strategy',
    officeRoom: 'Design Block, Room 104, HSB Campus',
    qualifications: 'Ph.D. (Northwestern Kellogg)',
    phone: '+91 99297 56622'
  },
  {
    id: 'usr_faculty_04',
    email: 'd.vance@hsb.edu.in',
    name: 'Prof. David Vance',
    role: 'faculty',
    designation: 'Distinguished Professor of Strategy & Operations',
    department: 'Technology, Design & Operations',
    officeRoom: 'Innovation Block, Room 209',
    qualifications: 'M.S. (MIT Sloan), CSCP',
    phone: '+91 99297 56623'
  },
  {
    id: 'usr_faculty_05',
    email: 'm.nambiar@hsb.edu.in',
    name: 'Dr. Meera Nambiar',
    role: 'faculty',
    designation: 'Associate Professor of AI & Business Analytics',
    department: 'Analytics & Information Systems',
    officeRoom: 'Tech Block, Room 105, HSB Campus',
    qualifications: 'Ph.D. (Carnegie Mellon)',
    phone: '+91 99297 56624'
  }
];

export const MOCK_STUDENT_GRADES = [
  {
    trimester: 'Trimester I (Autumn 2025)',
    gpa: 3.82,
    credits: 18,
    courses: [
      { code: 'MGT-501', title: 'Financial Accounting & Reporting', credits: 3, grade: 'A', gpa: 4.0 },
      { code: 'MGT-502', title: 'Managerial Economics for Decision Makers', credits: 3, grade: 'A-', gpa: 3.7 },
      { code: 'MGT-503', title: 'Organizational Leadership & Design Thinking', credits: 3, grade: 'A', gpa: 4.0 },
      { code: 'MGT-504', title: 'Marketing Management in Digital Age', credits: 3, grade: 'B+', gpa: 3.3 },
      { code: 'MGT-505', title: 'Computational Statistics & Data Analysis', credits: 3, grade: 'A', gpa: 4.0 },
      { code: 'MGT-506', title: 'Executive Communication & Negotiation', credits: 3, grade: 'A', gpa: 4.0 }
    ]
  },
  {
    trimester: 'Trimester II (Winter 2025-26)',
    gpa: 3.86,
    credits: 18,
    courses: [
      { code: 'MGT-507', title: 'Corporate Finance & Capital Markets', credits: 3, grade: 'A', gpa: 4.0 },
      { code: 'MGT-508', title: 'Macroeconomics, Global Trade & Policy', credits: 3, grade: 'A-', gpa: 3.7 },
      { code: 'MGT-509', title: 'Operations & Supply Chain Excellence', credits: 3, grade: 'A', gpa: 4.0 },
      { code: 'MGT-510', title: 'Corporate Governance & Business Ethics', credits: 3, grade: 'A', gpa: 4.0 },
      { code: 'MGT-511', title: 'Quantitative Research Methodologies', credits: 3, grade: 'B+', gpa: 3.3 },
      { code: 'MGT-512', title: 'Design Thinking & AI Innovation Sprint', credits: 3, grade: 'A', gpa: 4.0 }
    ]
  },
  {
    trimester: 'Trimester III (Spring 2026 - Current)',
    gpa: 3.84,
    credits: 14,
    status: 'In Progress',
    courses: [
      { code: 'PRD-601', title: 'Product Strategy & AI-Driven Business Models', credits: 3, grade: 'IP (Projected A)', gpa: 4.0 },
      { code: 'FIN-602', title: 'Corporate Valuation & Financial Modeling', credits: 3, grade: 'IP (Projected A)', gpa: 4.0 },
      { code: 'MKT-605', title: 'Digital Customer Intelligence & Growth', credits: 3, grade: 'IP (Projected A)', gpa: 4.0 },
      { code: 'STR-604', title: 'Technology, Design & Competitive Strategy', credits: 3, grade: 'IP (Projected B+)', gpa: 3.3 },
      { code: 'ANL-603', title: 'Data Science & SQL for Executive Decision Making', credits: 2, grade: 'IP (Projected A)', gpa: 4.0 }
    ]
  }
];

export const MOCK_COLLEGE_STATS = {
  institutionName: 'Hari Shankar Singhania School of Business',
  location: 'HSB Central Campus, Jaipur',
  totalStudents: 480,
  cohorts: [
    { name: 'MBA Batch 2025-27 (First Year)', count: 240, activeTrimester: 3 },
    { name: 'MBA Batch 2024-26 (Second Year)', count: 240, activeTrimester: 6 }
  ],
  totalFaculty: 34,
  activeCourses: 28,
  averageAttendance: 91.4,
  placementRate: 98.2,
  medianPackage: '18 LPA',
  highestPackage: '21 LPA',
  averagePackage: '16.09 LPA',
  internshipRate: '100%'
};
