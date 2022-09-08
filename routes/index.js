var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const {UserDetails} = require('../Schema');
const {dburl} = require('../Configdb')
const {aesEncryptPassword} = require('../aesEncryption&JWT')

mongoose.connect(dburl);

router.post('/adduser', async (req, res) => {
  try {
    req.body.password = await aesEncryptPassword(req.body.password);
    let users = await UserDetails.create(req.body)
    res.send({
      statuscode : 200,
      message : "User successfully added",
      user: users
    })
  } catch (error) {
    res.send({
      statuscode : 500,
      message : "Internal Server Error"
    })    
  }
});

module.exports = router;
