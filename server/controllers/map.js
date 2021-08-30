const mapGenerator = require("../utils/mapGenerator");

exports.map = () => {
  const map = mapGenerator();

  map.forEach((piece) => {
    piece.forEach((item) => process.stdout.write(item.value.toString()));
    console.log();
  });
  //   console.log(JSON.stringify(mapGenerator(), null, 10));
};
