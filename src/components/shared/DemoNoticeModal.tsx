import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { HsbLogo } from '../common/HsbLogo';
import { Database, ShieldCheck, UserCheck, CheckCircle2, ArrowRight, Info, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { HSB_CAMPUS_INFO } from '../../data/mockData';
import { testSupabaseConnection, isSupabaseConfigured } from '../../lib/supabase';

interface DemoNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoNoticeModal: React.FC<DemoNoticeModalProps> = ({ isOpen, onClose }) => {
  const { switchRole, role } = useAuth();
  const [testResult, setTestResult] = useState<{ connected: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    const result = await testSupabaseConnection();
    setTestResult(result);
    setIsTesting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <HsbLogo variant="blue" height={24} />
          <span>Portal Architecture & Identity</span>
        </div>
      }
      subtitle={`${HSB_CAMPUS_INFO.name} • Jaipur, Rajasthan`}
      maxWidth="xl"
      footer={
        <Button variant="primary" onClick={onClose} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Explore HSB Portal
        </Button>
      }
    >
      <div className="space-y-4 text-sm text-slate-600">
        {/* Student Project Notice */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#1955a6] flex-shrink-0 mt-0.5" />
          <div>
            <strong>Notice on Institutional Identity:</strong> This is a student LMS portal redesign project applying the official visual identity, colors, and typography of the <strong>Hari Shankar Singhania School of Business (HSB)</strong>, Jaipur. It is not an officially commissioned portal of HSB.
          </div>
        </div>

        {/* Stage 2 Live Supabase Status & Test Button */}
        <div className="p-3.5 bg-[#ecf2fa] border border-[#a3c5e9] rounded-xl text-[#16488d] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#1955a6]" />
              <strong className="font-semibold text-slate-900">Stage 2: Supabase Integration Status</strong>
            </div>
            <Badge variant={isSupabaseConfigured() ? 'success' : 'warning'} size="sm">
              {isSupabaseConfigured() ? 'CONFIGURED' : 'CREDENTIALS NEEDED'}
            </Badge>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            {isSupabaseConfigured()
              ? 'Supabase URL and anon key detected in .env. Connected to PostgreSQL.'
              : 'Supabase credentials are not yet set in .env. Portal is currently running in preview mode using typed HSB curriculum data.'}
          </p>

          <div className="pt-2 border-t border-[#a3c5e9]/50 flex items-center justify-between gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white text-xs"
              isLoading={isTesting}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleTestConnection}
            >
              Test Supabase Connection
            </Button>
            <span className="text-[10px] text-slate-500">Database: PostgreSQL • Row Level Security</span>
          </div>

          {testResult && (
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                testResult.connected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {testResult.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <span className="text-[11px] leading-relaxed">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Personas */}
        <div>
          <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#1955a6]" />
            Switch Active HSB Persona
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => {
                switchRole('student');
                onClose();
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                role === 'student'
                  ? 'border-[#1955a6] bg-[#ecf2fa] ring-2 ring-[#1955a6]/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-xs">Arjun Mehta</span>
                <Badge size="sm" variant="primary">Student</Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">MBA '27 • Roll #042</p>
              <p className="text-[10px] text-[#1955a6] font-medium mt-1">AI Product Management</p>
            </button>

            <button
              onClick={() => {
                switchRole('faculty');
                onClose();
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                role === 'faculty'
                  ? 'border-[#1955a6] bg-[#ecf2fa] ring-2 ring-[#1955a6]/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-xs">Prof. Sarah Jenkins</span>
                <Badge size="sm" variant="secondary">Faculty</Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Chair, Product Leadership</p>
              <p className="text-[10px] text-indigo-700 font-medium mt-1">Valuation & Strategy</p>
            </button>

            <button
              onClick={() => {
                switchRole('admin');
                onClose();
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                role === 'admin'
                  ? 'border-[#1955a6] bg-[#ecf2fa] ring-2 ring-[#1955a6]/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-xs">Dr. Vikram Sen</span>
                <Badge size="sm" variant="gold">Registrar</Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Academic Affairs</p>
              <p className="text-[10px] text-amber-800 font-medium mt-1">Admissions & Curricula</p>
            </button>
          </div>
        </div>

        {/* Compliance */}
        <div className="border-t border-slate-100 pt-3">
          <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Official Branding Assets
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Official vector SVG and PNG logo assets sourced directly from <code>hsb.edu.in</code>.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>True HSB color tokens applied: Sapphire Blue (<code>#1955A6</code>), Deep Cobalt (<code>#1D3C74</code>), and Ice Tint (<code>#ECF2FA</code>).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Typography updated to HSB's brand typography: <strong>Roboto</strong> and <strong>Roboto Slab</strong>.</span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
