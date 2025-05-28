import { create } from "zustand";
import useAuthStore from "./useAuthStore";
import useErrorsStore from "./useErrorsStore";

const useApplicantStore = create((set) => ({
    applicant: {
        name: "",
        contacts: {
            email: "",
            phone: ""
        }
    },

    fetchApplicantProfile: async () => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()

        try {
            const response = await fetch('http://localhost:3000/api/applicant/profile', {
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
            console.log(result.data[0].user);

            // set((state) => ({
            //     applicant: { ...state.applicant, ...result.data[0].user } // ✅ Обновляем состояние правильно
            // }));
            //set({ applicant: { name: result.data.name, contacts: result.data.contacts } });
            set(() => ({
                applicant: { ...result.data[0].user }
            }));

        } catch {
            setError('Ошибка соединения с сервером')
            return null
        }
    },
    clearProfile: async () => {
        set({
            applicant: {
                name: "",
                contacts: {
                    email: "",
                    phone: ""
                }
            }
        })
    },
    // updateApplicant: async (newUserData, setIsEditing) => {
    updateApplicant: async (newUserData) => {
        const { token } = useAuthStore.getState()
        const { setError, clearError } = useErrorsStore.getState()
        clearError()

        try {
            const response = await fetch('http://localhost:3000/api/applicant/profile', {
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

            localStorage.setItem("user", JSON.stringify(result.data));
            console.log(result.data);

            set({ applicant: result.data });
            //setIsEditing(false); // **Выход из режима редактирования только при успешном обновлении**
        } catch {
            setError('Ошибка соединения с сервером');
        }
    },
}))

export default useApplicantStore