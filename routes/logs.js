const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const isAuth = require('../middlewares/isAuth')
const CronJob = require('cron').CronJob;

router.get('/logs', isAuth, (req, res) => {
  const logFilePath = path.join('./access.log');
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading logs.' + err.message);
    }
    let arr = data.split('}')
    //console.log(arr)
    res.render('logs', { logData:arr });
  });
});

// // Schedule a job to delete logs every 1 minute
// new CronJob('* * * * *', () => {
//     const logFilePath = path.join('./access.log');
//     fs.unlink(logFilePath, (err) => {
//       if (err) {
//         console.error('Error deleting logs:', err);
//       } else {
//         console.log('Logs deleted.');
//       }
//     });
//   }).start();

module.exports = router;
