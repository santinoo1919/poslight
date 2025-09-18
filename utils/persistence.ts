import AsyncStorage from "@react-native-async-storage/async-storage";

// Simple persistence utility to reduce verbosity
export const createPersistStorage = (name: string) => ({
  getItem: async () => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (value: any) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async () => {
    await AsyncStorage.removeItem(name);
  },
});

// Simple hook for manual persistence
export const usePersistence = (key: string) => {
  const save = async (data: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  };

  const load = async () => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  const clear = async () => {
    await AsyncStorage.removeItem(key);
  };

  return { save, load, clear };
};
