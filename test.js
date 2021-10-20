const { Duplex } = require("stream");

data = [];

const stream = new Duplex({
  write(chunk, enc, next) {
    data.push(chunk);
    next();
  },

  read() {
    if (data.length === 0) {
      this.push(null);
    } else {
      this.push(data.shift());
    }
  },
});

stream.write("test");

stream.on("data", (data) => {
  console.log(data.toString());
});
