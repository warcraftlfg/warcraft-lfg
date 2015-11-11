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
You need a bnet api key & warcraftlogs api key

###Grunt Configuration
If you need for production
`grunt prod`

If you need for dev
`grunt`

##Launch
Then go to : `https://localhost:3000/`


