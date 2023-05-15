const { MongoClient } = require("mongodb");

let dbConnection;

let uri =
  "mongodb+srv://dmitriievserguei:qTyu0UFnAxk6nmkG@cluster0.02vc3hp.mongodb.net/?retryWrites=true&w=majority";

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
