import * as yup from "yup";
import validationRules from "./validationRules";

const industryValidationSchema = yup.object().shape({
    name: validationRules.industry_name
});

export default industryValidationSchema;