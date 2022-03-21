const express = require('express');
const cors = require('cors');
const fileupload = require("express-fileupload");
const apiRouter = require('./routes/apiRouter.js');

const app = express();
const PORT = process.env.PORT || 1923;

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileupload());

/* Routers */

app.use('/api', apiRouter);
app.use('/', (req, res) => {
    res.send("Welcome to the API");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});