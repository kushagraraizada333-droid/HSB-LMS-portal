import React, { useState } from 'react';
import { MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS } from '../../data/mockData';
import { Assignment, AssignmentSubmission } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  Upload,
  Calendar,
  FileText,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const StudentAssignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(MOCK_SUBMISSIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'submitted' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Submit Modal state
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Deliverables', count: assignments.length },
    { id: 'open', label: 'Action Due', count: assignments.filter((a) => a.status === 'open').length },
    { id: 'submitted', label: 'In Review', count: submissions.filter((s) => s.status === 'submitted').length },
    { id: 'graded', label: 'Evaluated & Graded', count: submissions.filter((s) => s.status === 'graded').length },
  ];

  const getStudentSubmission = (assignmentId: string): AssignmentSubmission | undefined => {
    return submissions.find(
      (s) => s.assignmentId === assignmentId && s.studentId === (user?.id || 'usr_student_01')
    );
  };

  const filteredAssignments = assignments.filter((asg) => {
    const studentSub = getStudentSubmission(asg.id);

    const matchesSearch =
      asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.courseCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'open') return asg.status === 'open' && !studentSub;
    if (activeTab === 'submitted') return studentSub && studentSub.status === 'submitted';
    if (activeTab === 'graded') return studentSub && studentSub.status === 'graded';
    return true;
  });

  const handleOpenSubmitModal = (assignment: Assignment) => {
    setSubmittingAssignment(assignment);
    setSelectedFileName(
      `${user?.name?.replace(/\s+/g, '_') || 'Candidate'}_${assignment.courseCode}_Submission.pdf`
    );
    setSubmissionNotes('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newSubmission: AssignmentSubmission = {
      id: `sub_${Date.now()}`,
      assignmentId: submittingAssignment.id,
      assignmentTitle: submittingAssignment.title,
      courseCode: submittingAssignment.courseCode,
      studentId: user?.id || 'usr_student_01',
      studentName: user?.name || 'Arjun Mehta',
      studentRoll: user?.rollNumber || 'HSB-MBA-2025-042',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      fileName: selectedFileName,
      fileSize: '3.1 MB',
      notes: submissionNotes,
      maxMarks: submittingAssignment.maxMarks,
      status: 'submitted',
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
    setIsSubmitting(false);
    setSuccessNotice(`Deliverable successfully submitted: "${submittingAssignment.title}"`);
    setSubmittingAssignment(null);

    setTimeout(() => setSuccessNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" size="sm">Academic Deliverables</Badge>
            <span className="text-xs text-slate-500">• MBA Trimester III</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
            Assignments & Deliverables Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Submit syndicate PRDs, financial models, and research memos for instructor review.
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="font-semibold">{successNotice}</div>
        </div>
      )}

      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeTab}
        onCategoryChange={(val) => setActiveTab(val as any)}
        placeholder="Search deliverables by subject code, memo title, or keyword..."
        totalResults={filteredAssignments.length}
      />

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">No deliverables found</h3>
            <p className="text-xs text-slate-500 mt-1">There are no assignments matching the selected filters.</p>
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const studentSub = getStudentSubmission(asg.id);

            return (
              <Card
                key={asg.id}
                className="hover:border-slate-300 transition-all"
                headerClassName="px-6 py-4 border-b border-slate-100 bg-[#ecf2fa]/30"
                title={
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#1955a6] bg-[#ecf2fa] px-2.5 py-1 rounded-md border border-[#a3c5e9]">
                      {asg.courseCode}
                    </span>
                    <span className="font-bold text-slate-900 text-base">
                      {asg.title}
                    </span>
                  </div>
                }
                action={
                  studentSub?.status === 'graded' ? (
                    <Badge variant="success" size="md">
                      Graded ({studentSub.marksObtained}/{studentSub.maxMarks})
                    </Badge>
                  ) : studentSub ? (
                    <Badge variant="secondary" size="md">
                      Submitted for Review
                    </Badge>
                  ) : asg.status === 'open' ? (
                    <Badge variant="warning" size="md" dot>
                      Pending Submission
                    </Badge>
                  ) : (
                    <Badge variant="slate" size="md">
                      Closed
                    </Badge>
                  )
                }
              >
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {asg.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-medium">Subject</span>
                      <p className="font-semibold text-slate-800 mt-0.5 truncate">{asg.courseTitle}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-medium">Maximum Score</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{asg.maxMarks} Points</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-medium">Assigned</span>
                      <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {asg.assignedDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-medium">Deadline</span>
                      <p className="font-semibold text-rose-600 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {asg.dueDate}
                      </p>
                    </div>
                  </div>

                  {/* If already submitted/graded: show student's submission card */}
                  {studentSub && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="font-bold text-slate-900">Your Submission:</span>
                          <span className="text-slate-600">{studentSub.fileName}</span>
                          <span className="text-slate-400 text-[11px]">({studentSub.fileSize})</span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Uploaded on {studentSub.submittedAt}
                        </span>
                      </div>

                      {studentSub.notes && (
                        <div className="text-xs text-slate-600">
                          <span className="font-semibold text-slate-700">Notes to Faculty:</span> {studentSub.notes}
                        </div>
                      )}

                      {/* Faculty Grade & Feedback Banner */}
                      {studentSub.status === 'graded' && (
                        <div className="p-3.5 rounded-lg bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Faculty Feedback:</span>
                            </div>
                            <p className="text-xs text-emerald-800 leading-relaxed">
                              "{studentSub.feedback}"
                            </p>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-emerald-200 text-center flex-shrink-0 self-start sm:self-auto">
                            <div className="text-[10px] uppercase font-semibold text-emerald-600">Marks Awarded</div>
                            <div className="text-lg font-extrabold text-emerald-900">
                              {studentSub.marksObtained} <span className="text-xs font-normal text-slate-400">/ {studentSub.maxMarks}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submission Action Button */}
                  {!studentSub && asg.status === 'open' && (
                    <div className="pt-2 flex justify-end">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<Upload className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenSubmitModal(asg)}
                      >
                        Submit Memo / Deliverable
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Submit Assignment Modal */}
      {submittingAssignment && (
        <Modal
          isOpen={!!submittingAssignment}
          onClose={() => setSubmittingAssignment(null)}
          title={`Submit: ${submittingAssignment.title}`}
          subtitle={`${submittingAssignment.courseCode} • Maximum Marks: ${submittingAssignment.maxMarks}`}
          maxWidth="lg"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="p-3 bg-[#ecf2fa] border border-[#a3c5e9] rounded-xl text-[#16488d] text-xs">
              <span className="font-semibold">Academic Submission Guideline:</span> Please confirm that your deliverable includes your official roll number ({user?.rollNumber || 'MBA-2025-042'}) and adheres to Turnitin similarity standards (under 12%).
            </div>

            <Input
              label="Deliverable File Name"
              value={selectedFileName}
              onChange={(e) => setSelectedFileName(e.target.value)}
              helperText="In Stage 2, Supabase Storage will handle direct binary file uploads."
              leftIcon={<FileText className="w-4 h-4" />}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Executive Comments / Syndicate Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="Mention methodology assumptions, data sources, or syndicate contributors..."
                className="w-full text-xs rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#1955a6] focus:border-[#1955a6]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSubmittingAssignment(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
              >
                Confirm & Submit
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
