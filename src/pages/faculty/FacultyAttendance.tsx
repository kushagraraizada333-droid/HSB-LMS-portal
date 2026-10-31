import React, { useState } from 'react';
import { MOCK_STUDENTS_LIST } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Users,
  Calendar
} from 'lucide-react';

export const FacultyAttendance: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState('PRD-601');
  const [sessionTopic, setSessionTopic] = useState('Session 23: Autonomous Agent PRDs & Unit Economics');
  const [sessionDate, setSessionDate] = useState('2026-10-29');

  // Attendance state dictionary: studentId -> 'present' | 'absent' | 'late'
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({
    usr_student_01: 'present',
    usr_student_02: 'present',
    usr_student_03: 'absent',
    usr_student_04: 'present',
    usr_student_05: 'present',
    usr_student_06: 'late',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const setStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAllPresent = () => {
    const updated: Record<string, 'present'> = {};
    MOCK_STUDENTS_LIST.forEach((s) => {
      updated[s.id] = 'present';
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const total = MOCK_STUDENTS_LIST.length;
    const presentCount = Object.values(attendanceMap).filter((v) => v === 'present').length;
    const absentCount = Object.values(attendanceMap).filter((v) => v === 'absent').length;

    setIsSaving(false);
    setSaveSuccessNotice(
      `Attendance saved for ${selectedCourse}: ${presentCount}/${total} Present, ${absentCount} Absent.`
    );

    setTimeout(() => setSaveSuccessNotice(null), 5000);
  };

  const presentCount = Object.values(attendanceMap).filter((v) => v === 'present').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v === 'absent').length;
  const lateCount = Object.values(attendanceMap).filter((v) => v === 'late').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" size="sm">Faculty Roll Call</Badge>
            <span className="text-xs text-slate-500">• Section B Daily Log</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
            Roll Call & Class Attendance Register
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Record lecture participation for today's session. Syncs directly with candidate 80% threshold reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllPresent}
          >
            Mark All Present
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
            onClick={handleSaveAttendance}
          >
            Save Session Attendance
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{saveSuccessNotice}</span>
        </div>
      )}

      {/* Session Config Card */}
      <Card
        title="Session Information"
        subtitle="Specify course section and lecture topic"
        icon={<Calendar className="w-4 h-4 text-[#1955a6]" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Course Code & Title
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
            >
              <option value="PRD-601">PRD-601: Product Strategy & AI-Driven Business Models</option>
              <option value="FIN-602">FIN-602: Corporate Valuation & Financial Modeling</option>
            </select>
          </div>

          <div>
            <Input
              label="Session Date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Lecture Topic"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
            />
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100 text-center">
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            {presentCount} Present
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
            {lateCount} Late
          </div>
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
            {absentCount} Absent
          </div>
        </div>
      </Card>

      {/* Student Roster Table */}
      <Card
        title="Candidate Register"
        subtitle="Mark individual lecture attendance"
        icon={<Users className="w-4 h-4 text-slate-700" />}
        action={
          <span className="text-xs text-slate-500 font-medium">
            {MOCK_STUDENTS_LIST.length} Enrolled Candidates
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Roll Number</th>
                <th className="px-4 py-3">Candidate Name</th>
                <th className="px-4 py-3">Batch & Section</th>
                <th className="px-4 py-3">Specialization Track</th>
                <th className="px-4 py-3 text-center">Attendance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_STUDENTS_LIST.map((student) => {
                const currentStatus = attendanceMap[student.id] || 'present';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#1955a6] font-mono">{student.rollNumber}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{student.name}</td>
                    <td className="px-4 py-3 text-slate-500">{student.batch} • {student.section}</td>
                    <td className="px-4 py-3 text-slate-600">{student.specialization}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 gap-1">
                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'present')}
                          className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors flex items-center gap-1 ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'late')}
                          className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors flex items-center gap-1 ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-slate-950 shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>Late</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'absent')}
                          className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors flex items-center gap-1 ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Absent</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
