require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const path = require("path");
const mongoDatabase = require("./databases/mongoose.js");
const mongoose = require("mongoose");
const cors = require("cors");

// .env
const port = process.env.PORT || 7070;
const origin = process.env.ORIGIN || 2020;

// init app
const app = express();

// app use
app.use(express.json());
app.use(
  cors({
    origin: origin,
  })
);

// default get
app.get("/", (req, res) => {
  return res.status(200).json({
    code: 1,
    success: true,
    message: "default branch",
  });
});

// New Routers Define
const AccountRouter = require("./routers/AccountRouter.js");
app.use("/accounts", AccountRouter);
const RecipeRouter = require("./routers/RecipeRouter.js");
app.use("/recipes", RecipeRouter);

// error handling
app.use((req, res, next) => {
  next(createError(404, "This directory does not exist!"));
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  return res.status(err.status).json({
    code: 0,
    success: false,
    message: err.message,
  });
});

// connect to mongodb
// init server
mongoDatabase
  .connect()
  .then((result) => {
    if (result.success) {
      console.log("> " + result.message);
      app.listen(port, () => {
        console.log(`> Website running at: http://localhost:${port}`);
      });
    } else {
      console.log("> " + result.message);
    }
  })
  .catch((err) => {
    console.log(err);
  });
