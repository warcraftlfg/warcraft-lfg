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
    npm install

##SSL
Generate Openssl Key & Cert. You need to specify their locations in config file.

##Configuration
Edit and configure app/config.default.json and rename it to config.dev.json

1. For steps on setting up and configuring the battle.net API key, please see [bnet setup](bnetsetup.md)
2. You will need to setup a WarcraftLogs API key, which can be done from their [Settings page](https://www.warcraftlogs.com/accounts/changeuser) near the bottom

###Create index in mongodb
    use YOURDATABASE
    db.characters.createIndex({"ad.lfg":1},{background:true,sparse:true})  
    db.guilds.createIndex({"ad.lfg":1},{background:true,sparse:true})

###Grunt Configuration
If you need for production
`grunt prod`

If you need for dev
`grunt`

##Launch
Then go to : `https://localhost:3000/`

##API
###Characters
####URL
/api/characters : get characters  
####Parameters
Use query params ? at the end of url to filter & sort query  
lfg=true : Return only characters who looking for a guild
###Guilds
####URL
/api/guilds : get guilds  
####Parameters
Use query params ? at the end of url to filter & sort query  
lfg (true/false)
faction
###Realms
####URL
/api/realms : get realms
####Parameters
Use query params ? at the end of url to filter & sort query
zone=[region].[locale].[timezone] : Return realms


