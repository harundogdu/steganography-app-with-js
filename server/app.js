const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 1923;

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});