import { create } from "zustand";
import { useFaceId, checkFaceIdAvailability } from "../utils/faceIdAuth";
import { usePersistence } from "../utils/persistence";

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
  loadAuth: () => Promise<void>;
  clearError: () => void;
}

// Predefined users for POS system
const defaultUsers: User[] = [
  { id: "owner", name: "Store Owner", role: "owner" },
  { id: "cashier1", name: "Cashier 1", role: "cashier" },
  { id: "cashier2", name: "Cashier 2", role: "cashier" },
  { id: "manager", name: "Manager", role: "manager" },
];

export const useAuthStore = create<AuthState>((set, get) => {
  const persistence = usePersistence("auth-store");

  return {
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

        // On native: use biometric auth
        // On web: skip biometric and unlock directly
        const result = await useFaceId();

        if (result.success) {
          // Set default user when unlocking
          const defaultUser = defaultUsers[0]; // Use first user as default
          const newState = {
            isUnlocked: true,
            currentUser: defaultUser,
            error: null,
          };
          set(newState);
          // Persist the unlocked state
          persistence.save(newState);
        } else {
          set({ error: result.error || "Authentication failed" });
        }
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Authentication failed",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    lock: () => {
      const newState = { isUnlocked: false, currentUser: null };
      set(newState);
      // Persist the locked state
      persistence.save(newState);
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

    loadAuth: async () => {
      const persisted = await persistence.load();
      if (persisted) {
        set(persisted);
      }
    },

    clearError: () => set({ error: null }),
  };
});
