const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");
const cors = require("cors");

//init app and middleware
const app = express();
app.use(express.json());

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

//Fetching a single document with sitters

app.get("/sitters/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("sitters")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Couldn't fetch the document" });
      });
  } else {
    res.status(500).json({ error: "Not valid document id" });
  }
});

app.post("/sitters", (req, res) => {
  const sitter = req.body;

  db.collection("sitters")
    .insertOne(sitter)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create a new document" });
    });
});

app.delete("/sitters/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("sitters")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Couldn't delete the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
});

app.patch("/sitters/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("sitters")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Couldn't update the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
});
