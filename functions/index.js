const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

const serviceAccount = require('./rooroomies-firebase-adminsdk-9o21i-dbe36e1b37.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// admin.initializeApp();
exports.googleMap = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    axios(
      encodeURI(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${request.query.lat},${request.query.lng}&radius=1000&keyword=${request.query.keyword}&language=zh-TW&key=AIzaSyDoOaoSZkxuIEIgmn4VNG3DG1JVnykezy8`
      )
    )
      .then((res) => JSON.parse(JSON.stringify(res.data)))
      .then((json) => response.json(json));
  });
});
