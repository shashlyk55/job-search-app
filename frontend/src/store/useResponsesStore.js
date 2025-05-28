import { create } from "zustand";
import useAuthStore from "./useAuthStore";

const useResponsesStore = create((set) => ({
    responses: [],

    fetchRespondVacancies: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
            const response = await fetch("http://localhost:3000/api/applicant/responsedvacancies", {
                headers: { Authorization: token },
            });
            const result = await response.json();

            if (result.success) {
                console.log(result.data);

                set({ responses: result.data });
            } else {
                console.error("Ошибка загрузки откликов:", result.message);
            }
        } catch {
            console.error("Ошибка соединения с сервером");
        }
    },

    responseToVacancy: async (reposnseData) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
            const response = await fetch("http://localhost:3000/api/applicant/response", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: token },
                body: JSON.stringify({ response: reposnseData }),
            });

            const result = await response.json();

            if (result.success) {
                set((state) => ({ responses: [...state.responses, result.data] }));
                return true;
            } else {
                console.error("Ошибка отклика:", result.message);
                return false;
            }
        } catch {
            console.error("Ошибка соединения с сервером");
            return false;
        }
    },

    deleteResponse: async (responseId) => {
        const { token } = useAuthStore.getState();

        try {
            const response = await fetch(`http://localhost:3000/api/applicant/response/${responseId}`, {
                method: "DELETE",
                headers: { Authorization: token },
            });

            const result = await response.json();

            if (!result.success) {
                alert("Ошибка при удалении отклика: " + result.message);
                return;
            }

            set((state) => ({
                responses: state.responses.filter((res) => res._id !== responseId), // ✅ Удаляем отклик из списка
            }));

            alert("Отклик успешно отменён!");
        } catch {
            alert("Ошибка соединения с сервером!");
        }
    },
    fetchResponsesForVacancy: async (vacancyId) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/api/employer/response/${vacancyId}`, {
                headers: { Authorization: token },
            });
            const result = await response.json();

            if (result.success) {
                console.log(result.data);

                set({ responses: result.data });
            } else {
                console.error("Ошибка загрузки откликов:", result.message);
            }
        } catch {
            console.error("Ошибка соединения с сервером");
        }
    },
    approveResponse: async (responseId, message) => {
        const { token } = useAuthStore.getState();
        try {
            const response = await fetch(`http://localhost:3000/api/employer/response/${responseId}/approve`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: token },
                body: JSON.stringify({ message })
            });

            const result = await response.json();

            if (!result.success) {
                alert("Ошибка одобрения отклика: " + result.message);
                return;
            }

            set((state) => ({
                responses: state.responses.map((res) =>
                    res._id === responseId ? { ...res, is_approved: true, employer_pinned_message: result.data.employer_pinned_message } : res
                ),
            }));
        } catch {
            console.error("Ошибка соединения с сервером");
        }
    },
    rejectResponse: async (responseId, message) => {
        const { token } = useAuthStore.getState();
        try {
            const response = await fetch(`http://localhost:3000/api/employer/response/${responseId}/reject`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: token },
                body: JSON.stringify({ message })
            });

            const result = await response.json();

            if (!result.success) {
                alert("Ошибка отклонения отклика: " + result.message);
                return;
            }

            set((state) => ({
                responses: state.responses.map((res) =>
                    res._id === responseId ? { ...res, is_approved: true, employer_pinned_message: result.data.employer_pinned_message } : res
                ),
            }));
        } catch {
            console.error("Ошибка соединения с сервером");
        }
    }

}));

export default useResponsesStore;
