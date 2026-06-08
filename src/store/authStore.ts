import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlaceholderImages } from '@assets/placeholders';
import { authService } from '@api/services/authService';
import type { ApiResponse } from '@api/models/common.models';
import type { AuthSessionResponse } from '@api/models/auth.models';
import type { DriverProfile } from '@domain/driver.types';

interface AuthState {
  isAuthenticated: boolean;
  profile: DriverProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  restoreSession: () => Promise<boolean>;
  updateProfile: (patch: Partial<DriverProfile>) => void;
  logout: () => Promise<void>;
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

function applySession(
  session: AuthSessionResponse,
  set: (partial: Partial<AuthState>) => void,
) {
  set({
    isAuthenticated: true,
    profile: withAvatar(session.profile),
    accessToken: session.access_token,
  });
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      profile: null,
      accessToken: null,
      isLoading: false,

      loginWithOtp: async (phone, otp) => {
        if (!phone.trim() || !otp.trim()) return false;
        set({ isLoading: true });
        try {
          const res = await authService.verifyLoginOtp({ phone, otp });
          if (!isSessionResponse(res)) return false;
          applySession(res.data, set);
          return true;
        } finally {
          set({ isLoading: false });
        }
      },

      restoreSession: async () => {
        const { accessToken } = get();
        if (!accessToken) return false;
        set({ isLoading: true });
        try {
          const res = await authService.fetchProfile();
          if (!res.success || !res.data?.profile) {
            set({ isAuthenticated: false, profile: null, accessToken: null });
            return false;
          }
          set({
            isAuthenticated: true,
            profile: withAvatar(res.data.profile),
          });
          return true;
        } catch {
          set({ isAuthenticated: false, profile: null, accessToken: null });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: patch =>
        set(state => ({
          profile: state.profile ? withAvatar({ ...state.profile, ...patch }) : null,
        })),

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // Local logout even if API fails
        }
        set({ isAuthenticated: false, profile: null, accessToken: null });
      },
    }),
    {
      name: 'legend-driver-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        accessToken: state.accessToken,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
