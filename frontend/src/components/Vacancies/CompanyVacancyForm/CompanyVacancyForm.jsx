import { useState, useEffect } from "react";
import "./CompanyVacancyForm.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import vacancyValidationSchema from "../../../validate/vacancyValidationSchema";

const CompanyVacancyForm = ({ onClose, onSubmit, vacancy }) => {
    const [industryTypes, setIndustries] = useState([]);
    const [numberFields, setNumberFields] = useState({
        salary_amount: vacancy?.salary_amount || "",
        required_experience: vacancy?.required_experience || ""
    });
    const [numberErrors, setNumberErrors] = useState({
        salary_amount: null,
        required_experience: null
    });
    // const [vacancyData, setVacancyData] = useState({
    //     name: vacancy?.name || "",
    //     describe: vacancy?.describe || "",
    //     salary_amount: vacancy?.salary_amount || "",
    //     currency: vacancy?.currency || "USD",
    //     required_experience: vacancy?.required_experience || "",
    //     industry_id: vacancy?.industry_id._id || "",
    // });

    // const { register, handleSubmit, formState: { errors } } = useForm({
    //     resolver: yupResolver(vacancyValidationSchema),
    // });

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        setValue,
        clearErrors
        
    } = useForm({
        resolver: yupResolver(vacancyValidationSchema),
            defaultValues: {
            name: vacancy?.name || "",
            describe: vacancy?.describe || "",
            //salary_amount: vacancy?.salary_amount || "",
            currency: vacancy?.currency || "USD",
            //required_experience: vacancy?.required_experience || "",
            industry_id: vacancy?.industry_id?._id || "",
        }
    });

    useEffect(() => {                
        (async () => {
            try{
                const response = await fetch('http://localhost:3000/api/industries',
                    {
                        method: 'GET',
                    }
                )
                const data = await response.json()
                
                if(!data.success){
                    setIndustries([])
                    return
                }
                if (vacancy?.industry_id?._id) {
                    setValue("industry_id", vacancy.industry_id._id);
                }
                
                setIndustries(data.industries)
            } catch(err){
                console.log('error: ', err.message)
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setValue]);

    const handleNumberChange = (field, value) => {        
        setNumberFields(prev => ({
        ...prev,
        [field]: value
        }));
        
        // Сбрасываем ошибку при изменении
        setNumberErrors(prev => ({
            ...prev,
            [field]: null
        }));
    };

    const validateNumbers = () => {
        
        const newErrors = {};
        let isValid = true;

        // Проверка зарплаты
        if (!numberFields.salary_amount || isNaN(numberFields.salary_amount)) {
            newErrors.salary_amount = "Введите корректную зарплату";
            isValid = false;
        } else if (Number(numberFields.salary_amount) < 0) {
            newErrors.salary_amount = "Зарплата не может быть отрицательной";
            isValid = false;
        }

        // Проверка опыта
        if (!numberFields.required_experience || isNaN(numberFields.required_experience)) {
            newErrors.required_experience = "Введите корректный опыт";
            isValid = false;
        } else if (Number(numberFields.required_experience) < 0) {
            newErrors.required_experience = "Опыт не может быть отрицательным";
            isValid = false;
        }

        setNumberErrors(newErrors);
        return isValid;
    };

    const handleSave = (data) => { 
        console.log(data.industry_id)
        clearErrors()
        if (!validateNumbers()) 
            return;

        onSubmit({
            ...data,
            salary_amount: Number(numberFields.salary_amount),
            required_experience: Number(numberFields.required_experience)
        });
    }

    return (
        <div className="modal">
            <form className="modal-content" onSubmit={handleSubmit(handleSave)}>
                <h2>{vacancy ? "Редактировать вакансию" : "Добавить вакансию"}</h2>

                <div className="vacancy-name-div">
                    <span>
                        <label>Название</label>
                        <input 
                        {...register("name")}
                        type="text" 
                        name="name" 
                        placeholder="Название вакансии" 
                        // value={vacancyData.name} 
                        // onChange={handleChange} 
                        />
                        {errors.name && <p className="err-text">{errors.name.message}</p>}            
                    </span>
                </div>

                <div className="salary-div">
                    <label>Зарплата</label>
                    <span>
                        <input 
                        //{...register("salary")}
                        type="number" 
                        name="salary_amount" 
                        placeholder="Зарплата"
                        value={numberFields.salary_amount}
                        onChange={(e) => handleNumberChange("salary_amount", e.target.value)}
                        />
                        {numberErrors.salary_amount && <p className="err-text">{numberErrors.salary_amount}</p>} 

                        <select 
                        {...register("currency")}
                        name="currency" 
                        // value={vacancyData.currency} 
                        // onChange={handleChange}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="RUB">RUB</option>
                            <option value="BYN">BYN</option>
                        </select>
                    </span>
                </div>

                <div className="vacancy-exp-industry-div">
                    <span>
                        <label>Опыт(в годах)</label>
                        <input 
                        //{...register("experience")}
                        type="number" 
                        name="required_experience" 
                        placeholder="Опыт (в годах)"
                        value={numberFields.required_experience}
                        onChange={(e) => handleNumberChange("required_experience", e.target.value)}
                        />
                        {numberErrors.required_experience && <p className="err-text">{numberErrors.required_experience}</p>} 
                    </span>

                    {industryTypes.length == 0 ? (
                        <div className="loading-message">Загрузка списка отраслей...</div>
                    ) : (
                        <select 
                        name="industry_id" 
                        // value={vacancyData.industry_id} 
                        // onChange={handleChange} 
                        {...register("industry_id", { required: "Выберите отрасль" })}
                        required
                        >
                            <option value="">Выберите отрасль</option>
                            {industryTypes.map((industry) => (
                                <option key={industry._id} value={industry._id}>
                                    {industry.industry_type}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="vacancy-descr-div">
                    <label>Описание</label>
                    <textarea 
                    {...register("describe")}
                    name="describe" 
                    placeholder="Описание вакансии" 
                    // value={vacancyData.describe} 
                    // onChange={handleChange}
                    ></textarea>
                    {errors.describe && <p className="err-text">{errors.describe.message}</p>} 
                </div>    

                <button 
                    className="save-button" 
                    //onClick={handleSubmit(handleSave)}
                    type="submit"
                    >Сохранить</button>
                <button className="cancel-button" onClick={onClose}>Отмена</button>
            </form>
        </div>
    );
};

export default CompanyVacancyForm;
