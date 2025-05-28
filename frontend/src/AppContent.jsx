import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import './App.css'
import Register from "./pages/RegisterPage/RegisterPage";
import Login from "./pages/LoginPage/LoginPage";
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import VacancyPage from "./pages/VacancyPage/VacancyPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import UserResponsesPage from "./pages/UserResponsesPage/UserResponsesPage";
import CompanyVacanciesPage from "./pages/CompanyVacanciesPage/CompanyVacanciesPage";
import CompanyResponsesPage from "./pages/CompanyResponsesPage/CompanyResponsesPage";
import NavBar from './components/NavBar/NavBar'
import Vacancies from "./pages/VacanciesPage/Vacancies";
import AdminUsersPage from "./pages/Admin/AdminUsersPage/AdminUsersPage";
import AdminIndustriesPage from "./pages/Admin/AdminIndustriesPage/AdminIndustriesPage";
import AdminVacanciesPage from "./pages/Admin/AdminVacanciesPage/AdminVacanciesPage";
import JoinCompanyRequestsPage from "./pages/Admin/JoinCompanyRequestsPage/JoinCompanyRequestsPage";
import ErrorNotification from './components/ErrorNotification/ErrorNotification'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'

const AppContent = () => {
  
  const location = useLocation(); // ✅ Получаем текущий путь

  // ✅ Проверяем, нужно ли скрыть NavBar
  const hideNavBar = ["/login", "/register", "/404"].includes(location.pathname);

  return (
    <>
      <ErrorNotification />
      {/* <Router> */}
        {!hideNavBar && <NavBar />}
        <div id="router_div">
          <Routes>
            <Route path="/" element={<ProtectedRoute element={<HomePage/>}/>}/>               
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/vacancies" element={<ProtectedRoute element={<Vacancies/>}/>}/>   
            <Route path="/vacancy/:id" element={<ProtectedRoute element={<VacancyPage/>}/>}/>
            <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />}/>}/>
            <Route path="/responsedvacancies" element={<ProtectedRoute element={<UserResponsesPage />}/>} /> 
            <Route path="/company/vacancies" element={<ProtectedRoute element={<CompanyVacanciesPage/>}/>}></Route>
            <Route path="/vacancies/:id/responses" element={<ProtectedRoute element={<CompanyResponsesPage />}/>}/>
            <Route path="/admin/users" element={<ProtectedRoute adminOnly={true} element={<AdminUsersPage />}/>}/>
            <Route path="/admin/industries" element={<ProtectedRoute adminOnly={true} element={<AdminIndustriesPage/>}/>}/>
            <Route path="/admin/vacancies" element={<ProtectedRoute adminOnly={true} element={<AdminVacanciesPage/>}/>}/>
            <Route path="/admin/joincompanyrequests" element={<ProtectedRoute adminOnly={true} element={<JoinCompanyRequestsPage/>}/>}/>
            <Route path="*" element={<Navigate to="/404" replace />} /> {/* ✅ Перенаправление на `/404` */}
            <Route path="/404" element={<NotFoundPage />} />
          </Routes>
        </div>
      {/* </Router> */}
    </>
  );
};

export default AppContent;