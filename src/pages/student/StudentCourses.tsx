import React, { useState, useEffect, useRef } from 'react';
import { MOCK_COURSES } from '../../data/mockData';
import { Course, StudyMaterial, StudentPersonalMaterial } from '../../types';
import { courseService } from '../../services/courseService';
import {
  studyMaterialService,
  formatBytes,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
} from '../../services/studyMaterialService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import { useAuth } from '../../contexts/AuthContext';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Download,
  ExternalLink,
  Presentation,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  Upload,
  Trash2,
  Lock,
  User,
  Plus,
  X,
} from 'lucide-react';

export const StudentCourses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [allMaterials, setAllMaterials] = useState<StudyMaterial[]>([]);
  const [personalMaterials, setPersonalMaterials] = useState<StudentPersonalMaterial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'official' | 'personal'>('official');

  // Download & action states
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingPersonalId, setDeletingPersonalId] = useState<string | null>(null);

  // Student personal upload state
  const [isUploadingPersonal, setIsUploadingPersonal] = useState(false);
  const [personalUploadProgress, setPersonalUploadProgress] = useState(0);
  const [personalFile, setPersonalFile] = useState<File | null>(null);
  const [personalTitle, setPersonalTitle] = useState('');
  const [personalDescription, setPersonalDescription] = useState('');
  const [personalError, setPersonalError] = useState<string | null>(null);
  const [personalSuccessNotice, setPersonalSuccessNotice] = useState<string | null>(null);

  const personalFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    setErrorMessage(null);

    const loadData = async () => {
      // 1. Fetch courses from courseService (with fallback to MOCK_COURSES)
      try {
        const catalog = await courseService.getAllCourses();
        if (isMounted) {
          setCourses(catalog.length > 0 ? catalog : MOCK_COURSES);
        }
      } catch (err: any) {
        console.warn('[StudentCourses] Course load note:', err.message);
        if (isMounted) {
          setCourses(MOCK_COURSES);
        }
      }

      // 2. Fetch official study materials
      try {
        const materials = await studyMaterialService.getMaterials();
        if (isMounted) {
          setAllMaterials(materials);
        }
      } catch (err: any) {
        console.warn('[StudentCourses] Official materials load note:', err);
      }

      // 3. Fetch student's own private personal materials
      try {
        const personal = await studyMaterialService.getStudentPersonalMaterials();
        if (isMounted) {
          setPersonalMaterials(personal);
        }
      } catch (err: any) {
        console.warn('[StudentCourses] Personal materials load note:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { id: 'all', label: 'All Subjects', count: courses.length },
    {
      id: 'Product & AI Leadership',
      label: 'Product & AI',
      count: courses.filter((c) => c.department.includes('Product')).length,
    },
    {
      id: 'Finance & Economics',
      label: 'Finance',
      count: courses.filter((c) => c.department.includes('Finance')).length,
    },
    {
      id: 'Marketing & Digital Strategy',
      label: 'Marketing',
      count: courses.filter((c) => c.department.includes('Marketing')).length,
    },
    {
      id: 'Technology, Design & Operations',
      label: 'Strategy',
      count: courses.filter(
        (c) => c.department.includes('Strategy') || c.department.includes('Technology')
      ).length,
    },
    {
      id: 'Analytics & Information Systems',
      label: 'Analytics',
      count: courses.filter((c) => c.department.includes('Analytics')).length,
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.facultyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' ||
      course.department === activeCategory ||
      course.department.includes(activeCategory);

    return matchesSearch && matchesCategory;
  });

  const getMaterialsForCourse = (courseId: string, courseCode: string): StudyMaterial[] => {
    return allMaterials.filter(
      (mat) =>
        mat.courseId === courseId ||
        (mat.courseCode && mat.courseCode.toLowerCase() === courseCode.toLowerCase())
    );
  };

  const getPersonalMaterialsForCourse = (courseId: string, courseCode: string): StudentPersonalMaterial[] => {
    return personalMaterials.filter(
      (mat) =>
        !mat.courseId ||
        mat.courseId === courseId ||
        (mat.courseCode && mat.courseCode.toLowerCase() === courseCode.toLowerCase())
    );
  };

  const handleDownload = async (material: StudyMaterial) => {
    setDownloadingId(material.id);
    try {
      await studyMaterialService.downloadMaterial(material);
      setDownloadNotice(`Downloaded: "${material.title}"`);
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err: any) {
      alert(`Download failed: ${err.message || 'Unable to retrieve file.'}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePersonalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setPersonalError(`File is too large (${formatBytes(file.size)}). Limit is 50 MB.`);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setPersonalError(`Format ".${ext}" is not supported.`);
      return;
    }

    setPersonalFile(file);
    setPersonalError(null);

    if (!personalTitle.trim()) {
      const base = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setPersonalTitle(base);
    }
  };

  const handleUploadPersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalFile) {
      setPersonalError('Please select a file to upload.');
      return;
    }
    if (!user?.id) {
      setPersonalError('Authentication required: Please sign in as a student.');
      return;
    }

    setIsUploadingPersonal(true);
    setPersonalUploadProgress(20);
    setPersonalError(null);

    try {
      const created = await studyMaterialService.uploadStudentPersonalMaterial({
        file: personalFile,
        studentId: user.id,
        courseId: selectedCourse?.id,
        courseCode: selectedCourse?.code,
        title: personalTitle,
        description: personalDescription,
        onProgress: (p) => setPersonalUploadProgress(p),
      });

      setPersonalMaterials((prev) => [created, ...prev]);
      setPersonalSuccessNotice(`Personal file "${created.title}" saved to your private storage.`);
      setPersonalFile(null);
      setPersonalTitle('');
      setPersonalDescription('');
      setPersonalUploadProgress(0);
      if (personalFileInputRef.current) personalFileInputRef.current.value = '';

      setTimeout(() => setPersonalSuccessNotice(null), 5000);
    } catch (err: any) {
      setPersonalError(err.message || 'Failed to upload personal file.');
    } finally {
      setIsUploadingPersonal(false);
    }
  };

  const handleDownloadPersonal = async (mat: StudentPersonalMaterial) => {
    setDownloadingId(mat.id);
    try {
      await studyMaterialService.downloadStudentPersonalMaterial(mat);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDeletePersonal = async (mat: StudentPersonalMaterial) => {
    if (!window.confirm(`Delete personal file "${mat.title}"?`)) return;

    setDeletingPersonalId(mat.id);
    try {
      await studyMaterialService.deleteStudentPersonalMaterial(mat.id, mat.fileUrl);
      setPersonalMaterials((prev) => prev.filter((m) => m.id !== mat.id));
      setPersonalSuccessNotice(`Deleted "${mat.title}" from your private files.`);
      setTimeout(() => setPersonalSuccessNotice(null), 4000);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingPersonalId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" size="sm">
              Trimester III Curriculum
            </Badge>
            <span className="text-xs text-slate-500">• 2-Year Residential MBA</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
            Courses, Syllabi & Study Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Access lecture syllabi, case studies, slide decks, and data notebooks for your active subjects.
          </p>
        </div>
      </div>

      {/* Database Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-900">Database Connection Notice</p>
            <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Download Alert Notice */}
      {downloadNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{downloadNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        placeholder="Search courses by subject code, title, or professor..."
        totalResults={filteredCourses.length}
      />

      {/* Course Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#1955a6]" />
          <span className="text-xs">Loading course repository...</span>
        </div>
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Try adjusting your search query or department filter."
          icon={<BookOpen className="w-8 h-8 text-slate-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const materials = getMaterialsForCourse(course.id, course.code);

            return (
              <Card
                key={course.id}
                className="flex flex-col justify-between hover:border-slate-300 transition-all group"
                headerClassName="px-6 py-4 border-b border-slate-100 bg-[#ecf2fa]/20"
                title={
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {course.code}
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium">
                      {course.credits} Credits • Trimester {course.trimester}
                    </span>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#1955a6] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700">Faculty:</span>
                      <span className="text-slate-600 truncate">{course.facultyName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 truncate">{course.schedule}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 truncate">{course.room}</span>
                    </div>
                  </div>

                  {/* Materials count summary */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#1955a6]" />
                      <span>Study Materials:</span>
                    </span>
                    <Badge variant="slate" size="sm">
                      {materials.length} {materials.length === 1 ? 'file' : 'files'}
                    </Badge>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-medium"
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveModalTab('official');
                      }}
                    >
                      View Syllabus & Files ({materials.length})
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Course Detail & Study Materials Modal */}
      {selectedCourse && (
        <Modal
          isOpen={Boolean(selectedCourse)}
          onClose={() => setSelectedCourse(null)}
          title={`${selectedCourse.code}: ${selectedCourse.title}`}
          subtitle={`${selectedCourse.department} • Prof. ${selectedCourse.facultyName}`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            {/* Academic Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Credits
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {selectedCourse.credits} Credit Units
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Trimester
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  Term {selectedCourse.trimester} (Core)
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Classroom
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {selectedCourse.room}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Schedule
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {selectedCourse.schedule}
                </p>
              </div>
            </div>

            {/* Course Overview Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Course Description & Pacing
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-[#ecf2fa]/40 p-3 rounded-xl border border-[#a3c5e9]/40">
                {selectedCourse.description} Part of the specialized MBA curriculum, bridging computational technology, customer-centric design, and strategic business leadership.
              </p>
            </div>

            {/* Repository Tabs: Official Materials vs My Personal Notes */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveModalTab('official')}
                className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 ${
                  activeModalTab === 'official'
                    ? 'border-[#1955a6] text-[#1955a6]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Course Materials ({getMaterialsForCourse(selectedCourse.id, selectedCourse.code).length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('personal')}
                className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 ${
                  activeModalTab === 'personal'
                    ? 'border-[#1955a6] text-[#1955a6]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>My Private Notes & Uploads ({getPersonalMaterialsForCourse(selectedCourse.id, selectedCourse.code).length})</span>
              </button>
            </div>

            {/* TAB 1: OFFICIAL COURSE MATERIALS (Read-Only Download for Enrolled Students) */}
            {activeModalTab === 'official' && (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-[#16488d] flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 flex-shrink-0 text-[#1955a6]" />
                  <span>
                    Official faculty materials are published by course instructors. Enrolled students have verified read & download privileges.
                  </span>
                </div>

                {getMaterialsForCourse(selectedCourse.id, selectedCourse.code).length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-6 text-center border border-dashed rounded-xl bg-slate-50/50">
                    No study materials have been uploaded for this course yet.
                  </p>
                ) : (
                  getMaterialsForCourse(selectedCourse.id, selectedCourse.code).map((material) => (
                    <div
                      key={material.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors shadow-2xs"
                    >
                      <div className="flex items-start gap-3 overflow-hidden">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-700 flex-shrink-0 mt-0.5">
                          {material.type === 'pdf' ? (
                            <FileText className="w-4 h-4 text-rose-600" />
                          ) : material.type === 'ppt' ? (
                            <Presentation className="w-4 h-4 text-amber-600" />
                          ) : material.type === 'doc' ? (
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ExternalLink className="w-4 h-4 text-[#1955a6]" />
                          )}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900 truncate">
                              {material.title}
                            </h5>
                            <Badge size="sm" variant="slate">
                              Mod {material.moduleNumber}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {material.description || 'Lecture readings and study notes.'}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                            <span>Uploaded {material.uploadedAt}</span>
                            {material.fileSize && <span>• {material.fileSize}</span>}
                            <span>• By {material.uploadedBy}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="py-1 px-3 text-xs self-start sm:self-center flex-shrink-0"
                        leftIcon={
                          downloadingId === material.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5 text-[#1955a6]" />
                          )
                        }
                        isLoading={downloadingId === material.id}
                        onClick={() => handleDownload(material)}
                      >
                        Download
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: MY PERSONAL PRIVATE UPLOADS (Isolated per Student UUID) */}
            {activeModalTab === 'personal' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Private Student Storage ('student-materials')</span>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        Files uploaded here are stored in your private storage folder (<code className="font-mono text-amber-950 font-bold">{user?.id || 'auth.uid'}/...</code>). Only your account can view, download, or delete these files. Other students and faculty cannot access them.
                      </p>
                    </div>
                  </div>
                </div>

                {personalSuccessNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{personalSuccessNotice}</span>
                  </div>
                )}

                {personalError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{personalError}</span>
                  </div>
                )}

                {/* Personal Upload Form */}
                <form onSubmit={handleUploadPersonalSubmit} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">
                    Upload Personal Note / Solution Draft
                  </span>

                  <input
                    ref={personalFileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.zip,.png,.jpg"
                    disabled={isUploadingPersonal}
                    onChange={handlePersonalFileSelect}
                  />

                  {!personalFile ? (
                    <div
                      onClick={() => personalFileInputRef.current?.click()}
                      className="border border-dashed border-slate-300 hover:border-[#1955a6] rounded-xl p-4 text-center cursor-pointer bg-white transition-colors"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs font-semibold text-slate-700 block">
                        Choose a study file from your laptop
                      </span>
                      <span className="text-[10px] text-slate-400">PDF, PPT, DOC, XLS, TXT, images up to 50 MB</span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                      <div className="truncate">
                        <span className="font-bold text-slate-800 block truncate">{personalFile.name}</span>
                        <span className="text-[11px] text-slate-400">{formatBytes(personalFile.size)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPersonalFile(null);
                          if (personalFileInputRef.current) personalFileInputRef.current.value = '';
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Document Title (e.g. My PRD Brainstorming Notes)"
                    value={personalTitle}
                    onChange={(e) => setPersonalTitle(e.target.value)}
                    disabled={isUploadingPersonal}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#1955a6]"
                    required
                  />

                  {isUploadingPersonal && (
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#1955a6] h-full transition-all duration-200"
                        style={{ width: `${personalUploadProgress}%` }}
                      />
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isUploadingPersonal}
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                    >
                      Save to Private Storage
                    </Button>
                  </div>
                </form>

                {/* List of Personal Files */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {getPersonalMaterialsForCourse(selectedCourse.id, selectedCourse.code).length === 0 ? (
                    <p className="text-xs text-slate-400 italic p-4 text-center border border-dashed rounded-xl">
                      You have not uploaded any personal files for this course yet.
                    </p>
                  ) : (
                    getPersonalMaterialsForCourse(selectedCourse.id, selectedCourse.code).map((mat) => (
                      <div
                        key={mat.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="truncate">
                          <span className="font-bold text-slate-800 block truncate">{mat.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {mat.fileSize || 'Document'} • Saved {mat.createdAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="py-1 px-2.5 text-xs"
                            leftIcon={
                              downloadingId === mat.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Download className="w-3 h-3 text-[#1955a6]" />
                              )
                            }
                            isLoading={downloadingId === mat.id}
                            onClick={() => handleDownloadPersonal(mat)}
                          >
                            Download
                          </Button>

                          <button
                            title="Delete personal file"
                            onClick={() => handleDeletePersonal(mat)}
                            disabled={deletingPersonalId === mat.id}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
