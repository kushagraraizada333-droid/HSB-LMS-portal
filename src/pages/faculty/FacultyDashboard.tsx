import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/shared/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MOCK_SUBMISSIONS, HSB_CAMPUS_INFO } from '../../data/mockData';
import {
  BookOpen,
  Users,
  FileCheck2,
  Clock,
  Upload,
  CalendarCheck2,
  Megaphone,
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Submissions awaiting grading
  const pendingSubmissions = MOCK_SUBMISSIONS.filter((s) => s.status === 'submitted');

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-[#1d3c74] via-[#16488d] to-[#0d1d3a] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-[#244a9a]/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#1955a6]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold" size="sm">
                Faculty & Academic Chair
              </Badge>
              <span className="text-blue-200 text-xs">
                • {user?.department || 'Product & AI Strategy'} {user?.officeRoom ? `• ${user.officeRoom}` : '• Faculty Wing, Room 204'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif">
              Welcome, {user?.name || 'Professor'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Leading the Center for Product Leadership across 2 course sections with 120 enrolled MBA candidates. 14 syndicate deliverables are awaiting midterm evaluation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/25 hover:bg-white/20"
              leftIcon={<CalendarCheck2 className="w-3.5 h-3.5" />}
              onClick={() => navigate('/faculty/attendance')}
            >
              Take Attendance
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
              onClick={() => navigate('/faculty/grading')}
            >
              Grade Submissions ({pendingSubmissions.length})
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Courses"
          value="2 Sections"
          subtitle="Product Strategy & Modeling"
          icon={BookOpen}
          accentColor="brand"
          onClick={() => navigate('/faculty/courses')}
        />
        <StatCard
          title="Total Candidates"
          value="120 Students"
          subtitle="MBA Cohort 2025–27"
          icon={Users}
          accentColor="purple"
        />
        <StatCard
          title="Pending Submissions"
          value={`${pendingSubmissions.length} To Review`}
          subtitle="Next batch due Friday"
          icon={FileCheck2}
          trend={{ value: 'Action Needed', isPositive: false }}
          accentColor="amber"
          onClick={() => navigate('/faculty/grading')}
        />
        <StatCard
          title="Next Lecture Today"
          value="10:00 AM"
          subtitle="Amphitheater Hall 1 (HSB)"
          icon={Clock}
          accentColor="emerald"
        />
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Submissions Queue & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Submissions Awaiting Review */}
          <Card
            title="Submissions Queue Awaiting Evaluation"
            subtitle="Recent HSB syndicate deliverables and PRD memos"
            icon={<FileCheck2 className="w-4 h-4 text-[#1955a6]" />}
            action={
              <button
                onClick={() => navigate('/faculty/grading')}
                className="text-xs font-semibold text-[#1955a6] hover:underline flex items-center gap-1"
              >
                <span>Open Grading Portal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            <div className="space-y-3">
              {pendingSubmissions.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#1955a6] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">
                        {sub.courseCode}
                      </Badge>
                      <span className="font-bold text-slate-900 text-xs">
                        {sub.studentName} ({sub.studentRoll})
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      {sub.assignmentTitle}
                    </p>
                    <div className="text-[11px] text-slate-400">
                      File: {sub.fileName} ({sub.fileSize}) • Submitted {sub.submittedAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate('/faculty/grading')}
                    >
                      Evaluate & Grade
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Faculty Toolset */}
          <Card
            title="Course Actions & Content Management"
            subtitle="Rapid shortcuts for curriculum delivery"
            icon={<BookOpen className="w-4 h-4 text-slate-700" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => navigate('/faculty/materials')}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#1955a6] hover:bg-[#ecf2fa]/40 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-[#ecf2fa] text-[#1955a6] w-fit mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="font-bold text-slate-900 text-xs group-hover:text-[#1955a6]">
                  Upload Case Slides
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Attach PDFs, PPTs, and Excel templates
                </div>
              </button>

              <button
                onClick={() => navigate('/faculty/attendance')}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-slate-900 text-xs group-hover:text-emerald-700">
                  Roll Call Register
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Mark today's attendance for Section B
                </div>
              </button>

              <button
                onClick={() => navigate('/faculty/announcements')}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="font-bold text-slate-900 text-xs group-hover:text-amber-800">
                  Post Class Notice
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Broadcast seminar or deadline updates
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Today's Teaching Schedule */}
        <div className="space-y-6">
          <Card
            title="Today's Lecture Schedule"
            subtitle="Faculty Teaching Timetable"
            icon={<Calendar className="w-4 h-4 text-[#1955a6]" />}
          >
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-[#a3c5e9] bg-[#ecf2fa]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    10:00 - 11:30 AM
                  </Badge>
                  <Badge variant="success" size="sm" dot>Next Lecture</Badge>
                </div>
                <h5 className="font-bold text-slate-900 text-xs">
                  Product Strategy & AI Business Models (PRD-601)
                </h5>
                <p className="text-[11px] text-slate-600">
                  Topic: Autonomous Agent PRDs & Unit Economics
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-[#a3c5e9]/40">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Amphitheater Hall 1 • 62 Enrolled</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="slate" size="sm">
                    02:30 - 04:00 PM
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-medium">Management Block</span>
                </div>
                <h5 className="font-bold text-slate-800 text-xs">
                  CRPC Placement Committee Review
                </h5>
                <p className="text-[11px] text-slate-500">
                  Meeting with corporate recruiters and summer internship mentors
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
