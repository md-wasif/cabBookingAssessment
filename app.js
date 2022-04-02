const express = require('express');
const apiRouter = require("./routes/api");


const app = express();


const port = 2022

//Route Prefixes
app.use("/api/", apiRouter);

// app.use('/user/', userRoute);
// app.use('/driver/', driverRoute);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});


module.exports = app;