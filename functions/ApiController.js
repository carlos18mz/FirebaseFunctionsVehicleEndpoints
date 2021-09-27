'use-strict'
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var randomstring = require("randomstring");
const axios = require("axios");

function initFirebase() {
  const serviceAccount = require(__dirname + '/keys/deploymentts-firebase-adminsdk-4hiq2-6ae9a5dd85.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}

initFirebase()

class ApiController {

  constructor() {}
  
  messageToTopic(request, response) {
    //const to = ["eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjE6NzE3MDkxMTkwMTI1OmFuZHJvaWQ6YTE3MDM1YTQ0ZTllODBlODNjMTY2NCIsImV4cCI6MTYzMjcyODA5OCwiZmlkIjoiZkxpQlVVU29UM2VIMExWdGFnMVJhNiIsInByb2plY3ROdW1iZXIiOjcxNzA5MTE5MDEyNX0.AB2LPV8wRgIhAIYFuSXbl6fwRRKA0JBEvAKpkKeoqGf4NBi1EEPB3psjAiEA9hVO2eQ0jWVkpsnh0jDGOST1H4NwFvQ0YlrEl-_NykU"]
    const payload = {
      topic: 'test',
      notification: {
        title: randomstring.generate({length: Math.random() * (10 - 5) + 5,charset: 'alphabetic'}),
        body: randomstring.generate({length: Math.random() * (10 - 5) + 5,charset: 'alphabetic'})
      },
      android: {
        notification: {
          color: '#7e55c3'
        }
      },
    }
    
    admin.messaging().send(payload).then((res) => {
        console.log('Successfully sent message:', res);
        return response.send(
          {
            success: true,
            data: res
          })
    }).catch((error) => {
        console.log("error : ",error)
        return response.send({success:false, error: error.code})
    });
  }

  messageGeneral(request, response) {
    const payload = {
      "data": {data: JSON.stringify(
        {
          "titulo":  randomstring.generate({
            length: Math.random() * (10 - 5) + 5,
            charset: 'alphabetic'
          }),
          "mensaje": randomstring.generate({
            length: Math.random() * (10 - 5) + 5,
            charset: 'alphabetic'
          })
        }
      )}    
    }
    admin.messaging().send(payload).then((res) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', res);
        return response.send(
          {
            success: true,
            data: res
          })
    }).catch((error) => {
        console.log("error : ",error)
        return response.send({success:false, error: error.code})
    });
  }

  checkPlateForReport(request, response) {
    const vehicle = request.body
    if(vehicle.plate!= null && vehicle.brand != null && vehicle.model != null) {
      axios.get(`https://vehiclesapinotification.azurewebsites.net/api/vehicles/${vehicle.plate}?code=wkH8hyYbCdfvk5Ljgv8fdraGY0WKDTX8MAUpGOGHdsaeB2bRau5wIw==`)
      .then((data) => {
        
        const vehicleResult = data.data
        var options = {
          priority: "high",
          timeToLine: 60*60*24
        }
        let payload
        if(data.status == 200) {
          payload = {
            topic: 'test',
            notification: {
              title: "Vehículo encontrado",
              body: "Se encontró vehículo con la placa : "+vehicleResult.plate
            },
            android: {
              notification: {
                color: '#7e55c3'
              }
            },
           
          }  

        }
        else {
           payload = {
            topic: 'test',
            notification: {
              title: "Vehículo no registrado",
              body: "No se encontró vehículo con la placa : "+vehicle.plate
            },
            android: {
              notification: {
                color: '#7e55c3'
              }
            },
          }
        }

        admin.messaging().send(payload).then((res) => {
              return response.send(
                {
                  success: true,
                  data: res
                })
          }).catch((error) => {
              console.log("error : ",error)
              return response.send({success:false, error: error.code})
          });
      })
    .catch((error) => {
      return response.send({success:false, error: error.code})
    })
    } else {
      return response.send({success:false, error: "Debe enviar un vehiculo"})
    }
    

        
  }

  verifyFCMToken (request, response) {
    const s = admin.messaging().send({
      "validate_only": true,
      "message": {
        token: request.body.token
      }
    }, true)
    console.log("s : "+s)

    return s
}
}

/*

android: {
  notificación: {
    clickAction: 'news_intent'
  }
},
apns: {
  carga útil: {
    aps: {
      'categoría': 'INVITE_CATEGORY'
    }
  }
},
webpush: {
  fcmOptions: {
    enlace: 'breakingnews.html'
  }
},

*/
module.exports = ApiController