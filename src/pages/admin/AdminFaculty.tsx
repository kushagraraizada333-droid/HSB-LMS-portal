import React, { useState, useEffect } from 'react';
import { MOCK_FACULTY_LIST } from '../../data/mockData';
import { UserProfile } from '../../types';
import { profileService } from '../../services/profileService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { Input } from '../../components/common/Input';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import {
  GraduationCap,
  UserPlus,
  CheckCircle2,
  Mail,
  MapPin,
  Building,
  Award,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const AdminFaculty: React.FC = () => {
  const [faculty, setFaculty] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDept, setActiveDept] = useState('all');

  useEffect(() => {
    let isMounted = true;
    setErrorMessage(null);
    profileService.getProfilesByRole('faculty').then((data) => {
      if (isMounted) {
        setFaculty(data);
        setIsLoading(false);
      }
    }).catch((err) => {
      console.error('[AdminFaculty] Error loading faculty from database:', err);
      if (isMounted) {
        setErrorMessage(err.message || 'Failed to load faculty directory.');
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [department, setDepartment] = useState('Product & AI Leadership');
  const [officeRoom, setOfficeRoom] = useState('Faculty Wing, HSB Campus, Room 204');
  const [qualifications, setQualifications] = useState('Ph.D. (IIT Delhi / Stanford Fellow)');
  const [phone, setPhone] = useState('+91 99297 56620');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Faculty', count: faculty.length },
    { id: 'Product', label: 'Product & AI', count: faculty.filter((f) => f.department?.includes('Product')).length },
    { id: 'Finance', label: 'Finance & Economics', count: faculty.filter((f) => f.department?.includes('Finance')).length },
    { id: 'Marketing', label: 'Marketing Strategy', count: faculty.filter((f) => f.department?.includes('Marketing')).length },
    { id: 'Strategy', label: 'Strategy & Leadership', count: faculty.filter((f) => f.department?.includes('Strategy')).length },
    { id: 'Analytics', label: 'Analytics & Tech', count: faculty.filter((f) => f.department?.includes('Analytics')).length },
  ];

  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.designation && f.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.qualifications && f.qualifications.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept =
      activeDept === 'all' || (f.department && f.department.includes(activeDept));

    return matchesSearch && matchesDept;
  });

  const handleAppointFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newFaculty: UserProfile = {
      id: `usr_faculty_${Date.now()}`,
      name,
      email,
      role: 'faculty',
      designation,
      department,
      officeRoom,
      qualifications,
      phone,
    };

    setFaculty((prev) => [newFaculty, ...prev]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setSuccessBanner(`Academic appointment processed for ${name}.`);

    setName('');
    setEmail('');

    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">Academic Staff Registry</Badge>
            <span className="text-xs text-slate-500">• 34 Full-Time & Adjunct Faculty</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Faculty Directory & Department Allocations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage academic chairs, professorial appointments, and office room allocations.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Appoint New Faculty
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
        placeholder="Search faculty by name, department, or qualifications..."
        totalResults={filteredFaculty.length}
      />

      {/* Faculty Cards Grid */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 text-[#1955a6] animate-spin" />
          <span className="text-xs text-slate-500">Querying faculty directory from Supabase...</span>
        </div>
      ) : filteredFaculty.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="w-8 h-8 text-[#1955a6]" />}
          title="No Faculty Found"
          description="Use the 'Appoint New Faculty' button above to register a faculty member into the academic directory."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculty.map((f) => (
            <Card
              key={f.id}
              headerClassName="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50"
              title={
                <span className="font-bold text-slate-900 text-sm">
                  {f.name}
                </span>
              }
              badge={<Badge variant="secondary" size="sm">Faculty</Badge>}
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-brand-700">
                    {f.designation}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {f.department}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2 text-[11px]">
                    <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="truncate">{f.qualifications}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{f.officeRoom}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{f.email}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Appoint Faculty Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Appoint Faculty Member"
          subtitle="Add an instructor or professor to the directory"
          maxWidth="lg"
        >
          <form onSubmit={handleAppointFaculty} className="space-y-4">
            <Input
              label="Full Name with Honorific"
              placeholder="e.g. Dr. Rajeshwari Sundaram, Ph.D."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Institutional Email"
                type="email"
                placeholder="sarah.jenkins@hsb.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Rank / Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="Professor & Chair">Professor & Chair</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Adjunct Professor of Practice">Adjunct Professor of Practice</option>
                </select>
              </div>

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
                  <option value="Marketing & Digital Strategy">Marketing & Digital Strategy</option>
                  <option value="Strategy & Leadership">Strategy & Leadership</option>
                  <option value="Analytics & Information Systems">Analytics & Information Systems</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Office Room Location"
                placeholder="Faculty Wing, HSB Campus, Room 204"
                value={officeRoom}
                onChange={(e) => setOfficeRoom(e.target.value)}
                required
              />
              <Input
                label="Degrees & Credentials"
                placeholder="Ph.D. (IIT Delhi / Stanford Fellow), B.Tech"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
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
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Confirm Appointment
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
