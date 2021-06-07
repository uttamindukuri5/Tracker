const https = require('https');
const fs = require('fs');
const AWS = require('./aws/aws');
const app = require('./express');

AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    else {
        https.createServer({
            key: fs.readFileSync('../../../../../../../etc/letsencrypt/live/vtwalk.org/privkey.pem'),
            cert: fs.readFileSync('../../../../../../../etc/letsencrypt/live/vtwalk.org/fullchain.pem'),
            passphrase: process.env.PASSPHRASE
        }, app).listen(4000, () => {
            console.log('Server has started in port 4000');
        });
        // app.listen(4000, () => {
        //     console.log('Server running at port 4000');
        // });
    }
});
