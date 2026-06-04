import { create } from 'zustand';

interface ShiftState {
  isOnline: boolean;
  shiftStartedAt: string | null;
  isSharingLocation: boolean;
  setOnline: (online: boolean) => void;
  startShift: () => void;
  endShift: () => void;
  toggleLocationShare: () => void;
}

export const useShiftStore = create<ShiftState>(set => ({
  isOnline: false,
  shiftStartedAt: null,
  isSharingLocation: false,
  setOnline: isOnline => set({ isOnline }),
  startShift: () =>
    set({
      isOnline: true,
      shiftStartedAt: new Date().toISOString(),
    }),
  endShift: () =>
    set({
      isOnline: false,
      shiftStartedAt: null,
      isSharingLocation: false,
    }),
  toggleLocationShare: () =>
    set(state => ({ isSharingLocation: !state.isSharingLocation })),
}));
