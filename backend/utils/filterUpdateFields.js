/**
 * Фильтрует объект обновления, оставляя только допустимые поля
 * @param {Object} data - входной объект (например, req.body)
 * @param {string[]} allowedFields - список допустимых полей
 * @returns {Object} - отфильтрованный объект
 */
const filterUpdateFields = (data, allowedFields) => {
    const result = {};
    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(data, field)) {
            result[field] = data[field];
        }
    }
    return result;
};

module.exports = filterUpdateFields;


/* пример использования
const allowedFields = [
  'name',
  'describe',
  'salary_amount',
  'currency',
  'required_experience',
  'industry_id'
];

const filtered = filterUpdateFields(req.body, allowedFields);

if (Object.keys(filtered).length === 0) {
  throw new AppError('Нет допустимых полей для обновления', 400);
}

const updatedVacancy = await VacancyRepository.edit(req.params.id, filtered);
 */