import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { HsbLogo } from '../../components/common/HsbLogo';
import {
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
  Info,
  MapPin
} from 'lucide-react';
import { UserRole } from '../../types';
import { HSB_CAMPUS_INFO } from '../../data/mockData';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials, signUpStudent, loginAsDemo, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to current role dashboard
  React.useEffect(() => {
    if (isAuthenticated && role) {
      navigate(`/${role}`);
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    if (!email || !password) {
      setError('Please provide your HSB institutional email and password.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address (e.g. arjun.mehta@hsb.edu.in).');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full student name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      setIsLoading(true);
      const regResult = await signUpStudent(email, password, name, rollNumber);
      setIsLoading(false);

      if (regResult.success) {
        if (regResult.requiresEmailConfirmation) {
          setSuccessNotice(
            `Student registration submitted for ${email}! Please check your email for the confirmation link, or have the Registrar activate your account before signing in.`
          );
          setMode('signin');
        } else {
          navigate('/student');
        }
      } else {
        setError(regResult.error || 'Registration failed.');
      }
      return;
    }

    setIsLoading(true);
    const result = await loginWithCredentials(email, password);
    setIsLoading(false);

    if (result.success && result.role) {
      navigate(`/${result.role}`);
    } else if (result.success) {
      navigate('/student');
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    loginAsDemo(demoRole);
    navigate(`/${demoRole}`);
  };

  return (
    <div className="min-h-screen bg-[#1d3c74] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Ambient Gradients (HSB Sapphire & Cobalt) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1955a6]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#244a9a]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        {/* Official HSB Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#0d1d3a] p-4 rounded-2xl border border-[#244a9a]/60 shadow-xl inline-flex items-center justify-center max-w-[320px]">
            <HsbLogo variant="white" height={42} />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-serif mt-2">
          Academic Management Portal
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-blue-200 font-medium">
          Flagship 2-Year Residential MBA • Jaipur Campus
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-200">
          {/* Mode Switch Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); setSuccessNotice(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); setSuccessNotice(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-[#1955a6] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Student Registration
            </button>
          </div>

          {/* Registration Role Notice */}
          {mode === 'register' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-[#16488d] text-xs">
              <span className="font-bold">Institutional Security Policy:</span> All public registrations automatically assign the <span className="font-semibold underline">Student</span> role in the HSB database. Faculty and administrator accounts are provisioned exclusively by the Registrar.
            </div>
          )}

          {/* Success Banner */}
          {successNotice && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <Input
                  label="Candidate Full Name"
                  type="text"
                  placeholder="e.g. Priyanshu Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Roll / Application Number (Optional)"
                  type="text"
                  placeholder="e.g. HSB-25-042"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
              </>
            )}

            <Input
              label="HSB Institutional Email"
              type="email"
              placeholder="e.g. arjun.mehta@hsb.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 text-[#1955a6] focus:ring-[#1955a6] mr-2"
                  />
                  Remember this device
                </label>
                <button
                  type="button"
                  onClick={() => setError('Password resets are managed by the HSB Academic Office (registrar@hsb.edu.in).')}
                  className="text-[#1955a6] hover:text-[#16488d] font-semibold"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2 bg-[#1955a6] hover:bg-[#16488d]"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {mode === 'signin' ? 'Sign In to HSB Portal' : 'Register Student Account'}
            </Button>
          </form>

          {/* Toggle link below form */}
          <div className="mt-4 text-center">
            {mode === 'signin' ? (
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); setSuccessNotice(null); }}
                className="text-xs text-[#1955a6] hover:underline font-semibold"
              >
                New MBA Scholar? Register Student Account →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); setSuccessNotice(null); }}
                className="text-xs text-[#1955a6] hover:underline font-semibold"
              >
                ← Already have an account? Sign in here
              </button>
            )}
          </div>

          {/* Quick 1-Click Role Login Selector */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#1955a6]" />
                1-Click HSB Personas
              </span>
              <Badge size="sm" variant="primary">Instant Access</Badge>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-[#1955a6] hover:bg-[#ecf2fa] transition-all flex items-center justify-between text-left group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#1955a6]">
                    Arjun Mehta
                  </div>
                  <div className="text-[11px] text-slate-500">Student • MBA Batch 2025–27 (AI Product Track)</div>
                </div>
                <Badge size="sm" variant="primary">Student</Badge>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('faculty')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all flex items-center justify-between text-left group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                    Prof. Sarah Jenkins, Ph.D.
                  </div>
                  <div className="text-[11px] text-slate-500">Chair, Product Leadership & Valuation</div>
                </div>
                <Badge size="sm" variant="secondary">Faculty</Badge>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-[#1d3c74] hover:bg-[#ecf2fa] transition-all flex items-center justify-between text-left group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#1d3c74]">
                    Dr. Vikram Sen
                  </div>
                  <div className="text-[11px] text-slate-500">Chief Academic Registrar, HSB Jaipur</div>
                </div>
                <Badge size="sm" variant="gold">Registrar</Badge>
              </button>
            </div>
          </div>

          {/* Institutional Compliance Disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-normal">
            <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Disclaimer:</strong> This is an independent student LMS project using HSB's visual identity. It is not an officially commissioned portal of HSB.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-blue-200/80 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Hari Shankar Singhania School of Business • Jaipur, Rajasthan</span>
        </div>
      </div>
    </div>
  );
};
