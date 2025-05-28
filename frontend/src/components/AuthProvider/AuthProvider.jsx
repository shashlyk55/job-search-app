import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // ✅ Добавляем состояние загрузки

    useEffect(() => {
        console.log('context');
        
        const fetchUser = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("token"))
                console.log(token);
                
                const response = await fetch("http://localhost:3000/api/guest/auth/check", {
                    method: "GET",
                    headers: { Authorization: token },
                });
                const result = await response.json();
                if (result.success) {
                    setUser(result.data);
                }
            } catch {
                console.error("Ошибка авторизации");
            } finally {
                setIsLoading(false); // ✅ Завершаем загрузку
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
