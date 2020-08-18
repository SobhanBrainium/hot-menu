var nodeMailer = require('nodemailer');
var nodeMailerSmtpTransport = require('nodemailer-smtp-transport');
var config = require('../config');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');

module.exports = function (emailType) {
    const emailFrom = config.emailConfig.MAIL_USERNAME;
    const emailPass = config.emailConfig.MAIL_PASS;

    // define mail types
    var mailDict = {
        "userRegistrationMail": {
            subject: "Welcome to Hot menu",
            html    : '../modules/emails/userRegistrationMail.html',
            //html    : require('./welcomeUser'),
        },
        "forgotPasswordMail": {
            subject: "Forgot Password",
            html    : '../modules/emails/forgotPasswordMail.html',
            //html    : require('./forgotPasswordMail'),
        },
        "verifyOtpEmail": {
            subject: "OTP verification email",
            html    : '../modules/emails/verifyOtpEmail.html',
            //html    : require('./otpVerificationMail'),
        },
        "resendOtpMail": {
            subject: "Resend OTP",
            html    : '../modules/emails/verifyOtpEmail.html',
        },
        "sendOTPdMail" :{
            subject : "OTP verification email",
            html    : '../modules/emails/OTPmail.html',
        },
    };

    const filePath = path.join(__dirname, mailDict[emailType].html);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);


    var transporter = nodeMailer.createTransport(nodeMailerSmtpTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        debug: true,
        auth: {
            user: emailFrom,
            // pass    : emailPass,
            pass: Buffer.from(emailPass, 'base64').toString('ascii'),
        },
        maxMessages: 100,
        requireTLS: true,
    }));


    return function (to, data) {
        var self = {
            send: () => {
                var mailOption = {
                    from: `Hot menu <${emailFrom}>`,
                    to: to,
                    subject: mailDict[emailType].subject,
                    // text: `Hello ${data.name}, please verify your studiolive account. Your verification code is ${data.otp}`
                };

                data.imageUrl = `${config.serverhost}:${config.port}/img/email/`

                var emailTemp = config.emailTemplete;
                let mergedObj = {...data, ...emailTemp};
                mailOption.html = template(mergedObj);


                transporter.sendMail(mailOption, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email Sent', info.response);
                    }
                });
            }
        }
        return self;
    }
}

