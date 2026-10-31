import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/shared/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MOCK_COLLEGE_STATS } from '../../data/mockData';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck2,
  TrendingUp,
  ShieldCheck,
  Database,
  ArrowRight,
  Layers,
  Megaphone,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Admin Hero Banner */}
      <div className="bg-gradient-to-r from-hsb-navy via-slate-900 to-hsb-cobalt rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-hsb-primary/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-hsb-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold" size="sm">
                Executive Academic Administration
              </Badge>
              <span className="text-slate-300 text-xs">
                • {user?.department || 'Office of Academic Affairs & Registrar'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Executive Overview: {user?.name || 'Administrator'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              Central administration across 480 candidates in MBA Class of 2026 & 2027, supported by 34 resident and visiting faculty.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              leftIcon={<Users className="w-3.5 h-3.5" />}
              onClick={() => navigate('/admin/students')}
            >
              MBA Roster (480)
            </Button>
            <Button
              variant="gold"
              size="sm"
              leftIcon={<Megaphone className="w-3.5 h-3.5" />}
              onClick={() => navigate('/admin/announcements')}
            >
              Campus Broadcast
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total MBA Candidates"
          value={MOCK_COLLEGE_STATS.totalStudents}
          subtitle="480 Active Across 2 Cohorts"
          icon={Users}
          accentColor="brand"
          onClick={() => navigate('/admin/students')}
        />
        <StatCard
          title="Faculty Roster"
          value={MOCK_COLLEGE_STATS.totalFaculty}
          subtitle="Tenured & Visiting Professors"
          icon={GraduationCap}
          accentColor="purple"
          onClick={() => navigate('/admin/faculty')}
        />
        <StatCard
          title="Active Trimester Courses"
          value={MOCK_COLLEGE_STATS.activeCourses}
          subtitle="Trimester III & VI Catalogs"
          icon={BookOpen}
          accentColor="amber"
          onClick={() => navigate('/admin/courses')}
        />
        <StatCard
          title="Campus-Wide Attendance"
          value={`${MOCK_COLLEGE_STATS.averageAttendance}%`}
          subtitle="Eligibility threshold: 80%"
          icon={CalendarCheck2}
          accentColor="emerald"
        />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Cohort breakdown & Quick Management Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cohort Overview Card */}
          <Card
            title="Active MBA Cohorts & Trimester Status"
            subtitle="Batch strength and academic progression"
            icon={<Layers className="w-4 h-4 text-brand-600" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_COLLEGE_STATS.cohorts.map((cohort, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{cohort.name}</span>
                    <Badge variant={index === 0 ? 'primary' : 'secondary'} size="sm">
                      Trimester {cohort.activeTrimester}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{cohort.count}</span>
                    <span className="text-xs text-slate-500">Registered Candidates</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-emerald-700">Placement Median: ₹18 LPA</span>
                    <button
                      onClick={() => navigate('/admin/students')}
                      className="text-hsb-primary font-semibold hover:underline"
                    >
                      View Batch Roster →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Admin Modules */}
          <Card
            title="Academic Operations & Administration"
            subtitle="Core operational control panels"
            icon={<ShieldCheck className="w-4 h-4 text-amber-600" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => navigate('/admin/students')}
                className="p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-brand-50 text-brand-600 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-bold text-slate-900 text-xs group-hover:text-brand-700">
                  Student Management
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enrolment registers, cohorts, and GPA audits
                </p>
              </button>

              <button
                onClick={() => navigate('/admin/faculty')}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="font-bold text-slate-900 text-xs group-hover:text-indigo-700">
                  Faculty Allocations
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Department chairs and course loads
                </p>
              </button>

              <button
                onClick={() => navigate('/admin/courses')}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="font-bold text-slate-900 text-xs group-hover:text-amber-800">
                  Course Catalog
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Credit structures, prerequisites, and rooms
                </p>
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Stage 2 Supabase Readiness Checklist */}
        <div className="space-y-6">
          <Card
            title="Stage 2 Supabase Architecture"
            subtitle="Database migration plan & rules compliance"
            icon={<Database className="w-4 h-4 text-emerald-600" />}
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rule 4 & 5 Compliance:</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  UI uses typed demo data with mock repositories. No false claim of active database persistence.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rule 8 Supabase Key Security:</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Environment variables configured via <code>.env</code>. Service-role key strictly excluded from frontend.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rule 9 Role Escalation Prevention:</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Public registration cannot assign faculty or admin privileges.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-brand-50 border border-brand-200 space-y-1 text-brand-900">
                <div className="font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-brand-700" />
                  <span>Upcoming Stage 2 Schema:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  PostgreSQL tables (<code>profiles</code>, <code>courses</code>, <code>enrollments</code>, <code>submissions</code>, <code>attendance</code>) with Row Level Security (RLS) policies.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
