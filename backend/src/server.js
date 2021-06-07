const https = require('https');
const fs = require('fs');
const AWS = require('./aws/aws');
const app = require('./express');

AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    else {
        https.createServer({
            key: fs.readFileSync('./privkey.pem'),
            cert: fs.readFileSync('./fullchain.pem'),
            passphrase: process.env.PASSPHRASE
        }, app).listen(4000, () => {
            console.log('Server has started in port 4000');
        });
        // app.listen(4000, () => {
        //     console.log('Server running at port 4000');
        // });
    }
});
