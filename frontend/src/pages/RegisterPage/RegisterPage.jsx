import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './RegisterPage.css'
import useAuthStore from "../../store/useAuthStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import registerValidationSchema from "../../validate/registerValidationSchema";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("applicant")
    const navigate = useNavigate();
    const {user, register: doRegister } = useAuthStore()

    const { register: validRegister , handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerValidationSchema),
    });

    useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    const handleRegister = async () => {
        const userData = {
            password,
            name,
            role,
            contacts: { email }
        }
        doRegister(userData)
        // clearError()
        // try{
        //     const response = await fetch('http://localhost:3000/api/guest/register',{
        //         method: 'POST',
        //         headers: {"Content-Type": "application/json"},
        //         body: JSON.stringify({
        //             user: {
        //                 password,
        //                 name,
        //                 role,
        //                 contacts: { email }
        //             }
        //         })
        //     })
        //     const body = await response.json()

        //     if(!body.success) {
        //         setError(body.message || 'Ошибка регистрации')
        //         return 
        //     }
            
        //     delete body.success
        //     delete body.message
            
        //     login({email, password})
        // } catch(err){
        //     console.log('error: ', err.message);
        // }
    }


    return (
        <div id="register_div">
            <h3>Регистрация</h3>
            <span>
                <label>Имя</label>
                <input 
                {...validRegister("name")}
                type="text" 
                onChange={(e) => setName(e.target.value)}/>
                {errors.name && <p className="err-text">{errors.name.message}</p>}            
            </span>
            <span>
                <label>Email</label>
                <input 
                {...validRegister("email")}
                type="email" 
                onChange={(e) => setEmail(e.target.value)}/>
                {errors.email && <p className="err-text">{errors.email.message}</p>}            
            </span>
            <span>
                <label>Пароль</label>
                <input 
                {...validRegister("password")}
                type="password" 
                onChange={(e) => setPassword(e.target.value)}/>
                {errors.password && <p className="err-text">{errors.password.message}</p>}            
            </span>
            <div id="roles_div">
                <span>
                    <label>Соискатель</label>
                    <input type="radio" value="applicant" checked={role === 'applicant'} radioGroup="role" onChange={() => setRole('applicant')}/>
                </span>
                <span>
                    <label>Работодатель</label>
                    <input type="radio" value="employer" checked={role === 'employer'} radioGroup="role" onChange={() => setRole('employer')}/>
                </span>
            </div>
            <button onClick={handleSubmit(handleRegister)}>Регистрация</button>
            <a href="/login">Уже есть аккаунт?</a>
        </div>
    )
}

export default Register









