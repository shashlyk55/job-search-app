import { create } from "zustand";
import useErrorStore from './useErrorsStore'
import useAuthStore from "./useAuthStore";

const useVacanciesStore = create((set) => ({
    vacancies: [],
    filters: {
        vacancy: "",
        min_salary: "",
        industry: "",
        company: "",
        max_experience: "",
        sort: ""
    },
    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),
    fetchVacancies: async () => {
        const { filters } = useVacanciesStore.getState()
        const queryParams = new URLSearchParams(filters).toString()
        const { setError, clearError } = useErrorStore.getState()
        const { token } = useAuthStore.getState()

        clearError()
        try {
            const response = await fetch(`http://localhost:3000/api/applicant/vacancy?${queryParams}`,
                {
                    method: 'GET',
                    headers: { Authorization: token }
                }
            );
            const data = await response.json();

            if (data.success) {
                set({ vacancies: data.data });
            } else {
                setError(data.message || 'ошибка получения вакансий')
                set([]);
            }
        } catch (err) {
            console.error("ошибка загрузки вакансий: ", err.message);
        }
    },
    fetchCompanyVacancies: async () => {
        const { setError, clearError } = useErrorStore.getState()
        const { token } = useAuthStore.getState()

        clearError()
        try {
            const response = await fetch(`http://localhost:3000/api/employer/vacancy/company`,
                {
                    method: 'GET',
                    headers: { Authorization: token }
                }
            );
            const result = await response.json();

            if (result.success) {
                set({ vacancies: result.data });
            } else {
                setError(result.message || 'ошибка получения вакансий')
                set([]);
            }
        } catch (err) {
            console.error("ошибка загрузки вакансий: ", err.message);
        }
    },
    addVacancy: async (newVacancy) => {
        const { setError, clearError } = useErrorStore.getState()
        const { token } = useAuthStore.getState()

        clearError()
        try {
            const response = await fetch(`http://localhost:3000/api/employer/vacancy`,
                {
                    method: 'POST',
                    headers: { Authorization: token, "Content-Type": "application/json" },
                    body: JSON.stringify({ vacancy: newVacancy })
                }
            );
            const result = await response.json();

            if (result.success) {
                set((state) => ({ vacancies: [...state.vacancies, result.data] }));
            } else {
                setError(result.message || 'ошибка получения вакансий')
                set([]);
            }
        } catch (err) {
            console.error("ошибка загрузки вакансий: ", err.message);
        }
    },
    deleteVacancy: async (vacancyId) => {
        const { setError, clearError } = useErrorStore.getState()
        const { token } = useAuthStore.getState()

        clearError()
        try {
            const response = await fetch(`http://localhost:3000/api/employer/vacancy/${vacancyId}`, {
                method: 'DELETE',
                headers: { Authorization: token }
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Не удалось удалить резюме');
                return;
            }

            const deletedId = result.data || vacancyId;

            set((state) => ({
                vacancies: state.vacancies.filter((vacancy) => vacancy._id !== deletedId),
            }));
        } catch {
            setError('Ошибка соединения с сервером');
        }
    },
    updateVacancy: async (updatedVacancy, vacancyId) => {
        const { setError, clearError } = useErrorStore.getState()
        const { token } = useAuthStore.getState()

        clearError()
        try {
            const response = await fetch(`http://localhost:3000/api/employer/vacancy/${vacancyId}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json", Authorization: token },
                body: JSON.stringify({ vacancy: updatedVacancy })
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Не удалось обновить резюме');
                return;
            }

            set((state) => {
                const updatedVacancies = state.vacancies.map((vacancy) =>
                    vacancy._id === vacancyId ? result.data : vacancy
                );
                return { vacancies: updatedVacancies };
            });
        } catch {
            setError('Ошибка соединения с сервером');
        }
    }
}));

export default useVacanciesStore;
