import * as yup from "yup";

const loginValidationSchema = yup.object().shape({
    email: yup.string()
        .required("Обязательное поле"),
    password: yup.string()
        .required("Обязательное поле"),
});

export default loginValidationSchema