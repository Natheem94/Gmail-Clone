var express = require("express");
var router = express.Router();
const { dbName, MongodbUrl, mongodb, MongoClient } = require("../Configdb");
const {
  aesDesryptPassword,
  CreateToken,
  VerifyToken,
} = require("../aesEncryption&JWT");
const { CreateMail, SendEmail } = require("../MailSend");

let transporter;
const client = new MongoClient(MongodbUrl);

router.post("/login", async (req, res) => {
  await client.connect();
  try {
    const db = client.db(dbName);
    let loginData = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (loginData) {
      let hashResult = await aesDesryptPassword(loginData.password);
      if (hashResult === req.body.password) {
        let token = await CreateToken({ email: loginData.email});
        transporter = await CreateMail(loginData.email, hashResult);
        res.send({
          statusCode: 200,
          message: "User Logged in Successfully",
          token,
          name:loginData.name,
        });
      } else {
        res.send({
          statusCode: 401,
          message: "Wrong Password",
        });
      }
    } else {
      res.send({
        statusCode: 401,
        message: "User does not exist",
      });
    }
  } catch (error) {
    res.send({
      statuscode: 500,
      message: "Internal Server Error",
    });
  } finally {
    client.close();
  }
});

router.post("/sendemail", async (req, res) => {
  await client.connect();
  try {
    const db = client.db(dbName);
    let TokenStatus = await VerifyToken(req.headers.authorization);
    console.log(req.body);
    if (TokenStatus) {
      let info = await SendEmail(transporter, req.body);
      await db.collection(transporter.options.auth.user).insertOne(req.body);
      console.log(info);
      res.send({
        statuscode: 200,
        message: "Email sent successfully",
      });
    } else {
      res.send({
        statuscode: 204,
        message: "Token has expired Login again",
      });
    }
  } catch (error) {
    res.send({
      statuscode: 500,
      message: "Internal Server Error",
    });
  } finally {
    client.close();
  }
});

router.get("/outbox", async (req, res) => {
  await client.connect();
  try {
    const db = client.db(dbName);
    let TokenStatus = await VerifyToken(req.headers.authorization);
    if (TokenStatus) {
      let outbox = await db
        .collection(transporter.options.auth.user)
        .find()
        .toArray();
      res.send({
        statuscode: 200,
        data: outbox,
      });
    } else {
      res.send({
        statuscode: 204,
        message: "Token has expired Login again",
      });
    }
  } catch (error) {
    res.send({
      statuscode: 500,
      message: "Internal Server Error",
    });
  } finally {
    client.close();
  }
});

module.exports = router;
