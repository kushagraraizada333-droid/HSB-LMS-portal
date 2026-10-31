import React from 'react';
import { MOCK_COURSES } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  BookOpen,
  Users,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const FacultyCourses: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Show faculty assigned courses (e.g. PRD-601 and department allocations)
  const assignedCourses = MOCK_COURSES.filter(
    (c) => c.facultyId === (user?.id || 'usr_faculty_01') || c.code === 'PRD-601' || c.code === 'STR-604'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" size="sm">Faculty Teaching Workload</Badge>
          <span className="text-xs text-slate-500">• Flagship 2-Year MBA • Trimester III</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Assigned Courses & Curriculum Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View lecture allocations, candidate enrollment numbers, and syllabus pacing across campus amphitheaters.
        </p>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignedCourses.map((course) => (
          <Card
            key={course.id}
            headerClassName="px-6 py-4 border-b border-slate-100 bg-slate-50/50"
            title={
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="md">
                  {course.code}
                </Badge>
                <span className="font-bold text-slate-900 text-base">
                  {course.title}
                </span>
              </div>
            }
            badge={
              <Badge variant="slate" size="sm">
                {course.credits} Credits
              </Badge>
            }
          >
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {course.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Cohort Size</span>
                    <strong className="text-slate-800">{course.totalEnrolled} MBA Candidates</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Lecture Timetable</span>
                    <strong className="text-slate-800">{course.schedule}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Lecture Hall</span>
                    <strong className="text-slate-800">{course.room}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Academic Term</span>
                    <strong className="text-slate-800">Trimester {course.trimester} (Active)</strong>
                  </div>
                </div>
              </div>

              {/* Syllabus Progress */}
              <div className="p-3 bg-hsb-ice rounded-xl border border-hsb-border/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="flex items-center gap-1.5 text-hsb-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    Syllabus Pacing & Cases Completed
                  </span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-hsb-primary h-full rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>14 of 18 Sessions Delivered</span>
                  <span>4 Harvard & Stanford Cases Analyzed</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/faculty/attendance')}
                >
                  Take Attendance
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/faculty/grading')}
                >
                  View Submissions
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
