const mongodb = require('mongodb');
const MongoClient  = mongodb.MongoClient;
const dbName = 'Gmailclone'
const Mongoosedburl = `mongodb+srv://natheem:nat190394@gmailclone.bafdlje.mongodb.net/${dbName}`
const MongodbUrl = 'mongodb+srv://natheem:nat190394@gmailclone.bafdlje.mongodb.net/test'
module.exports = {dbName,Mongoosedburl,MongodbUrl,mongodb,MongoClient}