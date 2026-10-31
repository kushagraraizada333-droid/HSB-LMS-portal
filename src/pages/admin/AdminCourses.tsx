import React, { useState, useEffect } from 'react';
import { MOCK_COURSES } from '../../data/mockData';
import { Course } from '../../types';
import { courseService } from '../../services/courseService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { Input } from '../../components/common/Input';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Layers,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDept, setActiveDept] = useState('all');

  useEffect(() => {
    let isMounted = true;
    setErrorMessage(null);
    courseService.getAllCourses().then((data) => {
      if (isMounted) {
        setCourses(data);
        setIsLoading(false);
      }
    }).catch((err) => {
      console.error('[AdminCourses] Error loading catalog:', err);
      if (isMounted) {
        setErrorMessage(err.message || 'Failed to load courses from Supabase.');
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState(3);
  const [trimester, setTrimester] = useState(3);
  const [facultyName, setFacultyName] = useState('Prof. Sarah Jenkins, Ph.D.');
  const [department, setDepartment] = useState('Product & AI Leadership');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('Mon & Wed 10:00 - 11:30 AM');
  const [room, setRoom] = useState('Amphitheater Hall 1 (HSB Campus)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Catalog Courses', count: courses.length },
    { id: 'Product', label: 'Product & AI', count: courses.filter((c) => c.department.includes('Product')).length },
    { id: 'Finance', label: 'Finance & Economics', count: courses.filter((c) => c.department.includes('Finance')).length },
    { id: 'Strategy', label: 'Strategy & Leadership', count: courses.filter((c) => c.department.includes('Strategy')).length },
    { id: 'Marketing', label: 'Marketing', count: courses.filter((c) => c.department.includes('Marketing')).length },
    { id: 'Analytics', label: 'Analytics', count: courses.filter((c) => c.department.includes('Analytics')).length },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.facultyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = activeDept === 'all' || c.department.includes(activeDept);
    return matchesSearch && matchesDept;
  });

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await courseService.createCourse({
        code,
        title,
        credits: Number(credits),
        trimester: Number(trimester),
        facultyName,
        department,
        description,
        schedule,
        room,
      });

      setCourses((prev) => [created, ...prev]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setSuccessBanner(`Course ${code}: ${title} saved to curriculum catalog.`);

      setCode('');
      setTitle('');
      setDescription('');
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err: any) {
      console.error('[AdminCourses] Error creating course in database:', err);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to create course in Supabase database.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">Academic Curriculum</Badge>
            <span className="text-xs text-slate-500">• MBA Trimester Electives & Core</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Course Catalog & Credit Framework
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Administer course codes, credit weightages, faculty assignments, and amphitheatres.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Course
        </Button>
      </div>

      {/* Database Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-900">Database Error</p>
            <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

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
        activeCategory={activeDept}
        onCategoryChange={setActiveDept}
        placeholder="Search courses by code, title, or assigned faculty..."
        totalResults={filteredCourses.length}
      />

      {/* Course Catalog Table */}
      <Card
        title="Curriculum Catalog"
        subtitle="Active master syllabus registry"
        icon={<BookOpen className="w-4 h-4 text-brand-600" />}
      >
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-[#1955a6] animate-spin" />
            <span className="text-xs text-slate-500">Querying courses from Supabase...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-8 h-8 text-[#1955a6]" />}
            title="No Courses in Database Catalog"
            description="Use the 'Add New Course' button above to register an accredited MBA course in Supabase."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Course Title</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Assigned Faculty</th>
                  <th className="px-4 py-3 text-center">Credits</th>
                  <th className="px-4 py-3 text-center">Term</th>
                  <th className="px-4 py-3 text-center">Enrolled</th>
                  <th className="px-4 py-3">Schedule & Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{c.code}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{c.title}</td>
                    <td className="px-4 py-3 text-slate-500">{c.department}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{c.facultyName}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900">{c.credits}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="slate" size="sm">T{c.trimester}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-brand-700">
                      {c.totalEnrolled}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-[11px]">
                      <div>{c.schedule}</div>
                      <div className="text-slate-400">{c.room}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Course Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Course"
          subtitle="Add an accredited MBA elective or core course"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Course Code"
                placeholder="e.g. FIN-608"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <Input
                label="Course Title"
                placeholder="e.g. Private Equity & Venture Investing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Credit Hours"
                type="number"
                min={1}
                max={4}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                required
              />
              <Input
                label="Trimester"
                type="number"
                min={1}
                max={6}
                value={trimester}
                onChange={(e) => setTrimester(Number(e.target.value))}
                required
              />
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="Product & AI Leadership">Product & AI Leadership</option>
                  <option value="Finance & Economics">Finance & Economics</option>
                  <option value="Strategy & Leadership">Strategy & Leadership</option>
                  <option value="Marketing & Digital Strategy">Marketing & Digital Strategy</option>
                  <option value="Analytics & Information Systems">Analytics & Information Systems</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Assigned Lead Professor"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                required
              />
              <Input
                label="Lecture Room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                required
              />
            </div>

            <Input
              label="Weekly Timetable Slot"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Curriculum Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Outline course focus, core case method applications, and learning outcomes..."
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
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Course to Catalog
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
