import { create } from "zustand";
import { useFaceId, checkFaceIdAvailability } from "../utils/faceIdAuth";

interface User {
  id: string;
  name: string;
  role: "owner" | "cashier" | "manager";
}

interface AuthState {
  isUnlocked: boolean;
  isLoading: boolean;
  error: string | null;
  currentUser: User | null;
  users: User[];
  faceIdAvailable: boolean;
  faceIdType: "face" | "fingerprint" | "none";

  // Actions
  unlock: () => Promise<void>;
  lock: () => void;
  setCurrentUser: (user: User) => void;
  getCurrentUser: () => User | null;
  getAllUsers: () => User[];
  checkFaceIdAvailability: () => Promise<void>;
  clearError: () => void;
}

// Predefined users for POS system
const defaultUsers: User[] = [
  { id: "owner", name: "Store Owner", role: "owner" },
  { id: "cashier1", name: "Cashier 1", role: "cashier" },
  { id: "cashier2", name: "Cashier 2", role: "cashier" },
  { id: "manager", name: "Manager", role: "manager" },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  isUnlocked: false,
  isLoading: false,
  error: null,
  currentUser: null,
  users: defaultUsers,
  faceIdAvailable: false,
  faceIdType: "none",

  unlock: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await useFaceId();

      if (result.success) {
        set({ isUnlocked: true, error: null });
      } else {
        set({ error: result.error || "Face ID authentication failed" });
      }
    } catch (error) {
      set({ error: error.message || "Face ID authentication failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  lock: () => {
    set({ isUnlocked: false });
  },

  setCurrentUser: (user: User) => {
    set({ currentUser: user });
  },

  getCurrentUser: () => {
    return get().currentUser;
  },

  getAllUsers: () => {
    return get().users;
  },

  checkFaceIdAvailability: async () => {
    try {
      const availability = await checkFaceIdAvailability();
      set({
        faceIdAvailable: availability.available,
        faceIdType: availability.type,
      });
    } catch (error) {
      console.error("Error checking Face ID availability:", error);
      set({
        faceIdAvailable: false,
        faceIdType: "none",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
