import * as yup from "yup";
import validationRules from "./validationRules";

const registerValidationSchema = yup.object().shape({
    name: validationRules.name,
    email: validationRules.email,
    password: validationRules.password

});

export default registerValidationSchema;