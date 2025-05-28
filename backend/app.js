const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
require('express-async-errors')
const Routes = require('./routes/routes')
const Middleware = require('./middleware/Middleware')
const cors = require('cors')

const app = express()

const corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions))

app.use(express.json())

dotenv.config({ path: './.env' })

mongoose
    .connect(process.env.DB_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    })
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(`error connecting to db: ${err}`))

app.use('/api/guest', Routes.Guest)
app.use('/api/applicant', Middleware.Verify, Middleware.IsUserExists, Middleware.CheckApplicant, Routes.Applicant)
app.use('/api/employer', Middleware.Verify, Middleware.IsUserExists, Middleware.CheckEmployer, Routes.Employer)
app.use('/api/admin', Middleware.Verify, Middleware.IsUserExists, Middleware.CheckAdmin, Routes.Admin)
app.use('/api', Routes.Other)

app.use(Middleware.Errorhandler);


const PORT = process.env.HTTP_PORT || 3000
const HOST = process.env.HTTP_HOST || 'localhost'
app.listen(PORT, HOST, () => {
    console.log(`server satarted on ${HOST}:${PORT}`);
})










































process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
