import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

export const profileService = {
  /**
   * Fetch a user profile by ID from Supabase profiles table.
   */
  async getProfileById(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.warn(`[profileService] Profile not found for ${userId}:`, error?.message);
      return null;
    }

    const row = data as any;
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role as UserRole,
      avatarUrl: row.avatar_url || undefined,
      phone: row.phone || undefined,
      department: row.department || undefined,
      batch: row.batch || undefined,
      section: row.section || undefined,
      rollNumber: row.roll_number || undefined,
      specialization: row.specialization || undefined,
      cgpa: row.cgpa ? Number(row.cgpa) : undefined,
      trimester: row.trimester || undefined,
      designation: row.designation || undefined,
      officeRoom: row.office_room || undefined,
      qualifications: row.qualifications || undefined,
    };
  },

  /**
   * Fetch all profiles for a given role (e.g. all 'student' or all 'faculty').
   * Throws on database failure — no mock data fallbacks.
   */
  async getProfilesByRole(role: UserRole): Promise<UserProfile[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('name', { ascending: true });

    if (error) {
      console.error(`[profileService] Error fetching ${role} profiles:`, error.message);
      throw new Error(`Failed to load ${role} directory from database: ${error.message}`);
    }

    // Return real database profiles (which may be empty [] if none registered yet)
    return (data || []).map((row: any) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role as UserRole,
      avatarUrl: row.avatar_url || undefined,
      phone: row.phone || undefined,
      department: row.department || undefined,
      batch: row.batch || undefined,
      section: row.section || undefined,
      rollNumber: row.roll_number || undefined,
      specialization: row.specialization || undefined,
      cgpa: row.cgpa ? Number(row.cgpa) : undefined,
      trimester: row.trimester || undefined,
      designation: row.designation || undefined,
      officeRoom: row.office_room || undefined,
      qualifications: row.qualifications || undefined,
    }));
  },

  /**
   * Update profile contact and preferences.
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) updatePayload.name = updates.name;
    if (updates.phone !== undefined) updatePayload.phone = updates.phone;
    if (updates.avatarUrl !== undefined) updatePayload.avatar_url = updates.avatarUrl;
    if (updates.officeRoom !== undefined) updatePayload.office_room = updates.officeRoom;

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to update profile in Supabase');
    }

    const row = data as any;
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role as UserRole,
      avatarUrl: row.avatar_url || undefined,
      phone: row.phone || undefined,
      department: row.department || undefined,
      batch: row.batch || undefined,
      section: row.section || undefined,
      rollNumber: row.roll_number || undefined,
      specialization: row.specialization || undefined,
      cgpa: row.cgpa ? Number(row.cgpa) : undefined,
      trimester: row.trimester || undefined,
      designation: row.designation || undefined,
      officeRoom: row.office_room || undefined,
      qualifications: row.qualifications || undefined,
    };
  },
};
