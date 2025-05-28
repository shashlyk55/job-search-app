import * as yup from "yup";

const validationRules = {
    name: yup.string()
        .required("Обязательное поле")
        .min(3, "Имя должно быть не менее 3 символов"),
    email: yup.string()
        .required("Обязательное поле")
        .email("Некорректный email"),
    phone: yup.string()
        .nullable()
        // .notRequired()
        // .optional()
        .transform((value) => (value === "" ? null : value))
        .matches(/^[+]?[\d\s\-()]{9,15}$/, "Введите корректный номер телефона (10-15 цифр)"),
    password: yup.string()
        .required("Обязательное поле")
        .min(8, "Пароль должен содержать не менее 8 символов")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, "Пароль должен содержать буквы верхнего и нижнего регистра, цифры и спецсимвол"),
    company_regnum: yup.string()
        .required("Обязательное поле")
        .matches(/^\d+$/, "Введите только цифры"),
    resume_name: yup.string()
        .required("Обязательное поле")
        .min(3, "Имя должно быть не менее 3 символов"),
    resume_bio: yup.string()
        .required("Обязательное поле")
        .max(3000, "Не более 3000 символов"),
    resume_skills: yup.array().of(yup.string()
        .required("Обязательное поле")
        .min(2, "Название навыка минимум 2 символа")
        .max(25, "Название навыка максимум 25 символов")),
    resume_exp_company: yup.string()
        .required("Обязательное поле")
        .max(50, 'Место работы максимум 50 символов'),
    resume_exp_position: yup.string()
        .required("Обязательное поле")
        .max(50, 'Должность максимум 50 символов'),
    resume_exp_years: yup.number()
        .required("Обязательное поле")
        .min(1, 'Некорректный опыт работы'),
    pinned_message: yup.string()
        .max(200, 'Сообщение не более 300 символов')
        .optional(),
    vacancy_name: yup.string()
        .required("Обязательное поле")
        .max(50, 'Название не более 50 символов'),
    vacancy_decription: yup.string()
        .required("Обязательное поле")
        .max(3000, 'Описание вакансии до 3000 символов'),
    vacancy_salary: yup.number()
        .required("Обязательное поле")
        .min(1, 'Минимальная зарплата 1'),
    vacancy_exp: yup.number()
        .required("Обязательное поле")
        .min(0, 'Минимальный опыт 0'),
    vacancy_industry: yup.string()
        .required("Выберите отрасль"),
    vacancy_currency: yup.string()
        .required("Выберите валюту"),
    industry_name: yup.string()
        .required("Обязательное поле")
        .max(30, 'Название отрасли до 30 символов'),
};

export default validationRules;
