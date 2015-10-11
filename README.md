# wow-guild-recruit

Still in development

## Installation
###Requirements
You need :
* bower
* nodejs
* npm
* mongodb

###mongodb
Add user
```
use wow-guild-recruit`
 db.createUser(
   {
     user: "admin",
     pwd: "password",
     roles: [ { role: "userAdmin", db: "wow-guild-recruit" } ]
   }
 )
```

###Download nodejs dependencies
`npm install`

##SSL
Generate Openssl Key & Cert. You need to specify their locations in config file.

##Configuration
Edit and configure app/config.default.json and rename it to config.dev.json

##Launch
Then go to : `https://localhost:3000/`
