import express, { Request, Response, Application } from "express";

// INIT THE APP
const app: Application = express();

// SERVER PORT
const PORT = 1337;

app.listen((): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
