

const ErrorHandlerMiddleware = async (err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Внутренняя ошибка сервера',
    });
}

module.exports = ErrorHandlerMiddleware