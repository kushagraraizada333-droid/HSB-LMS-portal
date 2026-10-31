import React, { useState } from 'react';
import { MOCK_ATTENDANCE_SUMMARY } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/shared/StatCard';
import {
  CalendarCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Info
} from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('crs_01');

  // Simulated session logs for selected course
  const mockSessionLogs = [
    { date: '2026-10-27', session: 'Session 22', topic: 'Autonomous Agent PRDs & Unit Economics', status: 'present' },
    { date: '2026-10-25', session: 'Session 21', topic: 'GenAI Enterprise Architecture Seminar', status: 'present' },
    { date: '2026-10-22', session: 'Session 20', topic: 'Prompt Engineering & User Testing Pipelines', status: 'present' },
    { date: '2026-10-20', session: 'Session 19', topic: 'Product Market Fit in B2B AI Tools', status: 'absent' },
    { date: '2026-10-18', session: 'Session 18', topic: 'Platform Network Effects & Moat Analysis', status: 'present' },
    { date: '2026-10-15', session: 'Session 17', topic: 'Pricing Metrics & Seat-Based vs. Token Models', status: 'present' },
    { date: '2026-10-13', session: 'Session 16', topic: 'Feature Prioritization Matrix (RICE)', status: 'present' },
  ];

  const totalClasses = MOCK_ATTENDANCE_SUMMARY.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const totalAttended = MOCK_ATTENDANCE_SUMMARY.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const aggregatePercentage = ((totalAttended / totalClasses) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="success" size="sm">Mandatory Attendance: 80% Minimum</Badge>
          <span className="text-xs text-slate-500">• Trimester III Biometric Register</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
          Attendance Records & Eligibility Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Monitor your class session participation. Courses falling below 80% require Academic Committee de-barment waiver.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Batch Aggregate Attendance"
          value={`${aggregatePercentage}%`}
          subtitle={`${totalAttended} attended of ${totalClasses} lectures`}
          icon={CalendarCheck2}
          accentColor="emerald"
          trend={{ value: 'Eligible', isPositive: true }}
        />
        <StatCard
          title="Compliant Courses (>=80%)"
          value="4 of 5"
          subtitle="Meets exam hall eligibility threshold"
          icon={ShieldCheck}
          accentColor="brand"
        />
        <StatCard
          title="At-Risk Courses (<80%)"
          value="1 Subject"
          subtitle="STR-604 (78.9%)"
          icon={AlertTriangle}
          accentColor="rose"
          trend={{ value: 'Warning', isPositive: false }}
        />
      </div>

      {/* Attendance Regulation Notice */}
      <div className="p-4 rounded-xl bg-[#ecf2fa] border border-[#a3c5e9] flex items-start gap-3 text-[#16488d] text-xs">
        <Info className="w-5 h-5 text-[#1955a6] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Institutional Regulation:</span> Candidates are required to maintain a minimum of 80% attendance in each course section to appear for end-trimester examinations. Approved leave applications must be endorsed by the Academic Office.
        </div>
      </div>

      {/* Course Breakdown Table */}
      <Card
        title="Subject-Wise Attendance Breakdown"
        subtitle="Live participation summary for MBA Trimester III"
        icon={<CalendarCheck2 className="w-4 h-4 text-[#1955a6]" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Course Code & Name</th>
                <th className="px-4 py-3 text-center">Conducted</th>
                <th className="px-4 py-3 text-center">Attended</th>
                <th className="px-4 py-3">Attendance %</th>
                <th className="px-4 py-3 text-center">Exam Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ATTENDANCE_SUMMARY.map((record) => {
                const isSelected = selectedCourseId === record.courseId;
                const isGood = record.percentage >= 80;

                return (
                  <tr
                    key={record.courseId}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-[#ecf2fa]/50' : ''
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{record.courseCode}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-xs">{record.courseTitle}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                      {record.totalClasses}
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-slate-900">
                      {record.attendedClasses}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              isGood ? 'bg-[#1955a6]' : 'bg-rose-500'
                            }`}
                            style={{ width: `${record.percentage}%` }}
                          />
                        </div>
                        <span className={`font-bold ${isGood ? 'text-[#1955a6]' : 'text-rose-700'}`}>
                          {record.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <Badge
                        variant={record.status === 'good' ? 'success' : 'danger'}
                        size="sm"
                        dot
                      >
                        {record.status === 'good' ? 'Eligible' : 'Warning (<80%)'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedCourseId(record.courseId)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-[#1955a6] text-white'
                            : 'text-[#1955a6] hover:bg-[#ecf2fa]'
                        }`}
                      >
                        {isSelected ? 'Viewing Log' : 'View Log'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detailed Session Log Card */}
      <Card
        title={`Session Log: ${
          MOCK_ATTENDANCE_SUMMARY.find((c) => c.courseId === selectedCourseId)?.courseCode || 'PRD-601'
        }`}
        subtitle="Individual lecture timestamp register"
        icon={<Clock className="w-4 h-4 text-[#1955a6]" />}
        action={
          <span className="text-xs text-slate-500">
            Showing last 7 recorded sessions
          </span>
        }
      >
        <div className="space-y-2">
          {mockSessionLogs.map((log, index) => (
            <div
              key={index}
              className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                  {log.status === 'present' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{log.session}: {log.topic}</div>
                  <div className="text-[11px] text-slate-500">Recorded on {log.date}</div>
                </div>
              </div>

              <div>
                <Badge
                  variant={log.status === 'present' ? 'success' : 'danger'}
                  size="sm"
                >
                  {log.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
