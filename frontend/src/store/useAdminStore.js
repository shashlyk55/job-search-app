import { create } from "zustand";
import useAuthStore from "./useAuthStore";
import useErrorsStore from "./useErrorsStore";
import useEmployerStore from "./useEmployerStore";

const useAdminStore = create((set) => ({
    users: [],
    vacancies: [],
    industries: [],
    joinRequests: [],

    fetchUsers: async () => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()

        clearError()
        try {
            const response = await fetch("http://localhost:3000/api/admin/user",
                {
                    method: 'GET',
                    headers: { Authorization: token }
                }
            );
            const result = await response.json();

            if (result.success) {
                set({ users: result.data });
            } else {
                setError(result.message || 'ошибка получения пользователей')
                set([]);
            }

        } catch (err) {
            console.error("ошибка загрузки пользователей: ", err.message);
            //setError("ошибка загрузки пользователей: ", err.message);
        }
    },

    deleteUser: async (userId) => {
        const { setError, clearError } = useErrorsStore.getState()
        const { token } = useAuthStore.getState()

        clearError()
        try {
            const response = await fetch(`http://localhost:3000/api/admin/user/${userId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: token }
                }
            );

            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    users: state.users.filter((user) => user._id !== result.data._id),
                }));
            } else {
                setError(result.message || 'ошибка удаления пользователя')
            }

        } catch (err) {
            console.error("ошибка удаления пользователя: ", err.message);
            //setError("ошибка удаления пользователя: ", err.message);
        }
    },

    fetchVacancies: async () => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()
        try {
            const response = await fetch("http://localhost:3000/api/admin/vacancy",
                {
                    method: "GET",
                    headers: { Authorization: token }
                }
            );
            const result = await response.json();
            if (result.success) {
                set({ vacancies: result.data });
            } else {
                setError(result.message || 'ошибка загрузки вакансий')
                set([]);
            }


        } catch (err) {
            console.error("ошибка загрузки вакансий: ", err.message);
            //setError("ошибка загрузки вакансий: ", err.message);
        }

    },

    deleteVacancy: async (vacancyId) => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()

        try {
            const response = await fetch(`http://localhost:3000/api/admin/vacancy/${vacancyId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: token }
                }
            );

            const result = await response.json()

            if (result.success) {
                set((state) => ({
                    vacancies: state.vacancies.filter((vacancy) => vacancy._id !== result.data),
                }));

            } else {
                setError(result.message || 'ошибка удаления вакансии')
            }

        } catch (err) {
            console.error("ошибка удаления вакансии: ", err.message);
            //setError("ошибка удаления вакансии: ", err.message);
        }
    },
    updateVacancy: async (updatedVacancy, vacancyId) => {
        const { setError, clearError } = useErrorsStore.getState()
        const { token } = useAuthStore.getState()

        clearError()
        try {
            const response = await fetch(`http://localhost:3000/api/admin/vacancy/${vacancyId}`, {
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
    },

    fetchIndustries: async () => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()

        try {
            const response = await fetch("http://localhost:3000/api/admin/industry",
                {
                    method: 'GET',
                    headers: { Authorization: token }
                }
            );
            const result = await response.json();
            if (result.success) {
                set({ industries: result.data });
            } else {
                setError(result.message || 'ошибка получения отраслей')
                set([]);
            }
        } catch (err) {
            console.error("ошибка получения отраслей: ", err.message);
            //setError("ошибка получения отраслей: ", err.message);
        }
    },

    createIndustry: async (industryType) => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()

        try {
            const response = await fetch("http://localhost:3000/api/admin/industry", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: token },
                body: JSON.stringify({ industry: industryType }),
            });

            const result = await response.json();

            if (result.success) {
                set((state) => ({ industries: [...state.industries, result.data] }));
            } else {
                setError(result.message || 'ошибка создания отрасли')
            }

        } catch (err) {
            console.error("ошибка создания отрасли: ", err.message);
        }
    },

    deleteIndustry: async (industryId) => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()

        try {
            const response = await fetch(`http://localhost:3000/api/admin/industry/${industryId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: token }
                }
            );
            const result = await response.json()

            if (result.success) {
                set((state) => ({
                    industries: state.industries.filter((industry) => industry._id !== result.data),
                }));
            } else {
                setError(result.message || 'ошибка удаления отрасли')
            }

        } catch (err) {
            console.error("ошибка удаления отрасли: ", err.message);
        }
    },

    fetchJoinRequests: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
            const response = await fetch("http://localhost:3000/api/admin/joincompanyrequest", {
                headers: { Authorization: token },
            });
            const result = await response.json();

            if (result.success) {
                set({ joinRequests: result.data });
            } else {
                console.error("Ошибка загрузки запросов:", result.message);
            }
        } catch {
            console.error("Ошибка соединения с сервером");
        }
    },

    approveJoinRequest: async (requestId) => {
        const { token } = useAuthStore.getState();
        const { addEmployerCompany } = useEmployerStore.getState()
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/api/admin/joincompanyrequest/${requestId}/approve`, {
                method: "PUT",
                headers: { Authorization: token },
            });

            const result = await response.json();

            if (result.success) {
                set((state) => ({
                    joinRequests: state.joinRequests.filter(request => request._id !== requestId),
                }));

                addEmployerCompany(result.data)
            } else {
                console.error("Ошибка одобрения запроса:", result.message);
            }
        } catch {
            console.error("Ошибка соединения с сервером");
        }
    },

    rejectJoinRequest: async (requestId) => {
        const { token } = useAuthStore.getState();
        const { addEmployerCompany } = useEmployerStore.getState()
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/api/admin/joincompanyrequest/${requestId}/reject`, {
                method: "PUT",
                headers: { Authorization: token },
            });

            const result = await response.json();

            if (result.success) {
                set((state) => ({
                    joinRequests: state.joinRequests.filter(request => request._id !== requestId),
                }));

                addEmployerCompany(null)
            } else {
                console.error("Ошибка отклонения запроса:", result.message);
            }
        } catch {
            console.error("Ошибка соединения с сервером");
        }
    },



}));

export default useAdminStore;
