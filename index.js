const express = require("./express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://dbUser:B3D5571h9C8qOBIl@cluster0-gbqi8.mongodb.net/screens?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.listen(3000, function () {
  console.log("express is listening on port 3000");
});
