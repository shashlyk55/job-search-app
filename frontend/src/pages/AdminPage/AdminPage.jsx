import { useState } from "react";
import AdminUsersPage from "./AdminUsersPage";
import AdminVacanciesPage from "./AdminVacanciesPage";
import AdminIndustriesPage from "./AdminIndustriesPage";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [tab, setTab] = useState("users");

    return (
        <div className="admin-dashboard">
            <h1>Панель управления</h1>

            <div className="admin-tabs">
                <button onClick={() => setTab("users")}>Пользователи</button>
                <button onClick={() => setTab("vacancies")}>Вакансии</button>
                <button onClick={() => setTab("industries")}>Отрасли</button>
            </div>

            <div className="admin-content">
                {tab === "users" && <AdminUsersPage />}
                {tab === "vacancies" && <AdminVacanciesPage />}
                {tab === "industries" && <AdminIndustriesPage />}
            </div>
        </div>
    );
};

export default AdminDashboard;
