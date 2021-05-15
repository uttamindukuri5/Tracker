const AWS = require('./aws/aws');
const app = require('./express');

AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
        app.listen(4000, () => {
            console.log('Server running at port 4000');
        });
    }
});
