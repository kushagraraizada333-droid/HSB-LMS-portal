import React, { useState } from 'react';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import {
  Megaphone,
  Calendar,
  User,
  Tag
} from 'lucide-react';

export const StudentAnnouncements: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Bulletins', count: MOCK_ANNOUNCEMENTS.length },
    { id: 'placement', label: 'Placement & Internships', count: 1 },
    { id: 'academic', label: 'Academic Seminars', count: 1 },
    { id: 'administrative', label: 'Registrar Circulars', count: 1 },
    { id: 'event', label: 'Campus Conclaves', count: 1 },
  ];

  const filteredAnnouncements = MOCK_ANNOUNCEMENTS.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' || ann.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="primary" size="sm">Campus Broadcasts</Badge>
          <span className="text-xs text-slate-500">• Campus Communications</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
          Official Bulletins & Campus Notices
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Circulars regarding corporate placement recruitment, guest masterclasses, and exam procedures.
        </p>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        placeholder="Search bulletins by title, author, or keyword..."
        totalResults={filteredAnnouncements.length}
      />

      {/* Bulletins List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <Megaphone className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">No bulletins match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filter or searching for another term.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <Card
              key={ann.id}
              className="hover:border-slate-300 transition-all"
              headerClassName="px-6 py-4 border-b border-slate-100 bg-[#ecf2fa]/30"
              title={
                <span className="text-base font-bold text-slate-900">
                  {ann.title}
                </span>
              }
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
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {ann.content}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-900">{ann.authorName}</span>
                    <span className="text-slate-400">• {ann.authorRole}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#1955a6]" />
                    <Badge variant="primary" size="sm">
                      {ann.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
