import { create } from "zustand";
import useErrorsStore from "./useErrorsStore";
import useAuthStore from './useAuthStore'


const useEmployerStore = create((set) => ({
    employer: {
        user: {
            name: "",
            contacts: {
                email: "",
                phone: ""
            }
        },
        company: null,
        // {
        //     boss_contacts: {
        //         email: "",
        //         phone: ""
        //     },
        //     company_regnum: ""
        // },
        requested_company: null
    },

    fetchEmployerProfile: async () => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()

        try {
            const response = await fetch('http://localhost:3000/api/employer/profile', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Ошибка отправки запроса');
                return;
            }
            console.log(result.data);

            set(() => ({
                employer: { ...result.data }
            }));
            // set({ employer: result.data })

        } catch {
            setError('Ошибка соединения с сервером')
            return null
        }
    },
    clearProfile: async () => {
        set({ employer: {} })
    },
    // updateEmployer: async (newUserData, setIsEditing) => {
    updateEmployer: async (newUserData) => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()
        try {
            const response = await fetch('http://localhost:3000/api/employer/profile', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({ profile: newUserData })
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Не удалось обновить профиль');
                return;
            }
            result.data.role = 'employer'

            console.log('from server after update', result.data);


            // set({ employer: result.data });
            set({ employer: { ...result.data } });
            //setIsEditing(false); // **Выход из режима редактирования только при успешном обновлении**
        } catch {
            setError('Ошибка соединения с сервером');
        }
    },
    sendJoinCompanyRequest: async (requestData) => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()

        try {
            const response = await fetch('http://localhost:3000/api/employer/joincompanyrequest', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({ request: requestData })
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Ошибка отправки запроса');
                return result.success;
            }

            return result.success;
        } catch {
            setError('Ошибка соединения с сервером');
            return false
        }
    },
    cancelJoinCompanyRequest: async () => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()

        try {
            const response = await fetch('http://localhost:3000/api/employer/joincompanyrequest', {
                method: 'DELETE',
                headers: { Authorization: token },
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || 'Ошибка отправки запроса');
                return result.success;
            }
            set({ employer: result.data })
            return result.success
        } catch {
            setError('Ошибка соединения с сервером');
            return false
        }
    },
    leaveCompany: async () => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()
        console.log('leave');

        try {
            //const response = await fetch('http://localhost:3000/api/employer/leavecompany', {
            await fetch('http://localhost:3000/api/employer/leavecompany', {
                method: 'PUT',
                headers: {
                    Authorization: token
                },
            });

            // const result = await response.json();
            // console.log(result);

            // if (!result.success) {
            //     setError(result.message || 'Ошибка выхода из компании');
            //     return false;
            // }
            set((state) => ({
                employer: state.employer ? { ...state.employer, company: null } : null,
            }));

            return true
        } catch {
            setError('Ошибка соединения с сервером')
            return false
        }

    },
    addEmployerCompany: async (company) => {
        set(state => ({
            employer: {
                ...state.employer,
                company: company
            }
        }));
    },

}))

export default useEmployerStore