const { Duplex } = require("stream");

data = [];

const stream = stream.write("test");

stream.on("data", (data) => {
  console.log(data.toString());
});
