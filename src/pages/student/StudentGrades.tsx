import React, { useState } from 'react';
import { MOCK_STUDENT_GRADES, HSB_CAMPUS_INFO } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/shared/StatCard';
import {
  Award,
  BookOpen,
  Download,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const StudentGrades: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadTranscript = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">Dean's Honor Roll Candidate</Badge>
            <span className="text-xs text-slate-500">• 4.00 Grading Scale</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
            Published Grades & Official Academic Transcript
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified trimester grade point averages (GPA), cumulative credits, and completed course units.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="bg-[#1d3c74] hover:bg-[#163b71]"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleDownloadTranscript}
        >
          Download Official Transcript (PDF)
        </Button>
      </div>

      {/* Simulated Download Alert */}
      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Downloaded: Official_Transcript_Arjun_Mehta_MBA2025.pdf with academic seal.</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Cumulative CGPA"
          value="3.84 / 4.00"
          subtitle="Top Decile in Class Cohort"
          icon={Award}
          trend={{ value: 'Summa Cum Laude Track', isPositive: true }}
          accentColor="amber"
        />
        <StatCard
          title="Credits Earned to Date"
          value="36 of 72"
          subtitle="14 additional credits currently in progress"
          icon={BookOpen}
          accentColor="brand"
        />
        <StatCard
          title="Academic Standing"
          value="Exemplary"
          subtitle="Zero disciplinary or honor code flags"
          icon={CheckCircle2}
          accentColor="emerald"
        />
      </div>

      {/* Trimester-by-Trimester Transcript Tables */}
      <div className="space-y-6">
        {MOCK_STUDENT_GRADES.map((term, index) => (
          <Card
            key={index}
            headerClassName="px-6 py-4 border-b border-slate-100 bg-[#ecf2fa]/40"
            title={
              <div className="flex items-center gap-2">
                <span>{term.trimester}</span>
              </div>
            }
            badge={
              term.status === 'In Progress' ? (
                <Badge variant="warning" size="sm" dot>
                  Term In Progress
                </Badge>
              ) : (
                <Badge variant="success" size="sm">
                  Finalized & Verified
                </Badge>
              )
            }
            action={
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Term GPA: </span>
                <span className="text-sm font-bold text-slate-900">{term.gpa.toFixed(2)}</span>
                <span className="text-xs text-slate-400"> ({term.credits} credits)</span>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Course Title</th>
                    <th className="px-4 py-3 text-center">Credit Hours</th>
                    <th className="px-4 py-3 text-center">Letter Grade</th>
                    <th className="px-4 py-3 text-center">Grade Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {term.courses.map((c) => (
                    <tr key={c.code} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-[#1955a6]">{c.code}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{c.title}</td>
                      <td className="px-4 py-3 text-center font-medium text-slate-600">{c.credits}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200">
                          {c.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-900">{c.gpa.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>

      {/* GPA Scale Legend Card */}
      <Card
        title="Institutional Grading Scale"
        subtitle="MBA Evaluation Rubric & Quality Criteria"
        icon={<HelpCircle className="w-4 h-4 text-slate-500" />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-[#1955a6] text-sm">A (4.0)</div>
            <div className="text-[10px] text-slate-500">93% - 100%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-blue-700 text-sm">A- (3.7)</div>
            <div className="text-[10px] text-slate-500">90% - 92%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-indigo-600 text-sm">B+ (3.3)</div>
            <div className="text-[10px] text-slate-500">87% - 89%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800 text-sm">B (3.0)</div>
            <div className="text-[10px] text-slate-500">83% - 86%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-amber-600 text-sm">B- (2.7)</div>
            <div className="text-[10px] text-slate-500">80% - 82%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-rose-600 text-sm">C (2.0)</div>
            <div className="text-[10px] text-slate-500">70% - 79%</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
