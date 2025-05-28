import { create } from "zustand";
import useErrorsStore from "./useErrorsStore";
import useAuthStore from "./useAuthStore";

const useResumeStore = create((set) => ({
    resumes: [],

    fetchResumes: async () => {
        const { token } = useAuthStore.getState();
        const { setError, clearError } = useErrorsStore.getState();

        clearError();

        try {
            const response = await fetch('http://localhost:3000/api/applicant/resume', {
                method: 'GET',
                headers: { Authorization: token }
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Не удалось загрузить список резюме');
                return;
            }
            set({ resumes: result.data });
        } catch {
            setError('Ошибка соединения с сервером');
        }
    },

    addResume: async (resume) => {
        const { token } = useAuthStore.getState();
        const { setError, clearError } = useErrorsStore.getState();

        clearError();

        try {
            const response = await fetch('http://localhost:3000/api/applicant/resume', {
                method: 'POST',
                headers: { "Content-Type": "application/json", Authorization: token },
                body: JSON.stringify({ resume: resume })
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Не удалось создать резюме');
                return;
            }

            set((state) => ({ resumes: [...state.resumes, result.data] }));
        } catch {
            setError('Ошибка соединения с сервером');
        }
    },

    editResume: async (updatedResume, resumeId) => {
        const { token } = useAuthStore.getState();
        const { setError, clearError } = useErrorsStore.getState();

        clearError();

        try {
            const response = await fetch(`http://localhost:3000/api/applicant/resume/${resumeId}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json", Authorization: token },
                body: JSON.stringify({ resume: updatedResume })
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Не удалось обновить резюме');
                return;
            }

            set((state) => {
                const updatedResumes = state.resumes.map((resume) =>
                    resume._id === resumeId ? result.data : resume
                );
                return { resumes: updatedResumes };
            });
        } catch {
            setError('Ошибка соединения с сервером');
        }
    },

    deleteResume: async (resumeId) => {
        const { token } = useAuthStore.getState();
        const { setError, clearError } = useErrorsStore.getState();

        clearError();

        try {
            const response = await fetch(`http://localhost:3000/api/applicant/resume/${resumeId}`, {
                method: 'DELETE',
                headers: { Authorization: token }
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Не удалось удалить резюме');
                return;
            }

            const deletedId = result.data || resumeId;

            set((state) => ({
                resumes: state.resumes.filter((resume) => resume._id !== deletedId),
            }));
        } catch {
            setError('Ошибка соединения с сервером');
        }
    },
}));

export default useResumeStore;
