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
* Bnet - https://dev.battle.net/
* Warcraftlogs - https://www.warcraftlogs.com/

###Grunt Configuration
If you need for production
`grunt prod`

If you need for dev
`grunt`

##Launch
###Dev
Simply launch nodejs and you will have every thing functionnal
`node server/server.js`
then go to : `https://localhost:3000/`

###Prod
If you need more crawler you can launch each one by one
`node server/server.js -ws` Launch Webserver
`node server/server.js -gu` Launch Guild Update Process (Import from Bnet guild info & WowProgress ranking) - Best effort
`node server/server.js -cu` Launch Character Update Process (Import from Bnet info & Warcraftlogs info) - Best effort
`node server/server.js -ru` Launch Realm Update Process (Import from Bnet info) - Each day at 4am
`node server/server.js -wp` Launch Wowprogress Process (Import from WowProgress Player & Guild ads) - Each minute
`node server/server.js -clean` Set lfg to false on old ads & check if the guild or character always lfg on WowProgress - Each day at 4am
`node server/server.js -au` Feed the Guild Update & Character Update Process with Auction House players info - Best effort
`node server/server.js -adu` Feed the CharacterUpdate et GuildUpdate Process with people/guild lfg - Each day at 4am
`node server/server.js -gpu` Create Progress when a player/guild is updated - Best effort

On production we have :
* 8 -ws (with nginx proxy)
* 1 -gu
* 15 -cu
* 1 -ru
* 1 -wp
* 1 -clean
* 1 -au
* 1 -adu
* 1 -gpu
