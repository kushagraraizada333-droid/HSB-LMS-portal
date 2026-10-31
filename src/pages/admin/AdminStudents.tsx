import React, { useState, useEffect } from 'react';
import { MOCK_STUDENTS_LIST } from '../../data/mockData';
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
  Users,
  UserPlus,
  CheckCircle2,
  Mail,
  Phone,
  Award,
  Layers,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBatchFilter, setActiveBatchFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    setErrorMessage(null);
    profileService.getProfilesByRole('student').then((data) => {
      if (isMounted) {
        setStudents(data);
        setIsLoading(false);
      }
    }).catch((err) => {
      console.error('[AdminStudents] Error loading students from database:', err);
      if (isMounted) {
        setErrorMessage(err.message || 'Failed to load students directory.');
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [batch, setBatch] = useState('MBA 2025-27');
  const [section, setSection] = useState('Section B');
  const [specialization, setSpecialization] = useState('Product Management & AI Strategy');
  const [phone, setPhone] = useState('+91 98765 00000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Candidates', count: students.length },
    { id: 'MBA 2025-27', label: 'MBA Class of 2027 (Yr 1)', count: students.filter((s) => s.batch === 'MBA 2025-27').length },
    { id: 'MBA 2024-26', label: 'MBA Class of 2026 (Yr 2)', count: students.filter((s) => s.batch === 'MBA 2024-26').length },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.rollNumber && student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.specialization && student.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBatch =
      activeBatchFilter === 'all' || student.batch === activeBatchFilter;

    return matchesSearch && matchesBatch;
  });

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newStudent: UserProfile = {
      id: `usr_student_${Date.now()}`,
      name,
      email,
      role: 'student', // Enforces Rule 9: Role is fixed to student
      rollNumber,
      batch,
      section,
      specialization,
      cgpa: 3.75, // Starting provisional GPA
      trimester: batch === 'MBA 2025-27' ? 3 : 6,
      phone,
    };

    setStudents((prev) => [newStudent, ...prev]);
    setIsSubmitting(false);
    setIsRegisterModalOpen(false);
    setSuccessBanner(`Candidate ${name} (${rollNumber}) registered successfully.`);

    // Reset form
    setName('');
    setEmail('');
    setRollNumber('');

    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">Registrar Records</Badge>
            <span className="text-xs text-slate-500">• MBA Cohort Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Student Admissions & Cohort Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Maintain master candidate directories, sectional allocations, and academic standings.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIsRegisterModalOpen(true)}
        >
          Register New Student
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
        activeCategory={activeBatchFilter}
        onCategoryChange={setActiveBatchFilter}
        placeholder="Search students by roll number, name, or specialization..."
        totalResults={filteredStudents.length}
      />

      {/* Students Table */}
      <Card
        title="Candidate Register"
        subtitle="Active MBA batch allocations"
        icon={<Users className="w-4 h-4 text-brand-600" />}
      >
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-[#1955a6] animate-spin" />
            <span className="text-xs text-slate-500">Querying student directory from Supabase...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            icon={<Users className="w-8 h-8 text-[#1955a6]" />}
            title="No Candidates Found"
            description="Use the 'Register New Student' button above to enroll a candidate into the academic database."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Roll Number</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Batch & Section</th>
                  <th className="px-4 py-3">Specialization</th>
                  <th className="px-4 py-3 text-center">CGPA</th>
                  <th className="px-4 py-3 text-center">Term</th>
                  <th className="px-4 py-3">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{st.rollNumber}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{st.name}</div>
                      <div className="text-[11px] text-slate-400">{st.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{st.batch}</div>
                      <div className="text-[11px] text-slate-400">{st.section}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{st.specialization}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200">
                        {st.cgpa?.toFixed(2) || '3.70'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="slate" size="sm">
                        Trimester {st.trimester}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-[11px]">{st.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Register Student Modal */}
      {isRegisterModalOpen && (
        <Modal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          title="Register MBA Candidate"
          subtitle="Add a student record to the academic registry"
          maxWidth="lg"
        >
          <form onSubmit={handleRegisterStudent} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
              <span className="font-semibold">Rule 9 Security Standard:</span> Role is strictly constrained to <strong>Student</strong>. Administrators cannot grant faculty credentials from this public intake.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Full Candidate Name"
                placeholder="e.g. Siddharth Nair"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Assigned Roll Number"
                placeholder="e.g. HSB-MBA-2025-089"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Institutional Email"
                type="email"
                placeholder="siddharth.nair@hsb.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Contact Mobile"
                placeholder="+91 99297 56620"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cohort Batch
                </label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="MBA 2025-27">MBA 2025-27 (Year 1)</option>
                  <option value="MBA 2024-26">MBA 2024-26 (Year 2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assigned Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Specialization
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="Product Management & AI Strategy">Product Management & AI Strategy</option>
                  <option value="Corporate Finance & FinTech">Corporate Finance & FinTech</option>
                  <option value="Marketing Intelligence & Growth">Marketing Intelligence & Growth</option>
                  <option value="Technology, Design & Operations">Technology, Design & Operations</option>
                  <option value="Business Analytics & Decision Sciences">Business Analytics & Decision Sciences</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRegisterModalOpen(false)}
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
                Complete Registration
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
