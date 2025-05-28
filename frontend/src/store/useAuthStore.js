import { create } from "zustand";
import useErrorsStore from "./useErrorsStore";
import useEmployerStore from "./useEmployerStore";


const useAuthStore = create((set) => ({
  token: JSON.parse(localStorage.getItem("token")) || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  role: JSON.parse(localStorage.getItem("role")) || null,
  isLoading: true,
  profile: null,

  checkAuth: async () => { // ✅ Проверка авторизации при запуске
    try {
      set({ isLoading: true });

      const { token } = useAuthStore.getState()
      if (!token) {
        set({ user: null, isLoading: false }); // ✅ Завершаем загрузку, если токена нет
        return;
      }
      const response = await fetch("http://localhost:3000/api/guest/auth/check",
        {
          headers: {
            Authorization: token
          },
          method: "GET"
        });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.data));
        //localStorage.setItem("role", JSON.stringify(result.data.role));
        set({ isLoading: false });
        //set({ user: result.data, isLoading: false });
      } else {
        set({ user: null, isLoading: false, role: null });
      }
    } catch {
      console.error("Ошибка авторизации");
      set({ user: null, isLoading: false, role: null });
    }
  },
  register: async (userData) => {
    const { setError, clearError } = useErrorsStore.getState()
    const { login } = useAuthStore.getState()

    clearError()
    try {
      const response = await fetch('http://localhost:3000/api/guest/register', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData
          // user: {
          //   password,
          //   name,
          //   role,
          //   contacts: { email }
          // }
        })
      })
      const body = await response.json()

      if (!body.success) {
        setError(body.message || 'Ошибка регистрации')
        return
      }

      delete body.success
      delete body.message
      login({
        email: userData.contacts.email,
        password: userData.password
      })
    } catch (err) {
      console.log('error: ', err.message);
    }
  },
  login: async (userData) => {
    const { setError, clearError } = useErrorsStore.getState()
    const { fetchEmployerProfile } = useEmployerStore.getState()

    clearError()
    // curl -X POST http://backend:3000/api/guest/login -H "Content-Type: application/json" -d '{"email": "vanya@gmail.com", "password": "123"}'

    const response = await fetch(`http://localhost:3000/api/guest/login`,
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      },
    )
    const body = await response.json()

    if (!body.success) {
      setError(body.message || 'ошибка авторизации')
      return
    }
    let userProfile

    if (body.data.role === 'employer') {
      // const res = await fetch('http://localhost:3000/api/employer/profile',
      //   {
      //     headers: { Authorization: body.token }
      //   }
      // )
      // const result = await res.json()

      // if (result.success) {
      //   //userProfile = result.data
      //   //userProfile.role = 'employer'
      // }
      userProfile = body.data
    } else {
      userProfile = body.data
    }

    delete body.message
    delete body.success

    localStorage.setItem("token", JSON.stringify(body.token));
    localStorage.setItem("user", JSON.stringify(userProfile));
    localStorage.setItem("role", JSON.stringify(body.data.role));

    console.log(userProfile);
    set({ token: body.token, user: userProfile, role: body.data.role });

    if (body.data.role === 'employer') {
      await fetchEmployerProfile()
    }
  },
  logout: () => {
    const { clearError } = useErrorsStore.getState()

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null })
    clearError()
  },
  updateApplicant: async (newUserData, setIsEditing) => {
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

      set({ user: result.data });
      setIsEditing(false); // **Выход из режима редактирования только при успешном обновлении**
    } catch {
      setError('Ошибка соединения с сервером');
    }
  },
  updateEmployer: async (newUserData, setIsEditing) => {
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
      localStorage.setItem("user", JSON.stringify(result.data));

      set({ user: result.data });
      setIsEditing(false); // **Выход из режима редактирования только при успешном обновлении**
    } catch {
      setError('Ошибка соединения с сервером');
    }
  },
  sendJoinCompanyRequest: async (requestData) => {
    const { token, user } = useAuthStore.getState()
    const { setError, clearError } = useErrorsStore.getState()
    clearError()

    if (user.role != 'employer') {
      setError('Только для работодателей')
    }

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

      // result.data.role = 'employer'
      // localStorage.setItem("user", JSON.stringify(result.data));
      // set({ user: result.data });
      // console.log(user);

      return result.success;
    } catch {
      setError('Ошибка соединения с сервером');
      return false
    }
  },
  cancelJoinCompanyRequest: async (company_regnum) => {
    const { token, user } = useAuthStore.getState()
    const { setError, clearError } = useErrorsStore.getState()
    clearError()

    if (user.role != 'employer') {
      setError('Только для работодателей')
    }

    try {
      const response = await fetch('http://localhost:3000/api/employer/joincompanyrequest', {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ company_regnum })
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Ошибка отправки запроса');
        return result.success;
      }

      // result.data.role = 'employer'
      // localStorage.setItem("user", JSON.stringify(result.data));
      // set({ user: result.data });
      // console.log(user);

      return result.success
    } catch {
      setError('Ошибка соединения с сервером');
      return false
    }
  },
  getEmployerProfile: async () => {
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
        return null;
      }



      return result.data
    } catch {
      setError('Ошибка соединения с сервером')
      return null
    }
  },
  getApplicantProfile: async () => {
    set({ isLoading: true });
    const { token } = useAuthStore.getState()
    const { setError, clearError } = useErrorsStore.getState()
    clearError()

    try {
      if (!token) {
        set({ user: null, isLoading: false }); // ✅ Завершаем загрузку, если токена нет
        return;
      }

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
        return null;
      }

      set({ profile: result.data })
      set({ isLoading: false });
      return result.data
    } catch {
      setError('Ошибка соединения с сервером')
      return null
    }
  },
  leaveCompany: async () => {
    const { token } = useAuthStore.getState()
    const { setError, clearError } = useErrorsStore.getState()
    clearError()

    try {
      const response = await fetch('http://localhost:3000/api/employer/leavecompany', {
        method: 'PUT',
        headers: {
          Authorization: token
        },
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Ошибка выхода из компании');
        return false;
      }

      return true
    } catch {
      setError('Ошибка соединения с сервером')
      return false
    }

  }
}));

export default useAuthStore;
