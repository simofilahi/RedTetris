const express = require("express");
const app = express();

const port = 1337;

const map = require("./routes/map");

app.use("/api", map);

app.listen(port, () => {
  console.log("server started");
});
