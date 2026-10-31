import React, { useState, useEffect, useRef } from 'react';
import { MOCK_COURSES } from '../../data/mockData';
import { Course, StudyMaterial, MaterialType } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import { courseService } from '../../services/courseService';
import {
  studyMaterialService,
  formatBytes,
  detectMaterialType,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
} from '../../services/studyMaterialService';
import {
  FolderArchive,
  Upload,
  FileText,
  Presentation,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  FileSpreadsheet,
  File,
  X,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const FacultyMaterials: React.FC = () => {
  const { user, role } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<MaterialType>('pdf');
  const [newModule, setNewModule] = useState<number>(1);
  const [newCourseId, setNewCourseId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Notifications & Feedback
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load courses and materials on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);

      // Load courses
      try {
        const fetchedCourses = await courseService.getAllCourses();
        if (isMounted && fetchedCourses.length > 0) {
          setCourses(fetchedCourses);
          setNewCourseId(fetchedCourses[0].id);
        } else if (isMounted) {
          setCourses(MOCK_COURSES);
          setNewCourseId(MOCK_COURSES[0].id);
        }
      } catch (err) {
        if (isMounted) {
          setCourses(MOCK_COURSES);
          setNewCourseId(MOCK_COURSES[0].id);
        }
      }

      // Load study materials
      try {
        const fetchedMaterials = await studyMaterialService.getMaterials();
        if (isMounted) {
          setMaterials(fetchedMaterials);
        }
      } catch (err: any) {
        console.error('[FacultyMaterials] Failed to load study materials:', err);
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
    { id: 'all', label: 'All Files', count: materials.length },
    { id: 'pdf', label: 'PDF Guides & Cases', count: materials.filter((m) => m.type === 'pdf').length },
    { id: 'ppt', label: 'Slide Decks', count: materials.filter((m) => m.type === 'ppt').length },
    { id: 'doc', label: 'Documents & Notes', count: materials.filter((m) => m.type === 'doc').length },
    { id: 'link', label: 'Datasets & Links', count: materials.filter((m) => m.type === 'link').length },
  ];

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = activeFilter === 'all' || m.type === activeFilter;

    return matchesSearch && matchesType;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`Selected file is too large (${formatBytes(file.size)}). Maximum limit is 50 MB.`);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMessage(
        `Unsupported file extension ".${ext}". Allowed: PDF, PPT/PPTX, DOC/DOCX, XLS/XLSX, TXT, ZIP.`
      );
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);

    // Auto-detect type and default title if not entered
    const detected = detectMaterialType(file.name, file.type);
    setNewType(detected);

    if (!newTitle.trim()) {
      // Clean filename for readable title
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setNewTitle(baseName);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedFile) {
      setErrorMessage('Please select a study material file from your laptop.');
      return;
    }

    if (!newTitle.trim()) {
      setErrorMessage('Please enter a descriptive title for this study material.');
      return;
    }

    const selectedCourse = courses.find((c) => c.id === newCourseId) || courses[0];

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const createdItem = await studyMaterialService.uploadMaterial({
        file: selectedFile,
        courseId: selectedCourse.id,
        courseCode: selectedCourse.code,
        title: newTitle,
        description: newDescription,
        moduleNumber: Number(newModule),
        uploadedBy: user?.name || (role === 'admin' ? 'Academic Registrar' : 'Prof. Faculty Member'),
        uploadedById: user?.id,
        onProgress: (p) => setUploadProgress(p),
      });

      setMaterials((prev) => [createdItem, ...prev]);
      setIsUploading(false);
      setIsUploadModalOpen(false);
      setSuccessBanner(
        `Study material "${createdItem.title}" uploaded successfully to repository (${selectedCourse.code}).`
      );

      // Reset form
      setSelectedFile(null);
      setNewTitle('');
      setNewDescription('');
      setNewModule(1);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => setSuccessBanner(null), 6000);
    } catch (err: any) {
      console.error('[FacultyMaterials] Upload error:', err);
      setIsUploading(false);
      setUploadProgress(0);
      setErrorMessage(err.message || 'Failed to upload document. Please try again.');
    }
  };

  const handleDownload = async (material: StudyMaterial) => {
    setDownloadingId(material.id);
    try {
      await studyMaterialService.downloadMaterial(material);
    } catch (err: any) {
      alert(`Download failed: ${err.message || 'Unable to retrieve file.'}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (material: StudyMaterial) => {
    const isUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!isUuidPattern.test(material.id)) {
      alert('Cannot delete this item: only materials stored in the database can be removed.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${material.title}"?`)) return;

    setDeletingId(material.id);
    try {
      await studyMaterialService.deleteMaterial(material.id, material.fileUrl);
      setMaterials((prev) => prev.filter((m) => m.id !== material.id));
      setSuccessBanner(`Deleted "${material.title}" from library.`);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const renderTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-500" />;
      case 'ppt':
        return <Presentation className="w-4 h-4 text-amber-500" />;
      case 'doc':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      default:
        return <ExternalLink className="w-4 h-4 text-[#1955a6]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" size="sm">
              Academic Repository
            </Badge>
            <span className="text-xs text-slate-500">• Course Syllabi, Cases & Slides</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
            Study Materials & Course Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publish lecture slides, case studies, and reading materials for enrolled MBA candidates.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setErrorMessage(null);
            setIsUploadModalOpen(true);
          }}
        >
          Upload New Material
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
        activeCategory={activeFilter}
        onCategoryChange={setActiveFilter}
        placeholder="Search materials by title, module, or keyword..."
        totalResults={filteredMaterials.length}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#1955a6]" />
          <span className="text-xs">Loading course study materials...</span>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <FolderArchive className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No study materials found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery
              ? 'Try modifying your search or clearing active filters.'
              : 'No study materials have been uploaded for this course yet.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            leftIcon={<Upload className="w-3.5 h-3.5" />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Document
          </Button>
        </div>
      ) : (
        /* Materials Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((mat) => (
            <Card
              key={mat.id}
              className="flex flex-col justify-between hover:border-slate-300 transition-all group"
              headerClassName="px-5 py-3.5 border-b border-slate-100 bg-[#ecf2fa]/30"
              title={
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {mat.courseCode}
                  </Badge>
                  <Badge variant="slate" size="sm">
                    Mod {mat.moduleNumber}
                  </Badge>
                </div>
              }
              action={renderTypeIcon(mat.type)}
            >
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {mat.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                    {mat.description || 'No additional instructions provided.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[140px]">By {mat.uploadedBy}</span>
                  {mat.fileSize && <span>{mat.fileSize}</span>}
                </div>

                {/* Card Actions: Secure Download & Delete */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-50">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs py-1 px-3 flex-1 justify-center"
                    leftIcon={
                      downloadingId === mat.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-[#1955a6]" />
                      )
                    }
                    isLoading={downloadingId === mat.id}
                    onClick={() => handleDownload(mat)}
                  >
                    Download
                  </Button>

                  {(role === 'faculty' || role === 'admin') && (
                    <button
                      title="Delete material"
                      onClick={() => handleDelete(mat)}
                      disabled={deletingId === mat.id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      aria-label="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Material Modal */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => {
            if (!isUploading) setIsUploadModalOpen(false);
          }}
          title="Upload Study Material"
          subtitle="Upload case studies, lecture slide decks, and syllabus readings"
          maxWidth="lg"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Upload Failed</span>
                  <span className="text-[11px] text-rose-700 leading-relaxed block mt-0.5">
                    {errorMessage}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-400 hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Target Subject Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Subject / Course
              </label>
              <select
                value={newCourseId}
                onChange={(e) => setNewCourseId(e.target.value)}
                disabled={isUploading}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#1955a6]"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Real File Selector Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Document File (PDF, PPT, DOC, XLS up to 50 MB)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                id="study-material-file-input"
                className="hidden"
                disabled={isUploading}
                accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.zip"
                onChange={handleFileChange}
              />

              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#1955a6] rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-[#ecf2fa]/40"
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">
                    Click to browse or drop file from your laptop
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports PDF cases, PowerPoint slides, Word documents, Excel sheets (Max 50 MB)
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-[#ecf2fa]/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-[#1955a6] flex-shrink-0">
                      {newType === 'pdf' ? (
                        <FileText className="w-5 h-5 text-rose-500" />
                      ) : newType === 'ppt' ? (
                        <Presentation className="w-5 h-5 text-amber-500" />
                      ) : (
                        <File className="w-5 h-5 text-[#1955a6]" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {formatBytes(selectedFile.size)} • Type: {newType.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {!isUploading && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="py-1 px-2.5 text-xs text-slate-600"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Change
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Material Title */}
            <Input
              label="Material Title"
              placeholder="e.g. Session 05: GenAI Product Discovery & Market Validation"
              value={newTitle}
              disabled={isUploading}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />

            {/* Module Number and Content Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Content Type
                </label>
                <select
                  value={newType}
                  disabled={isUploading}
                  onChange={(e) => setNewType(e.target.value as MaterialType)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#1955a6]"
                >
                  <option value="pdf">PDF Document / Case Study</option>
                  <option value="ppt">PowerPoint Slide Deck</option>
                  <option value="doc">Word Document / Handout</option>
                  <option value="link">Web Link / Dataset</option>
                </select>
              </div>

              <Input
                label="Module Number"
                type="number"
                min={1}
                max={12}
                value={newModule}
                disabled={isUploading}
                onChange={(e) => setNewModule(Number(e.target.value))}
                required
              />
            </div>

            {/* Description / Instructions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Description / Reading Instructions
              </label>
              <textarea
                rows={3}
                value={newDescription}
                disabled={isUploading}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Key concepts, preparation questions, or seminar prerequisites..."
                className="w-full text-xs rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#1955a6] focus:border-[#1955a6]"
              />
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Uploading to private Supabase Storage repository...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#1955a6] h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => setIsUploadModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isUploading}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
              >
                {isUploading ? 'Publishing...' : 'Upload & Publish to Portal'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
