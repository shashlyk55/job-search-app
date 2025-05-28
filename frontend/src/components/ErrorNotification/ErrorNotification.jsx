import { useEffect } from "react";
import "./ErrorNotification.css";
import useErrorsStore from "../../store/useErrorsStore";

const ErrorNotification = () => {
    const { error, clearError } = useErrorsStore();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError(); // ✅ Очищаем ошибку через 4 секунды
            }, 4000);
            return () => clearTimeout(timer); // ✅ Очищаем таймер при размонтировании
        }
    }, [error, clearError]);

    if (!error) return null; // ✅ Если ошибки нет, компонент не рендерится

    return (
        <div className="error-notification">
            <p>{error}</p>
            <button className="close-button" onClick={clearError}>✖</button> {/* ✅ Кнопка `X` для ручного закрытия */}
        </div>
    );
};

export default ErrorNotification;
