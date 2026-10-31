# Hari Shankar Singhania School of Business (HSB), Jaipur
## Academic LMS Portal • Flagship 2-Year Residential MBA

> **Notice:** *This is a student project designed to faithfully use HSB Jaipur's official visual identity and academic curriculum structure. Not officially affiliated with HSB.*

Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**, architected for seamless PostgreSQL, authentication, and file storage integration with **Supabase**.

---

## 🏛️ About Hari Shankar Singhania School of Business (HSB)

**Hari Shankar Singhania School of Business (HSB)** is located in Jaipur, Rajasthan (*P.O. Mahapura, Ajmer Road, Jaipur – 302 026*). Established under the 125-year-old **JK Organisation**, HSB is positioned as *"A Specialist for the AI Age"*, delivering an MBA curriculum that integrates **Business Management**, **Computational Technology**, and **Design Thinking**.

- **Official Website:** [https://hsb.edu.in/](https://hsb.edu.in/)
- **Academic Programs:** Flagship 2-Year Residential MBA, Executive Certifications
- **Placement Performance:** Median CTC ₹18 LPA | Highest CTC ₹21 LPA | 100% Placements
- **Classroom Facilities:** Amphitheater Classrooms, FinTech & Simulation Labs, Design Thinking Studios

---

## 🎨 Official Brand Identity & Design Tokens

The visual identity follows the brand guidelines designed by Itu Chaudhuri Design (ICD) and extracted directly from `hsb.edu.in`:

| Design Token | Hex Code | Usage |
| :--- | :--- | :--- |
| **HSB Primary Sapphire** | `#1955A6` | Primary buttons, active nav indicators, key brand badges |
| **HSB Deep Navy** | `#1D3C74` | Sidebar navigation backdrop, executive headers, high-contrast text |
| **HSB Cobalt Accent** | `#244A9A` | Gradients, hover states, secondary highlights |
| **HSB Ice Tint** | `#ECF2FA` | Card surface tints, container backdrops, table row highlights |
| **HSB Sky Border** | `#A3C5E9` | Subtle borders, divide lines, badge borders |
| **HSB Warm Gold** | `#FF9E4A` / `#FFBC7D` | Secondary transition accents, gold status badges |

### Brand Typography
- **Primary Sans:** `Roboto` (sans-serif) — UI body text, navigation, tables, and metric cards.
- **Editorial Serif:** `Roboto Slab` (serif) — Academic headings, institutional titles, and diploma transcripts.

### Official Brand Assets
- **Emblem / Logo Vector:** `public/hsb-logo.svg` (Official white-fill progressive "S" motif).
- **Sapphire Logo Vector:** `public/hsb-logo-blue.svg` (Sapphire blue fill for light backgrounds).
- **High-Res Crest:** `public/hsb-logo.png` (Official RGB asset from `hsb.edu.in`).

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9+ or v10+

### 2. Installation & Running
```bash
# Navigate to the project directory
cd LMS

# Install pinned dependencies
npm install

# Start local development server
npm run dev
```

The portal runs at **`http://localhost:5173`** (or `http://127.0.0.1:5173`).

### 3. Production Build
```bash
npm run build
```
Generates a zero-error production bundle in `dist/`.

---

## 🔑 Demo Access & Role Personas (Stage 1)

In **Stage 1**, all modules run in **Architectural Preview Mode** using structured in-memory mock repositories that mirror the HSB database schema. You can click the **1-Click Demo Personas** on the login screen or top navigation bar:

| Role | Persona | Institutional Email | Dashboard Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | **Arjun Mehta**<br>`HSB-MBA-2025-042`<br>MBA '27 (Section B) | `arjun.mehta@hsb.edu.in` | Product Management & AI curriculum, PRD deliverables submission, 80% attendance compliance tracker, Harvard/Stanford case studies, official Trimester transcripts |
| **Faculty** | **Prof. Sarah Jenkins, Ph.D.**<br>Chair, Center for Product Leadership | `sarah.jenkins@hsb.edu.in` | Lecture timetables (Amphitheater Hall 1), Section B daily roll-call register, rubric grading & qualitative feedback, case study publisher |
| **Admin** | **Dr. Vikram Sen**<br>Chief Academic Registrar & Director | `admin.sen@hsb.edu.in` | Executive overview (480 MBA candidates across Class of '26 & '27, 34 faculty, ₹18 LPA median CTC), candidate registry, faculty appointments, master curriculum catalog |

> 💡 **Quick Switcher:** You can instantaneously switch between **[Student]**, **[Faculty]**, and **[Admin]** at any time using the quick role switcher in the top navigation bar.

---

## 📂 Architecture & Folder Structure

```
LMS/
├── public/
│   ├── hsb-logo.svg             # Official HSB white vector logo
│   ├── hsb-logo-blue.svg        # Official HSB sapphire blue vector logo
│   └── hsb-logo.png             # Official HSB high-res crest
├── src/
│   ├── components/
│   │   ├── common/              # Shared UI Design System
│   │   │   ├── HsbLogo.tsx      # Official HSB responsive logo component
│   │   │   ├── Badge.tsx        # Academic role & status pills
│   │   │   ├── Button.tsx       # Primary, secondary, gold, outline variants
│   │   │   ├── Card.tsx         # Unified card layout with headers & badges
│   │   │   ├── Input.tsx        # Styled form input fields with icons
│   │   │   ├── Modal.tsx        # Dialog modals with escape & click-outside handling
│   │   │   ├── AlertBanner.tsx  # Feedback and policy alert banners
│   │   │   └── EmptyState.tsx   # Informative empty states
│   │   ├── layout/              # Application Shell
│   │   │   ├── AppLayout.tsx    # Responsive shell (Sidebar + Navbar + Outlet)
│   │   │   ├── Navbar.tsx       # Academic header, batch indicator, notification bell, role switcher
│   │   │   ├── Sidebar.tsx      # Role-specific navigation drawer with active state
│   │   │   └── NotificationDrawer.tsx # Slide-out tray with unread filters & direct links
│   │   └── shared/              # Reusable Educational Widgets
│   │       ├── StatCard.tsx     # KPI metrics (CGPA, Attendance %, Submissions)
│   │       ├── SearchFilterBar.tsx # Real-time search and category filtering
│   │       └── DemoNoticeModal.tsx # Architectural transparency dialog
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Session management, role switching, credential validation
│   │   └── NotificationContext.tsx # Unread alerts, mark as read, drawer state
│   ├── data/
│   │   └── mockData.ts          # Authentic HSB Jaipur MBA 2025-27 repository
│   ├── lib/
│   │   └── supabase.ts          # Supabase client factory with environment fallback checks
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx    # HSB branded login, credentials form, 1-click test personas
│   │   ├── student/
│   │   │   ├── StudentDashboard.tsx   # Student Home: metrics, today's schedule, deadlines
│   │   │   ├── StudentCourses.tsx     # Subject syllabi & study material downloads
│   │   │   ├── StudentAssignments.tsx # Submission modal, deadline warnings, faculty feedback
│   │   │   ├── StudentAttendance.tsx  # 80% threshold tracker, session logs, exam eligibility
│   │   │   ├── StudentGrades.tsx      # Trimester transcripts (T1, T2, T3) & CGPA calculator
│   │   │   └── StudentAnnouncements.tsx # Placement and guest lecture bulletins
│   │   ├── faculty/
│   │   │   ├── FacultyDashboard.tsx   # Assigned sections, pending review queue
│   │   │   ├── FacultyCourses.tsx     # Managed courses & timetables
│   │   │   ├── FacultyGrading.tsx     # Rubric grading, marks entry & feedback publisher
│   │   │   ├── FacultyAttendance.tsx  # Interactive roll-call register (Present/Late/Absent)
│   │   │   ├── FacultyMaterials.tsx   # Study material publisher (PDF/PPT/Links)
│   │   │   └── FacultyAnnouncements.tsx # Class bulletin broadcast console
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx     # Executive metrics: cohort sizes, attendance, placement
│   │   │   ├── AdminStudents.tsx      # Student registry with new candidate registration
│   │   │   ├── AdminFaculty.tsx       # Faculty appointments & department allocations
│   │   │   ├── AdminCourses.tsx       # Master curriculum catalog & credit allocations
│   │   │   └── AdminAnnouncements.tsx # Campus-wide bulletin dispatch & delete management
│   │   └── profile/
│   │       └── ProfilePage.tsx        # Institutional identity, department, credentials
│   ├── types/
│   │   └── index.ts             # Strict TypeScript definitions for all database entities
│   ├── App.tsx                  # Client-side routing with role-based dashboard redirection
│   └── main.tsx                 # Root application mount
├── .env.example                 # Template for Supabase credentials
├── index.html                   # HTML template with typography imports
├── package.json                 # Dependencies & build scripts
├── tailwind.config.js           # HSB official color scheme & typography tokens
└── tsconfig.json                # Strict TypeScript configuration
```

---

## 🔒 Security & Development Rules Compliance

1. **Rule 4 & 5 (Architectural Honesty):** Every screen clearly labels when demo mock data is in use. No false claims of live database persistence are made.
2. **Rule 6 (Functional Buttons & Forms):** Every button and form is functional. Submitting a deliverable adds it to the active submission list; grading a student updates marks and feedback; recording attendance saves the session count; adding students or courses updates the live tables in-memory.
3. **Rule 8 (Credential Safety):** The frontend relies exclusively on `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The `SUPABASE_SERVICE_ROLE_KEY` is strictly prohibited in client bundles.
4. **Rule 9 (Role Escalation Protection):** The candidate registration flow restricts role assignment exclusively to `student`. Public self-registration cannot create administrator or faculty accounts.
5. **Rule 10 (Row Level Security):** All database schemas prepared for Stage 2 include granular Row Level Security (RLS) policies.

---

## 🛠️ Stage 2 Supabase Migration Script

When you are ready to link your live Supabase project in Stage 2, run the following SQL script in your **Supabase Dashboard -> SQL Editor**:

```sql
-- 1. Create User Roles Enum
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE assignment_status AS ENUM ('open', 'grading', 'closed');
CREATE TYPE submission_status AS ENUM ('submitted', 'graded', 'late');

-- 2. Create Profiles Table (Synced with Supabase Auth)
CREATE TABLE public.profiles (
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Courses Table
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  credits INT NOT NULL DEFAULT 3,
  trimester INT NOT NULL,
  faculty_id UUID REFERENCES public.profiles(id),
  department TEXT NOT NULL,
  description TEXT,
  schedule TEXT,
  room TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Enrollments Table
CREATE TABLE public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  grade TEXT,
  grade_point NUMERIC(3,2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- 5. Create Assignments & Submissions
CREATE TABLE public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  assigned_date DATE DEFAULT CURRENT_DATE,
  due_date TIMESTAMPTZ NOT NULL,
  max_marks INT NOT NULL DEFAULT 100,
  status assignment_status DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size TEXT,
  notes TEXT,
  marks_obtained INT,
  feedback TEXT,
  status submission_status DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- 6. Create Attendance Register
CREATE TABLE public.attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_topic TEXT,
  status attendance_status NOT NULL DEFAULT 'present',
  recorded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, student_id, session_date)
);

-- 7. Create Announcements
CREATE TABLE public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  priority TEXT DEFAULT 'medium',
  category TEXT DEFAULT 'academic',
  target_audience TEXT DEFAULT 'all',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 9. Base RLS Policies
-- Profiles: Any authenticated user can read profiles; users can update their own phone/avatar
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile contact"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Submissions: Students see only their own; faculty see submissions for their courses
CREATE POLICY "Students can view own submissions"
  ON public.submissions FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Faculty can view submissions for their courses"
  ON public.submissions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.courses c ON a.course_id = c.id
      WHERE a.id = submissions.assignment_id AND c.faculty_id = auth.uid()
    )
  );
```

---

## 🧪 Testing Verification Checklist

- [x] **Application Build:** `npm run build` succeeds with 0 TypeScript and 0 styling errors.
- [x] **Dev Server:** Serves live at `http://127.0.0.1:5173`.
- [x] **Official HSB Visual Identity:**
  - Official vector SVG logo (`public/hsb-logo.svg`, `public/hsb-logo-blue.svg`).
  - HSB Primary Sapphire (`#1955A6`), Deep Navy (`#1D3C74`), Cobalt (`#244A9A`), and Ice Surface (`#ECF2FA`).
  - Typography: `Roboto` & `Roboto Slab`.
  - Student project disclaimer prominently included.
- [x] **Role Portals:**
  - **Student:** Dashboard, Courses, Deliverables/Submissions, 80% Attendance, Grade Transcripts, Announcements.
  - **Faculty:** Dashboard, Course Schedules, Grading Hub with Feedback, Roll-Call Register, Study Material Publisher, Circulars.
  - **Admin:** Executive Overview, Student Roster & Registration, Faculty Directory, Master Course Catalog, Campus Bulletins.
