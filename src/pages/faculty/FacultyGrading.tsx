import React, { useState } from 'react';
import { MOCK_SUBMISSIONS } from '../../data/mockData';
import { AssignmentSubmission } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import {
  FileCheck2,
  Award,
  CheckCircle2,
  FileText,
  MessageSquare,
  Clock
} from 'lucide-react';

export const FacultyGrading: React.FC = () => {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(MOCK_SUBMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'submitted' | 'graded'>('all');

  // Grading Modal
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [awardedMarks, setAwardedMarks] = useState<number>(45);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Submissions', count: submissions.length },
    { id: 'submitted', label: 'Pending Evaluation', count: submissions.filter((s) => s.status === 'submitted').length },
    { id: 'graded', label: 'Graded & Published', count: submissions.filter((s) => s.status === 'graded').length },
  ];

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.courseCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'submitted') return s.status === 'submitted';
    if (activeFilter === 'graded') return s.status === 'graded';
    return true;
  });

  const handleOpenGradeModal = (sub: AssignmentSubmission) => {
    setGradingSubmission(sub);
    setAwardedMarks(sub.marksObtained ?? Math.floor(sub.maxMarks * 0.9));
    setFeedbackText(
      sub.feedback ||
        'Rigorous problem framing, well-articulated unit economics, and actionable executive roadmap.'
    );
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === gradingSubmission.id
          ? {
              ...item,
              marksObtained: Number(awardedMarks),
              feedback: feedbackText,
              status: 'graded',
            }
          : item
      )
    );

    setIsSaving(false);
    setSuccessBanner(
      `Grade published for ${gradingSubmission.studentName} (${awardedMarks}/${gradingSubmission.maxMarks})`
    );
    setGradingSubmission(null);

    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" size="sm">Evaluation Console</Badge>
          <span className="text-xs text-slate-500">• Product Strategy & Valuation</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
          Assignment Grading & Qualitative Feedback Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review candidate PRD deliverables, assign score points, and provide constructive feedback.
        </p>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{successBanner}</span>
        </div>
      )}

      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeFilter}
        onCategoryChange={(val) => setActiveFilter(val as any)}
        placeholder="Search by candidate name, roll number, or memo title..."
        totalResults={filteredSubmissions.length}
      />

      {/* Submissions Table / Cards */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">No submissions found</h3>
            <p className="text-xs text-slate-500 mt-1">There are no submissions matching your active filter criteria.</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => (
            <Card
              key={sub.id}
              className="hover:border-slate-300 transition-all"
              headerClassName="px-6 py-4 border-b border-slate-100 bg-[#ecf2fa]/30"
              title={
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {sub.courseCode}
                  </Badge>
                  <span className="font-bold text-slate-900 text-base">
                    {sub.studentName}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ({sub.studentRoll})
                  </span>
                </div>
              }
              badge={
                sub.status === 'graded' ? (
                  <Badge variant="success" size="md">
                    Graded: {sub.marksObtained} / {sub.maxMarks}
                  </Badge>
                ) : (
                  <Badge variant="warning" size="md" dot>
                    Needs Grading
                  </Badge>
                )
              }
              action={
                <Button
                  size="sm"
                  variant={sub.status === 'graded' ? 'outline' : 'primary'}
                  onClick={() => handleOpenGradeModal(sub)}
                >
                  {sub.status === 'graded' ? 'Edit Marks & Feedback' : 'Grade Submission'}
                </Button>
              }
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Deliverable: </span>
                    <strong className="text-slate-900">{sub.assignmentTitle}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Submitted on {sub.submittedAt}</span>
                  </div>
                </div>

                {/* File Attachment Pill */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 truncate">
                    <FileText className="w-4 h-4 text-[#1955a6] flex-shrink-0" />
                    <span className="font-medium truncate">{sub.fileName}</span>
                    <span className="text-slate-400">({sub.fileSize})</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#1955a6] bg-[#ecf2fa] px-2 py-0.5 rounded border border-[#a3c5e9]">
                    HSB Turnitin Verified
                  </span>
                </div>

                {/* Candidate Notes */}
                {sub.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700">Student Note:</span> "{sub.notes}"
                  </p>
                )}

                {/* Published Feedback (if graded) */}
                {sub.status === 'graded' && sub.feedback && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Published Feedback:</span>
                    </div>
                    <p className="text-emerald-800 leading-relaxed">
                      "{sub.feedback}"
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Grade Modal */}
      {gradingSubmission && (
        <Modal
          isOpen={!!gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          title={`Grade: ${gradingSubmission.studentName}`}
          subtitle={`${gradingSubmission.assignmentTitle} • Maximum Score: ${gradingSubmission.maxMarks}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <div className="p-3 bg-[#ecf2fa] border border-[#a3c5e9] rounded-xl text-[#16488d] text-xs">
              <span className="font-semibold">HSB Faculty Rubric:</span> Review candidate analysis across problem definition, analytical depth, execution roadmap, and visual clarity.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label={`Awarded Score (Out of ${gradingSubmission.maxMarks})`}
                type="number"
                min={0}
                max={gradingSubmission.maxMarks}
                value={awardedMarks}
                onChange={(e) => setAwardedMarks(Number(e.target.value))}
                leftIcon={<Award className="w-4 h-4" />}
                required
              />
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Percentage Equivalent
                </label>
                <div className="py-2.5 px-3.5 bg-slate-100 rounded-lg text-sm font-bold text-slate-800 border border-slate-200">
                  {((awardedMarks / gradingSubmission.maxMarks) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Instructor Feedback & Qualitative Commentary
              </label>
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write specific observations on business logic, AI workflow viability, financial sensitivity..."
                className="w-full text-xs rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#1955a6] focus:border-[#1955a6]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setGradingSubmission(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSaving}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Publish Grade & Feedback
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
