import * as yup from "yup";
import validationRules from "./validationRules";

const resumeValidationSchema = yup.object().shape({
    name: validationRules.resume_name,
    biography: validationRules.resume_bio,
});

export default resumeValidationSchema;