const AWS = require('./aws');
// const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// const client = new SESClient({ region: 'us-east-2' });
// console.log(client);

AWS.config.update({ region: 'us-east-2', endpoint: 'email.us-east-2.amazonaws.com' });

const generateParams = user => {
    return {
        Destination: { /* required */
            CcAddresses: [
            ],
            ToAddresses: [
              'uttamindukuri5@gmail.com'
              /* more items */
            ]
          },
          Message: { /* required */
            Body: { /* required */
              Html: {
               Charset: "UTF-8",
               Data: `<div><div><h1>Congrats New Registrants</h1><p>Congratulations, you got a new registrants. Here is the registrants details.</p></div><div><table><tr><th>First Name</th><th>Last Name</th><th>Age</th><th>Email</th><th>Phone</th><th>Team</th></tr><tr><td>${ user.firstName }</td><td>${ user.lastName }</td><td>${ user.age }</td><td>${ user.email }</td><td>${ user.phone }</td><td>${ user.team }</td></tr></table></div></div>`
              },
             },
             Subject: {
              Charset: 'UTF-8',
              Data: 'New Registrants'
             }
            },
          Source: 'uttam.indukuri@vtsworld.org', /* required */
          ReplyToAddresses: [
            /* more items */
          ],
    }
};

const sendEmail = async user => {
    try {
    var sendPromise = await new AWS.SES().sendEmail(generateParams(user)).promise();
    console.log(sendPromise);
    return sendPromise;
    } catch (err) {
        console.log('ERROR: ', err);
    }
};

exports.sendEmail = sendEmail;

