const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;
const { initializeApp } = require('firebase-admin/app');
const admin = require("firebase-admin");

const serviceAccount = require("./burj-al-arab-4bb2c-firebase-adminsdk-6hw5i-322cfb321c.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://burjAlArab:arabian13528@cluster0.x7xfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())






const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("burjAlArab").collection('booking');
  console.log('database connected');

  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    collection.insertOne(newBooking)
      .then(result => {
        res.send(result.acknowledged);
      })
  })
  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          const userEmail = decodedToken.email;
          if (userEmail == req.query.email) {
            
          }else{
            res.status(404).send('un-authorized-access')
          }

          // ...
        })
        .catch((error) => {
          // Handle error
          console.log(error);
          res.status(404).send('un-authorized-access')
        });
    }else{
      res.status(404).send('un-authorized-access')
    }

  })
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})