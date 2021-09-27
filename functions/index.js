
const functions = require("firebase-functions");
const admin = require('firebase-admin');

const apiController = require('./ApiController');

const apiControllerObject = new apiController();

exports.messageToTopic = functions.https.onRequest((request, response) => {
  return apiControllerObject.messageToTopic(request, response);
})

exports.messageGeneral = functions.https.onRequest((request, response) => {
  return apiControllerObject.messageGeneral(request, response)
})

exports.checkPlateForReport = functions.https.onRequest((request, response) => {
  return apiControllerObject.checkPlateForReport(request, response)
})

exports.verifyFCMToken = functions.https.onRequest((request, response) => {
  return apiControllerObject.verifyFCMToken(request, response)
})