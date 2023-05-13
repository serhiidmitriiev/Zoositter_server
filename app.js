const express = require("express");
const { connectToDb, getDb } = require("./db");
const cors = require("cors");

//init app and middleware
const app = express();

app.use(cors());

//login
app.use("/login", (req, res) => {
  res.send({
    token: "test123",
  });
});

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

//routes
app.get("/sitters", (req, res) => {
  let sitters = [];

  db.collection("sitters")
    .find()
    .forEach((sitter) => sitters.push(sitter))
    .then(() => {
      res.status(200).json(sitters);
    })
    .catch(() => {
      res.status(500).json({ error: "Couldn't fetch the documents" });
    });
});
