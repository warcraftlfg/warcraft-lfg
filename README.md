# wow-finder

Still in development

## Installation
###Requirements
* bower
* nodejs & npm
* grunt

###Databases
* mongodb
* redis

###Download nodejs dependencies
`npm install`

##SSL
Generate Openssl Key & Cert. You need to specify their locations in config file.

##Configuration
Edit and configure app/config.default.json and rename it to config.dev.json

1. For steps on setting up and configuring the battle.net API key, please see [bnet setup](bnetsetup.md)
2. You will need to setup a WarcraftLogs API key, which can be done from their [Settings page](https://www.warcraftlogs.com/accounts/changeuser) near the bottom

###Grunt Configuration
If you need for production
`grunt prod`

If you need for dev
`grunt`

##Launch
Then go to : `https://localhost:3000/`


