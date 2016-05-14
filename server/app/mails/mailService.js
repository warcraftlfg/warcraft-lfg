var async = require("async");
var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
var applicationStorage = process.require("core/applicationStorage.js");

module.exports.sendMail = function (mailList, subject, callback) {
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;

    var mailConfig = wellknown(config.mail.service);
    mailConfig.auth = {user: config.mail.user, pass: config.mail.pass};
    mailConfig.poll = true;

    var transporter = nodemailer.createTransport(mailConfig);


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
                logger.error('Message sent to %s : %s', mail, info.response);
            }
            logger.info('Message sent to %s : %s', mail, info.response);
            callback();
        });
    }, function () {
        callback();
    });


};