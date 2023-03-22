const mongoose = require('mongoose')

const connectDB = (url) => {
    return mongoose.connect(url)
}

module.exports = connectDB



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://adnanbwp7:<password>@aus.hi3r3bt.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
