const express = require('express');
const notificationModule = require('../notifications/fcm');
const NotificationRouter = express.Router();
const keyAuth = require('../middlewares/keyAuth')
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

NotificationRouter.post('/notification/topic/breaking',(req,res) => {
   try{
       //console.log(req.body);
       const topic = "breaking";
       const title = req.body.title;
       const body = req.body.body;

       notificationModule.sendNotification(topic, title, body)
       .then((response) => {
         console.log('Notification sent:', response);
         res.status(200).send('News posted and notification sent.');
       })
       .catch((error) => {
         console.error('Error sending notification:', error);
         res.status(500).send('Error sending notification.');
       });
        //res.status(200).json({message: "notification sent"})

   }catch(e){
    res.status(500).json({error: e.message})
   }
})

module.exports = NotificationRouter;