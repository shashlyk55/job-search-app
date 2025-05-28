import * as yup from "yup";
import validationRules from "./validationRules";

const responseValidationSchema = yup.object().shape({
    pinned_message: validationRules.pinned_message
});

export default responseValidationSchema;