
const os = require('os')
var hostName = os.hostname()

var config = {
    port: 3480,
    serverhost: hostName == 'nodeserver.brainiuminfotech.com' ? 'https://nodeserver.mydevfactory.com' : 'http://localhost',
    environment: 'development', //development,staging,live
    secretKey: 'hyrgqwjdfbw4534efqrwer2q38945765',
    restaurantSearchDistance: 10000,
    adminUrl: 'http://localhost:4200/#/',
    production: {
        username: 'brain1uMMong0User',
        password: 'PL5qnU9nuvX0pBa',
        host: '68.183.173.21',
        port: '27017',
        dbName: 'Hotmenu',
        authDb: 'admin'
    },
    emailConfig: {
        MAIL_USERNAME: "liveapp.brainium@gmail.com",
        MAIL_PASS: "YW5kcm9pZDIwMTY"
    },
    emailTemplete: {
        logoUrl: "https://logo.com/",
        appUrl: "https://app.com/",
        helpUrl: "https://help.com/",
        facebookUrl: "https://facebook.com/",
        twitterUrl: "https://twitter.com",
        instagramUrl: "https://instagram.com/",
        snapchatUrl: "https://snapchat.com/",
        linkedinUrl: "https://www.linkedin.com",
        youtubeUrl: "https://www.youtube.com",
        loginUrl: "https://login.com/",
        androidUrl: "https://android.com/",
        iosUrl: "https://ios.com/",
    },
    twilio: {
        testMode: "YES",
        TWILIO_SID: "",
        TWILIO_AUTHTOKEN: "",
        friendlyName: "hot menu"
    },
    siteConfig: {
        LOGO: '#',
        SITECOLOR: '#0095B0',
        SITENAME: 'Hot Menu'
    },
}

module.exports = config;