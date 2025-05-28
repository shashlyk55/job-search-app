import React, { useState } from "react";
import Login from "../../pages/LoginPage/LoginPage";
import Register from "../../pages/RegisterPage/RegisterPage";
import './AuthForm.css'

const AuthForm = ({ setIsAuthenticated }) => {
    const [currentForm, setForm] = useState('register')

  return (
    <div>
        <div id="nav_btns">
            <span className={currentForm == 'login' ? "bg-blue-600 text-white" : "text-blue-600 bg-transparent"} >
                <label>Вход</label>
                <input 
                type="radio" 
                value="login" 
                checked={currentForm === 'login'} 
                radioGroup="form" 
                onChange={() => setForm('login')}/>
            </span>
            <span className={currentForm == 'register' ? "bg-blue-600 text-white" : "text-blue-600 bg-transparent"}>
                <label>Регистрация</label>
                <input 
                type="radio" 
                value="register" 
                checked={currentForm === 'register'} 
                radioGroup="form" 
                onChange={() => setForm('register')}/>
            </span>
        </div>

        <div id="auth_container">
            {currentForm === 'login' 
            ? 
            <Login setIsAuthenticated={setIsAuthenticated}/> 
            : 
            <Register setIsAuthenticated={setIsAuthenticated}/>}
        </div>
    </div>
  );
};

export default AuthForm;