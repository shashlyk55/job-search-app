import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css'
import useAuthStore from "../../store/useAuthStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import loginValidationSchema from "../../validate/loginValidationSchema";


const LoginPage = () => {    
    const {token, user, login} = useAuthStore()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm({
        resolver: yupResolver(loginValidationSchema),
    });

    useEffect(() => {
        if (token) {
           navigate("/", { replace: true });
        }
    }, [token, user, navigate]);

    const handleLogin = async () => {  
        clearErrors()
        login({ email, password })
    }

    return (
        <div id="login_div">
            <h3>Вход</h3>
            <span>
                <label>Email</label>
                <input 
                {...register("email")}
                type="email" 
                aria-label="Email" 
                onChange={(e) => setEmail(e.target.value)}/>
                {errors.email && <p className="err-text">{errors.email.message}</p>}            
            </span>
            <span>
                <label>Пароль</label>
                <input 
                {...register("password")}
                type="password" 
                aria-label="Password" 
                onChange={(e) => setPassword(e.target.value)}/>
                {errors.password && <p className="err-text">{errors.password.message}</p>}
            </span>
            <button onClick={handleSubmit(handleLogin)}>Вход</button>
            <a href="/register">Нет аккаунта?</a>
        </div>
    )
}

export default LoginPage


