const admin  = require('firebase-admin');
let registrationToken = "fsmddCI5TZegaTOgaXsZ25:APA91bH24bi0u6rEegeLgnUwS9V0mq9FXmMhyO7tzfgfTp52lDz_T-iqLq4dYD2EiwMmaKRpQ8bxAh66uXLfzBYk8vLOfFeCtxbgZKLRl3oVo-e84JoZHOsVC0_kS4zUEHx_YnzyCOVe";
// Initialize Firebase Admin SDK (as shown in the previous example)
function sendNotification(topic, title, body) {
    const message = {
      notification: {
        title,
        body,
      },

      data:{
        newsId: "652bea79875b7a8d16559f1c"
      },
      token: registrationToken,
    };
  
    return admin.messaging().send(message);
  }

  module.exports = {
    sendNotification,
  };