import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/shared/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  MOCK_COURSES,
  MOCK_ASSIGNMENTS,
  MOCK_ANNOUNCEMENTS,
  HSB_CAMPUS_INFO
} from '../../data/mockData';
import {
  Award,
  BookOpen,
  CalendarCheck2,
  Clock,
  ArrowRight,
  MapPin,
  Calendar,
  AlertTriangle,
  Megaphone,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Upcoming assignments
  const upcomingAssignments = MOCK_ASSIGNMENTS.filter((a) => a.status === 'open');

  return (
    <div className="space-y-6">
      {/* HSB Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1d3c74] via-[#16488d] to-[#0d1d3a] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-[#244a9a]/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#1955a6]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="gold" size="sm">
                {user?.batch || 'MBA Cohort 2025–27'}
              </Badge>
              <span className="text-blue-200 text-xs">• {user?.section || 'Section B'} • Trimester {user?.trimester || 'III'}</span>
              {user?.specialization && (
                <span className="text-blue-300 text-xs">• {user.specialization}</span>
              )}
              {user?.rollNumber && (
                <span className="text-blue-300 text-xs font-mono">• Roll: {user.rollNumber}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif">
              Welcome back, {user?.name || 'Candidate'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              2-Year Residential MBA Portal • Trimester {user?.trimester || 'III'} curriculum and syndicate assignments.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/25 hover:bg-white/20"
              onClick={() => navigate('/student/courses')}
            >
              My Courses
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={() => navigate('/student/assignments')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Deadlines
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cumulative CGPA"
          value={user?.cgpa !== undefined && user?.cgpa !== null ? Number(user.cgpa).toFixed(2) : '3.84'}
          subtitle="Academic Standing"
          icon={Award}
          trend={{ value: '+0.02', isPositive: true, label: 'vs Trimester II' }}
          accentColor="amber"
          onClick={() => navigate('/student/grades')}
        />
        <StatCard
          title="Overall Attendance"
          value="88.4%"
          subtitle="All 5 Courses Combined"
          icon={CalendarCheck2}
          trend={{ value: 'Eligible', isPositive: true, label: 'Min 80% Mandatory' }}
          accentColor="emerald"
          onClick={() => navigate('/student/attendance')}
        />
        <StatCard
          title="Trimester Credits"
          value="14 Hours"
          subtitle="5 Registered Subjects"
          icon={BookOpen}
          accentColor="brand"
          onClick={() => navigate('/student/courses')}
        />
        <StatCard
          title="Pending Deliverables"
          value="2 Deadlines"
          subtitle="Next due in 6 days"
          icon={Clock}
          trend={{ value: 'Action Due', isPositive: false }}
          accentColor="rose"
          onClick={() => navigate('/student/assignments')}
        />
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop): Courses & Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Academic Schedule */}
          <Card
            title="Today's Lecture Schedule"
            subtitle="Wednesday, Trimester Week 7 • Central Campus"
            icon={<Calendar className="w-4 h-4 text-[#1955a6]" />}
            action={
              <Badge variant="primary" size="sm">
                2 Sessions Scheduled
              </Badge>
            }
          >
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-[#ecf2fa]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="px-3 py-2 rounded-lg bg-[#1955a6] text-white text-center font-bold text-xs flex-shrink-0">
                    10:00<br />AM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        Product Strategy & AI-Driven Business Models (PRD-601)
                      </span>
                      <Badge variant="primary" size="sm">Core</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Prof. Sarah Jenkins, Ph.D. • Topic: Autonomous Agent PRDs & Unit Economics
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>Amphitheater Hall 1</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:self-center">
                  <Badge variant="success" size="sm" dot>In Session</Badge>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="px-3 py-2 rounded-lg bg-[#1d3c74] text-white text-center font-bold text-xs flex-shrink-0">
                    03:45<br />PM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        Technology, Design & Competitive Strategy (STR-604)
                      </span>
                      <Badge variant="secondary" size="sm">Case Study</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Prof. David Vance • Topic: Platform Business Models & Moats
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>Case Amphitheater C</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:self-center">
                  <Badge variant="slate" size="sm">Upcoming</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Enrolled Courses Grid */}
          <Card
            title="Enrolled MBA Courses"
            subtitle="Trimester III Academic Curriculum"
            icon={<BookOpen className="w-4 h-4 text-[#1955a6]" />}
            action={
              <button
                onClick={() => navigate('/student/courses')}
                className="text-xs font-semibold text-[#1955a6] hover:underline flex items-center gap-1"
              >
                <span>View All 5 Courses</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_COURSES.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate('/student/courses')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#1955a6] hover:shadow-sm transition-all cursor-pointer bg-white group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1955a6] bg-[#ecf2fa] px-2.5 py-0.5 rounded-md border border-[#a3c5e9]">
                      {course.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {course.credits} Credits
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1955a6] line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">{course.facultyName}</span>
                    <span className="text-[#1955a6] font-semibold group-hover:underline">
                      Syllabus →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col wide): Deadlines & Announcements */}
        <div className="space-y-6">
          {/* Upcoming Assignments Tracker */}
          <Card
            title="Deliverables & Deadlines"
            subtitle="Immediate academic actions"
            icon={<Clock className="w-4 h-4 text-rose-500" />}
            action={
              <button
                onClick={() => navigate('/student/assignments')}
                className="text-xs font-semibold text-[#1955a6] hover:underline"
              >
                Tracker →
              </button>
            }
          >
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="primary" size="sm">
                      {assignment.courseCode}
                    </Badge>
                    <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Due {assignment.dueDate.split(' ')[0]}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {assignment.title}
                  </h5>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Max: {assignment.maxMarks} marks</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="py-1 px-2.5 text-[11px]"
                      onClick={() => navigate('/student/assignments')}
                    >
                      Submit Memo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Campus Bulletins */}
          <Card
            title="Official Campus Bulletins"
            subtitle="Placements, Seminars & Dean Circulars"
            icon={<Megaphone className="w-4 h-4 text-[#1955a6]" />}
            action={
              <button
                onClick={() => navigate('/student/announcements')}
                className="text-xs font-semibold text-[#1955a6] hover:underline"
              >
                All →
              </button>
            }
          >
            <div className="space-y-3">
              {MOCK_ANNOUNCEMENTS.slice(0, 2).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={ann.priority === 'urgent' ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {ann.category.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-slate-400">{ann.postedDate}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 line-clamp-1">
                    {ann.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
