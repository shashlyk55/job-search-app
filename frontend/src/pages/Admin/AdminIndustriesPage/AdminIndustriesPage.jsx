import { useEffect, useState } from "react";
import useAdminStore from "../../../store/useAdminStore";
import "./AdminIndustriesPage.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import industryValidationSchema from "../../../validate/industryValidationSchema";

const AdminIndustriesPage = () => {
    const { industries, fetchIndustries, createIndustry, deleteIndustry } = useAdminStore();
    const [newIndustry, setNewIndustry] = useState("");

    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm({
        resolver: yupResolver(industryValidationSchema),
    });

    useEffect(() => {
        fetchIndustries();
    }, [fetchIndustries]);

    const handleCreate = () => {
        if (newIndustry.trim()) {
            clearErrors()
            createIndustry(newIndustry);
            setNewIndustry("");
        } 
    };

    return (
        <div className="admin-industries">
            <h2>Отрасли</h2>

            {/* 🔹 Форма добавления отрасли */}
            <div className="industry-form">
                <input 
                {...register("name")}
                    type="text" 
                    placeholder="Название отрасли" 
                    value={newIndustry} 
                    onChange={(e) => setNewIndustry(e.target.value)} 
                />
                {errors.name && <p className="err-text">{errors.name.message}</p>}       
                <button onClick={handleSubmit(handleCreate)}>Добавить</button>
            </div>

            {/* 🔹 Список отраслей */}
            <div className="industries-list">
                {industries.map((industry) => (
                    <div key={industry._id} className="industry-card">
                        <p><strong>Отрасль:</strong> {industry.industry_type}</p>
                        <button className="delete-button" onClick={() => deleteIndustry(industry._id)}>Удалить</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminIndustriesPage;
