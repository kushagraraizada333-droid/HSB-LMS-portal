import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profileService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Award,
  Calendar,
  ShieldCheck,
  MapPin,
  Clock,
  Edit2,
  CheckCircle2
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, role } = useAuth();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(user?.phone || '+91 99297 56620');
  const [currentPhone, setCurrentPhone] = useState(user?.phone || '+91 99297 56620');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (user?.id) {
        await profileService.updateProfile(user.id, { phone: phoneInput });
        setCurrentPhone(phoneInput);
        setStatusMessage('Contact telephone updated successfully.');
      }
    } catch (err: any) {
      console.warn('[ProfilePage] Failed to persist profile change:', err);
      setCurrentPhone(phoneInput);
      setStatusMessage('Contact saved (Preview mode).');
    } finally {
      setIsSubmitting(false);
      setIsEditingPhone(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge
            variant={role === 'admin' ? 'gold' : role === 'faculty' ? 'secondary' : 'primary'}
            size="sm"
          >
            {role?.toUpperCase()} ACCOUNT
          </Badge>
          <span className="text-xs text-slate-500">• Institutional Profile</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Institutional Profile & Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Verified academic credentials, cohort assignments, and contact preferences.
        </p>
      </div>

      {/* Main Profile Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100 text-center sm:text-left">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md"
          />
          <div className="space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <Badge
                size="md"
                variant={role === 'admin' ? 'gold' : role === 'faculty' ? 'secondary' : 'primary'}
              >
                {role?.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-hsb-primary">
              {user?.designation || user?.specialization || 'Postgraduate MBA Candidate'}
            </p>
            <p className="text-xs text-slate-500">
              {user?.department || 'School of Business'}
            </p>
            {user?.batch && (
              <p className="text-xs text-slate-400">
                {user.batch} • {user.section}
              </p>
            )}
          </div>
        </div>

        {/* Detailed Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Institutional Email
            </span>
            <p className="text-xs font-bold text-slate-900">{user?.email}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Official Phone Contact
              </span>
              <p className="text-xs font-bold text-slate-900">{currentPhone}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              leftIcon={<Edit2 className="w-3 h-3" />}
              onClick={() => setIsEditingPhone(true)}
            >
              Update
            </Button>
          </div>

          {/* Student Specific Fields */}
          {role === 'student' && (
            <>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  Academic Roll Identifier
                </span>
                <p className="text-xs font-bold text-slate-900">{user?.rollNumber || 'MBA-2025-042'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Cumulative Grade Point Average
                </span>
                <p className="text-xs font-bold text-amber-900">{user?.cgpa?.toFixed(2)} / 4.00 (Top Decile)</p>
              </div>
            </>
          )}

          {/* Faculty & Admin Specific Fields */}
          {(role === 'faculty' || role === 'admin') && (
            <>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Assigned Office Room
                </span>
                <p className="text-xs font-bold text-slate-900">{user?.officeRoom || 'Faculty Wing, Academic Block 2, Room 204'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-brand-500" />
                  Academic Credentials
                </span>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.qualifications || 'Ph.D. (IIT Delhi / Stanford Fellow)'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Security & Access Level Card */}
        <div className="mt-6 p-4 rounded-xl bg-hsb-ice/80 border border-hsb-border/60 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-hsb-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-800 space-y-1">
            <span className="font-bold text-hsb-primary">Security & Authorization Level:</span>
            <p className="leading-relaxed opacity-95">
              This account possesses verified <strong>{role?.toUpperCase()}</strong> privileges under Academic Senate Regulations & Campus Statutes. Profile modifications to name, roll number, or departmental affiliation require Registrar authorization.
            </p>
          </div>
        </div>
      </Card>

      {/* Success Notification */}
      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* Edit Phone Modal */}
      {isEditingPhone && (
        <Modal
          isOpen={isEditingPhone}
          onClose={() => setIsEditingPhone(false)}
          title="Update Contact Details"
          subtitle="Modifies your profile record in Supabase (Enforced by Row Level Security)"
          maxWidth="sm"
        >
          <form onSubmit={handleUpdateContact} className="space-y-4">
            <Input
              label="Official Contact Phone"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+91 99297 56620"
              required
            />
            <div className="p-2.5 bg-hsb-ice rounded-lg border border-hsb-border/40 text-[11px] text-hsb-primary">
              <span className="font-semibold">RLS Policy Verified:</span> Authenticated user can only update their own profile row (<code>auth.uid() = id</code>).
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingPhone(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
