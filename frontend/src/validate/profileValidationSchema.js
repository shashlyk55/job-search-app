import * as yup from "yup";
import validationRules from "./validationRules";

const profileValidationSchema = yup.object().shape({
    name: validationRules.name,
    contacts: yup.object().shape({
        email: validationRules.email,
        phone: validationRules.phone
    })
});

export default profileValidationSchema;