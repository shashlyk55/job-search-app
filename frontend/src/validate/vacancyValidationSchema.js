import * as yup from "yup";
import validationRules from "./validationRules";

const vacancyValidationSchema = yup.object().shape({
    name: validationRules.vacancy_name,
    describe: validationRules.vacancy_decription,
    //experience: validationRules.vacancy_exp,
    //salary: validationRules.vacancy_salary,
    currency: validationRules.vacancy_currency,
    //industry: validationRules.vacancy_industry,
});

export default vacancyValidationSchema;