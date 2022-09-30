var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { UserDetails } = require("../Schema");
const {
  dbName,
  Mongoosedburl,
  MongodbUrl,
  mongodb,
  MongoClient,
} = require("../Configdb");
const { aesEncryptPassword } = require("../aesEncryption&JWT");

mongoose.connect(Mongoosedburl);
const client = new MongoClient(MongodbUrl);

router.post("/adduser", async (req, res) => {
  await client.connect();
  try {
    const db = client.db(dbName);
    let user = await db
      .collection("users")
      .find({ email: req.body.email })
      .toArray();
    if (user.length === 0) {
      req.body.password = await aesEncryptPassword(req.body.password);
      let users = await UserDetails.create(req.body);
      await db.createCollection(req.body.email);
      res.send({
        statuscode: 200,
        message: "User successfully added",
        user: users,
      });
    } else {
      res.send({
        statuscode: 400,
        message:"User Already Exists, Kindly Login!"
      })
    }
  } catch (error) {
    console.log(error);
    res.send({
      statuscode: 500,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
