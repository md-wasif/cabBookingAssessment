const express = require('express');

const userRouter = require('./userRoute/userRoute');
const driverRouter = require('./driverRoute/driverRoute');


const app = express();

app.use("/user/", userRouter);
app.use("/driver/", driverRouter);


module.exports = app;