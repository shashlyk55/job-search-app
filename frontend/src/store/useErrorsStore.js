import { create } from "zustand";

const useErrorsStore = create((set) => ({
    error: null,
    setError: (message) => set({ error: message }),
    clearError: () => set({ error: null }),
}));

export default useErrorsStore;