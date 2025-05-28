// import React, { useEffect } from "react";
// import "./EditProfileModal.css";
// import useApplicantStore from "../../../store/useApplicantStore";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import profileValidationSchema from "../../../validate/profileValidationSchema";

// const EditProfileModal = ({ isOpen, onClose }) => {
//     const { updateApplicant, applicant } = useApplicantStore();

//     // ✅ Указываем `defaultValues`, но будем обновлять их через `reset()`
//     const { register, handleSubmit, formState: { errors }, reset, clearErrors } = useForm({
//         resolver: yupResolver(profileValidationSchema),
//         defaultValues: {
//             name: applicant.name,
//             contacts: {
//                 email: applicant.contacts?.email || '',
//                 phone: applicant.contacts?.phone || ''
//             }
//         },
//     });

//     // ✅ При каждом открытии форма заполняется актуальными данными из стора
//     useEffect(() => {
//         if (isOpen) {
//             reset(applicant); // ✅ Заполняем поля заново из Zustand
//         }
//     }, [isOpen, applicant, reset]);

//     if (!isOpen) return null; // ✅ Если `isOpen === false`, не рендерим модальное окно

//     const handleSave = async (data) => {
//         await updateApplicant(data); // ✅ Обновляем профиль
//         reset(data); // ✅ Обновляем форму новыми данными
//         onClose(); // ✅ Закрываем модальное окно
//     };

//     const handleClose = () => {
//         clearErrors();
//         reset(applicant); // ✅ Восстанавливаем начальные значения из Zustand
//         onClose();
//     };

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <h2>Редактирование профиля</h2>

//                 <form onSubmit={handleSubmit(handleSave)}>
//                     <label>Имя:</label>
//                     <input type="text" {...register("name")} />
//                     {errors.name && <p className="err-text">{errors.name.message}</p>}

//                     <label>Телефон:</label>
//                     <input type="text" {...register("contacts.phone")} />
//                     {errors.contacts?.phone && <p className="err-text">{errors.contacts.phone.message}</p>}

//                     <label>Email:</label>
//                     <input type="email" {...register("contacts.email")} />
//                     {errors.contacts?.email && <p className="err-text">{errors.contacts.email.message}</p>}

//                     {/* Кнопки управления */}
//                     <div className="modal-actions">
//                         <button className="save-button" type="submit">Сохранить</button>
//                         <button className="cancel-button" type="button" onClick={handleClose}>Отмена</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditProfileModal;
import React, { useEffect } from "react";
import "./EditProfileModal.css";
import useApplicantStore from "../../../store/useApplicantStore";
import useEmployerStore from "../../../store/useEmployerStore";
import useAuthStore from "../../../store/useAuthStore"; // ✅ Получаем роль пользователя
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import profileValidationSchema from "../../../validate/profileValidationSchema";

const EditProfileModal = ({ isOpen, onClose }) => {
    const { role } = useAuthStore(); // ✅ Получаем роль (applicant / employer)
    const applicantStore = useApplicantStore();
    const employerStore = useEmployerStore();

    // ✅ В зависимости от роли берём нужное хранилище
    const profileData = role === "applicant"
        ? applicantStore.applicant
        : employerStore.employer.user;

    const updateProfile = role === "applicant"
        ? applicantStore.updateApplicant
        : employerStore.updateEmployer;

    // ✅ Указываем `defaultValues`, но будем обновлять их через `reset()`
    const { register, handleSubmit, formState: { errors }, reset, clearErrors } = useForm({
        resolver: yupResolver(profileValidationSchema),
        defaultValues: {
            name: profileData?.name || "",
            contacts: {
                email: profileData?.contacts?.email || "",
                phone: profileData?.contacts?.phone || "",
            }
        },
    });

    // ✅ При каждом открытии форма заполняется актуальными данными из стора
    useEffect(() => {
        if (isOpen) {
            reset({
                name: profileData?.name || "",
                contacts: {
                    email: profileData?.contacts?.email || "",
                    phone: profileData?.contacts?.phone || "",
                }
            });
        }
    }, [isOpen, profileData, reset]);

    if (!isOpen) return null; // ✅ Если `isOpen === false`, не рендерим модальное окно

    const handleSave = async (data) => {
        await updateProfile(data);
        reset(data);
        onClose();
    };

    const handleClose = () => {
        clearErrors();
        reset(profileData);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Редактирование профиля ({role === "applicant" ? "Соискатель" : "Работодатель"})</h2>

                <form onSubmit={handleSubmit(handleSave)}>
                    <label>Имя:</label>
                    <input type="text" {...register("name")} />
                    {errors.name && <p className="err-text">{errors.name.message}</p>}

                    <label>Телефон:</label>
                    <input type="text" {...register("contacts.phone")} />
                    {errors.contacts?.phone && <p className="err-text">{errors.contacts.phone.message}</p>}

                    <label>Email:</label>
                    <input type="email" {...register("contacts.email")} />
                    {errors.contacts?.email && <p className="err-text">{errors.contacts.email.message}</p>}

                    {/* Кнопки управления */}
                    <div className="modal-actions">
                        <button className="save-button" type="submit">Сохранить</button>
                        <button className="cancel-button" type="button" onClick={handleClose}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;

