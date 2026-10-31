import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { profileService } from '../services/profileService';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  supabaseConnected: boolean;
  loginAsDemo: (role: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  signUpStudent: (email: string, password: string, name: string, rollNumber?: string) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'hsb_lms_user_role';
const DEMO_PERSONA_KEY = 'hsb_demo_persona_active';

/**
 * Maps raw backend authentication errors into clear, institutional messages.
 */
const formatAuthError = (err: any): string => {
  const message = (err?.message || '').toLowerCase();
  const status = err?.status;

  if (message.includes('email not confirmed') || (status === 400 && message.includes('confirmed'))) {
    return 'Your email address has not been confirmed yet. Please check your inbox for the activation link, or have the Registrar confirm your account in the Supabase Dashboard.';
  }
  if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
    return 'Invalid institutional email or password. Please verify your credentials or register a new student account.';
  }
  if (message.includes('user already registered') || message.includes('already exists') || message.includes('already in use')) {
    return 'An account with this email address already exists in the HSB registry. Please sign in instead.';
  }
  if (message.includes('password') && (message.includes('short') || message.includes('least 6') || message.includes('weak'))) {
    return 'Password must contain at least 6 characters.';
  }
  if (message.includes('rate limit')) {
    return 'Too many authentication attempts. Please wait a few moments before trying again.';
  }
  return err?.message || 'Authentication request failed. Please check your network connection and try again.';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(isSupabaseConfigured());
  const isDemo = !isSupabaseConfigured() || (user ? user.id.startsWith('usr_') : false);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      if (isSupabaseConfigured()) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('[AuthContext] Session retrieval error:', error.message);
          }

          if (session?.user) {
            // Real session exists: clear any lingering demo marker
            localStorage.removeItem(DEMO_PERSONA_KEY);

            const dbProfile = await profileService.getProfileById(session.user.id);
            if (dbProfile) {
              setUser(dbProfile);
              setSupabaseConnected(true);
              setIsLoading(false);
              return;
            }

            // Fallback from auth user metadata if profile row isn't yet synced
            const metadata = session.user.user_metadata || {};
            setUser({
              id: session.user.id,
              email: session.user.email || 'user@hsb.edu.in',
              name: metadata.name || session.user.email?.split('@')[0] || 'HSB Scholar',
              role: (metadata.role as UserRole) || 'student',
              rollNumber: metadata.roll_number,
              batch: metadata.batch || 'MBA 2025-27',
              section: metadata.section || 'Section B',
              specialization: metadata.specialization,
            });
            setSupabaseConnected(true);
            setIsLoading(false);
            return;
          }

          // When no session exists, only restore demo if explicitly chosen
          const savedRole = localStorage.getItem(AUTH_STORAGE_KEY) as UserRole | null;
          const isExplicitDemo = localStorage.getItem(DEMO_PERSONA_KEY) === 'true';
          if (isExplicitDemo && savedRole && DEMO_USERS[savedRole]) {
            setUser(DEMO_USERS[savedRole]);
          } else {
            setUser(null);
          }
          setSupabaseConnected(true);
          setIsLoading(false);
          return;
        } catch (err: any) {
          console.warn('[AuthContext] Supabase auth check error:', err?.message);
        }
      }

      // Offline / Demo Mode fallback (only when Supabase credentials are missing entirely)
      const savedRole = localStorage.getItem(AUTH_STORAGE_KEY) as UserRole | null;
      if (savedRole && DEMO_USERS[savedRole]) {
        setUser(DEMO_USERS[savedRole]);
      } else {
        setUser(DEMO_USERS.student);
        localStorage.setItem(AUTH_STORAGE_KEY, 'student');
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen to real Supabase auth state changes if credentials exist
    if (isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          localStorage.removeItem(DEMO_PERSONA_KEY);
          const dbProfile = await profileService.getProfileById(session.user.id);
          if (dbProfile) {
            setUser(dbProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem(DEMO_PERSONA_KEY);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const loginAsDemo = (targetRole: UserRole) => {
    const selectedUser = DEMO_USERS[targetRole];
    if (selectedUser) {
      setUser(selectedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, targetRole);
      localStorage.setItem(DEMO_PERSONA_KEY, 'true');
    }
  };

  const loginWithCredentials = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: formatAuthError(error) };
        }

        if (data.user) {
          localStorage.removeItem(DEMO_PERSONA_KEY);
          const dbProfile = await profileService.getProfileById(data.user.id);
          const resolvedRole: UserRole = dbProfile?.role || (data.user.user_metadata?.role as UserRole) || 'student';

          if (dbProfile) {
            setUser(dbProfile);
          } else {
            const meta = data.user.user_metadata || {};
            setUser({
              id: data.user.id,
              email: data.user.email!,
              name: meta.name || data.user.email!.split('@')[0],
              role: resolvedRole,
              rollNumber: meta.roll_number,
              batch: meta.batch || 'MBA 2025-27',
              section: meta.section || 'Section B',
            });
          }
          setIsLoading(false);
          return { success: true, role: resolvedRole };
        }
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: formatAuthError(err) };
      }
    }

    // Demo Mode sign-in (when Supabase credentials are not configured yet)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const lowerEmail = email.trim().toLowerCase();
    let targetRole: UserRole = 'student';

    if (
      lowerEmail.includes('faculty') ||
      lowerEmail.includes('jenkins') ||
      lowerEmail.includes('prof') ||
      lowerEmail.startsWith('s.')
    ) {
      targetRole = 'faculty';
    } else if (
      lowerEmail.includes('admin') ||
      lowerEmail.includes('sen') ||
      lowerEmail.includes('registrar')
    ) {
      targetRole = 'admin';
    } else {
      targetRole = 'student';
    }

    const matchedUser = DEMO_USERS[targetRole];
    setUser({
      ...matchedUser,
      email: email.trim().endsWith('@hsb.edu.in') ? email.trim() : `${email.trim()}@hsb.edu.in`,
    });
    localStorage.setItem(AUTH_STORAGE_KEY, targetRole);
    localStorage.setItem(DEMO_PERSONA_KEY, 'true');
    setIsLoading(false);
    return { success: true, role: targetRole };
  };

  const signUpStudent = async (
    email: string,
    password: string,
    name: string,
    rollNumber?: string
  ): Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }> => {
    setIsLoading(true);
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return { success: false, error: 'Supabase credentials are not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            roll_number: rollNumber?.trim() || `HSB-25-${Math.floor(1000 + Math.random() * 9000)}`,
            batch: 'MBA 2025-27',
            section: 'Section B',
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: formatAuthError(error) };
      }

      if (data.session?.user) {
        localStorage.removeItem(DEMO_PERSONA_KEY);
        const dbProfile = await profileService.getProfileById(data.session.user.id);
        if (dbProfile) {
          setUser(dbProfile);
        } else {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email!,
            name: name.trim(),
            role: 'student',
            batch: 'MBA 2025-27',
            section: 'Section B',
          });
        }
        setIsLoading(false);
        return { success: true, requiresEmailConfirmation: false };
      }

      setIsLoading(false);
      return { success: true, requiresEmailConfirmation: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: formatAuthError(err) };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[AuthContext] Error during Supabase signOut:', err);
      }
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(DEMO_PERSONA_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    loginAsDemo(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        isDemoMode: isDemo,
        isLoading,
        supabaseConnected,
        loginAsDemo,
        loginWithCredentials,
        signUpStudent,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
