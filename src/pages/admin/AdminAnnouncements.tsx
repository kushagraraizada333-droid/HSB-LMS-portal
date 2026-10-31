import React, { useState } from 'react';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { Announcement } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import {
  Megaphone,
  Plus,
  CheckCircle2,
  Calendar,
  User,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [category, setCategory] = useState<'academic' | 'placement' | 'event' | 'administrative'>('administrative');
  const [targetAudience, setTargetAudience] = useState<'all' | 'students' | 'faculty'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Notices', count: announcements.length },
    { id: 'administrative', label: 'Administrative', count: announcements.filter((a) => a.category === 'administrative').length },
    { id: 'placement', label: 'Placement', count: announcements.filter((a) => a.category === 'placement').length },
    { id: 'academic', label: 'Academic', count: announcements.filter((a) => a.category === 'academic').length },
    { id: 'event', label: 'Events', count: announcements.filter((a) => a.category === 'event').length },
  ];

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = activeCategory === 'all' || ann.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title,
      content,
      authorName: user?.name || 'Dr. Vikram Sen',
      authorRole: 'Chief Academic Registrar & Director of Student Affairs',
      postedDate: new Date().toISOString().split('T')[0],
      priority,
      targetAudience,
      category,
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setSuccessBanner(`Notice "${title}" published across campus.`);

    setTitle('');
    setContent('');

    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setSuccessBanner('Notice removed from campus bulletin.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">Central Communications</Badge>
            <span className="text-xs text-slate-500">• Registrar Campus-Wide Dispatch</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Announcements & Official Campus Notices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Broadcast emergency alerts, placement schedules, and examination guidelines to student & faculty dashboards.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Publish Campus Notice
        </Button>
      </div>

      {/* Success Notification */}
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
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        placeholder="Search notices by keyword, title, or publisher..."
        totalResults={filteredAnnouncements.length}
      />

      {/* List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
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
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {ann.postedDate}
                </span>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
          title="Publish Campus Notice"
          subtitle="Registrar formal communication dispatch"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <Input
              label="Notice Headline"
              placeholder="e.g. End-Trimester Exam Protocol & Turnitin Threshold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Priority Flag
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
                  <option value="administrative">Administrative</option>
                  <option value="placement">Placement & Corporate</option>
                  <option value="academic">Academic & Exams</option>
                  <option value="event">Campus Event</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dispatch Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="all">Entire Campus (All)</option>
                  <option value="students">Students Only</option>
                  <option value="faculty">Faculty Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Notice Text Body
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Include official circular clauses, effective dates, and contact desks..."
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
                Dispatch Announcement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
