var async = require("async");

var applicationStorage = process.require("core/applicationStorage.js");

module.exports.sendMail = function (mailList, subject, callback) {
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;

    async.each(mailList, function (mail, callback) {
        var mailOptions = {
            from: config.mail.fromAddress, // sender address
            to: mail, // list of receivers
            subject: subject, // Subject line
            text: 'Hello world 🐴', // plaintext body
            html: '<b>Hello world 🐴</b>' // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error('Message sent to %s : %s', mail, error);
            }
            logger.info('Message sent to %s : %s', mail, info.response);
            callback();
        });
    }, function () {
        callback();
    });


};