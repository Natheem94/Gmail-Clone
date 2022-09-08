const mongodb = require('mongodb');
const MongoClient  = mongodb.MongoClient;
const dbName = 'Gmailclone'
const dburl = `mongodb+srv://natheem:natheem123@gmailclone.bafdlje.mongodb.net/${dbName}`
module.exports = {dbName,dburl,mongodb,MongoClient}