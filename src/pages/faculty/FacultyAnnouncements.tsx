import React, { useState } from 'react';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { Announcement } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import {
  Megaphone,
  Plus,
  CheckCircle2,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const FacultyAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [category, setCategory] = useState<'academic' | 'placement' | 'event' | 'administrative'>('academic');
  const [targetAudience, setTargetAudience] = useState<'all' | 'students' | 'faculty'>('students');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title,
      content,
      authorName: user?.name || 'Prof. Sarah Jenkins, Ph.D.',
      authorRole: 'Professor of Product Management & Chair, AI Leadership Center',
      postedDate: new Date().toISOString().split('T')[0],
      priority,
      targetAudience,
      category,
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setSuccessBanner(`Announcement "${title}" broadcast successfully.`);

    setTitle('');
    setContent('');

    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" size="sm">Faculty Circulars</Badge>
            <span className="text-xs text-slate-500">• Candidate Communications</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Class Notices & Academic Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Post case study briefs, guest tech leader sessions, and timetable updates for MBA cohorts.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Post New Notice
        </Button>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{successBanner}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card
            key={ann.id}
            headerClassName="px-6 py-4 border-b border-slate-100 bg-slate-50/50"
            title={<span className="text-base font-bold text-slate-900">{ann.title}</span>}
            badge={
              <Badge
                variant={
                  ann.priority === 'urgent'
                    ? 'danger'
                    : ann.priority === 'high'
                    ? 'warning'
                    : 'slate'
                }
                size="sm"
                dot
              >
                {ann.priority.toUpperCase()}
              </Badge>
            }
            action={
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{ann.postedDate}</span>
              </div>
            }
          >
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {ann.content}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-900">{ann.authorName}</span>
                  <span className="text-slate-400">• {ann.authorRole}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {ann.category}
                  </Badge>
                  <Badge variant="slate" size="sm">
                    Audience: {ann.targetAudience}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Broadcast Notice"
          subtitle="Publish a formal notice to students and batch sections"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <Input
              label="Notice Title"
              placeholder="e.g. Guest Speaker Series: M&A Synergy Analysis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="academic">Academic</option>
                  <option value="placement">Placement</option>
                  <option value="event">Campus Event</option>
                  <option value="administrative">Administrative</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="students">Students Only</option>
                  <option value="faculty">Faculty Only</option>
                  <option value="all">Campus-Wide (All)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Notice Content & Details
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Include agenda, dates, room details, and preparatory reading..."
                className="w-full text-xs rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<Megaphone className="w-4 h-4" />}
              >
                Post Announcement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
