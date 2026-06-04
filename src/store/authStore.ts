import { create } from 'zustand';
import { PlaceholderImages } from '@assets/placeholders';
import { authService } from '@api/services/authService';
import type { ApiResponse } from '@api/models/common.models';
import type { AuthSessionResponse } from '@api/models/auth.models';
import type { DriverProfile } from '@domain/driver.types';

interface AuthState {
  isAuthenticated: boolean;
  profile: DriverProfile | null;
  isLoading: boolean;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  updateProfile: (patch: Partial<DriverProfile>) => void;
  logout: () => void;
}

function withAvatar(profile: DriverProfile): DriverProfile {
  return {
    ...profile,
    avatar_uri: profile.avatar_uri,
    avatar_source: profile.avatar_uri ? undefined : PlaceholderImages.driverAvatar,
  };
}

function isSessionResponse(
  res: ApiResponse<AuthSessionResponse> | { success: false; message: string },
): res is ApiResponse<AuthSessionResponse> {
  return res.success === true && 'data' in res && Boolean(res.data?.profile);
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  profile: null,
  isLoading: false,
  loginWithOtp: async (phone, otp) => {
    if (!phone.trim() || !otp.trim()) return false;
    set({ isLoading: true });
    try {
      const res = await authService.verifyLoginOtp({ phone, otp });
      if (!isSessionResponse(res)) return false;
      set({
        isAuthenticated: true,
        profile: withAvatar(res.data.profile),
      });
      return true;
    } finally {
      set({ isLoading: false });
    }
  },
  updateProfile: patch =>
    set(state => ({
      profile: state.profile ? withAvatar({ ...state.profile, ...patch }) : null,
    })),
  logout: () => set({ isAuthenticated: false, profile: null }),
}));
