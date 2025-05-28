import React, { useEffect, useState } from "react";
import './FilterVacancies.css'
import useVacanciesStore from "../../../store/useVacanciesStore";

const VacancyFilters = () => {
    const { setFilters, fetchVacancies } = useVacanciesStore();
    const [industries, setIndustries] = useState([])

    const [localFilters, setLocalFilters] = useState({
        vacancy: "",
        min_salary: "",
        industry: "",
        company: "",
        max_experience: "",
        sort: ""
    });

    const applyFilters = () => {
        setFilters(localFilters);
        fetchVacancies();
    };

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
                setIndustries(data.industries)
            } catch(err){
                console.log('error: ', err.message)
            }
        })()
    }, [])

    return (
        <div className="filters-container">
            <label htmlFor="vacancy-name">Название вакансии</label>
            <input
                id="vacancy-name"
                type="text"
                placeholder="Название вакансии"
                value={localFilters.vacancy}
                onChange={(e) => setLocalFilters({ ...localFilters, vacancy: e.target.value })}
            />

            <label htmlFor="min-salary">Мин. зарплата</label>
            <input
                id="min-salary"
                type="number"
                placeholder="Мин. зарплата"
                value={localFilters.min_salary}
                onChange={(e) => setLocalFilters({ ...localFilters, min_salary: e.target.value })}
            />
            <label htmlFor="industry">Отрасль</label>
            <select 
                id="industry"
                value={localFilters.industry} 
                onChange={(e) => setLocalFilters({ ...localFilters, industry: e.target.value })}
            >
                <option value="">Все</option>
                {industries.map((industry) => <option key={industry._id} value={industry._id}>{industry.industry_type}</option>)}
            </select>

            <label htmlFor="max_experience">Опыт (лет)</label>
            <input
                id="max_experience"
                type="number"
                placeholder="Опыт (лет)"
                value={localFilters.max_experience}
                onChange={(e) => setLocalFilters({ ...localFilters, max_experience: e.target.value })}
            />

            <label htmlFor="sort">Сортировка</label>
            <select
                id="sort"
                name="sort" 
                value={localFilters.sort} 
                onChange={(e) => setLocalFilters({ ...localFilters, sort: e.target.value })}
            >
                <option value="">Без сортировки</option>
                <option value="date_desc">Сначала новые</option>
                <option value="date_asc">Сначала старые</option>
                <option value="salary_desc">С высокой зарплаты</option>
                <option value="salary_asc">С низкой зарплаты</option>
            </select>

            <div className="filter-buttons">
                <button onClick={applyFilters}>Применить</button>
                <button onClick={() => setLocalFilters({ vacancy: "", min_salary: "", industry: "", company: "", max_experience: "" })}>
                    Сбросить
                </button>
            </div>
        </div>
    );
};

export default VacancyFilters;
