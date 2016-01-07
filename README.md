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
/api/characters : get the characters  
####Query filters
| Name       | Content Structure | Description | Values  |   
| --------   | --------------- | ----------  | ------- |
| lfg        | [value]         | filter characters looking or not for a guild | true<br>false |
| faction    | [value]         | filter by faction | 0:Alliance<br>1:Horde
| realm      | [region].[name] | filter by realm |  [region]: The realm region (eu,us,kr,tw)<br>[name]: The realm name in locale en_EN |
| realm_zone | [region].[locale].[timezone] | filter by realm zone  |  us.en_US.America/Chicago<br>us.en_US.America/Los_Angeles<br>us.en_US.America/New_York<br>us.en_US.America/Denver<br>us.en_US.Australia/Melbourne<br>us.es_MX.America/Chicago<br>us.pt_BR.America/Sao_Paulo<br>eu.en_GB.Europe/Paris<br>eu.de_DE.Europe/Paris<br>eu.fr_FR.Europe/Paris<br>eu.es_ES.Europe/Paris<br>eu.ru_RU.Europe/Paris<br>eu.pt_BR.Europe/Paris<br>tw.zh_TW.Asia/Taipei<br>kr.ko_KR.Asia/Seoul|
| language   | [value]         | filter by language | language ISO_639-1 code
| recruitment_class   | [role].[class_id]         | filter by recruitment class | [role]: The role (tank, heal,melee_dps,ranged_dps)<br>[class_id]: Bnet class id
| day   | [value]         | filter by day | monday,tuesday,wednesday,thursday,friday,saturday,sunday
| raids_per_week   | [min].[max]         | filter by raids per week | [role]: minimum number raids per week <br>[class_id]: maximum number raids per week
| progress   | [difficulty].[killNumber]         | filter by max progress  | [difficulty]: normal,heroic,mythic <br>[killNumber]: maximum kill number 



####Query view
| Name       | Value         |   
| --------   | --------------- | 
| view        | minimal<br>detailed       |

####Query number
| Name       | Value         |   
| --------   | --------------- | 
| number        | The number of item to retrieve (min 0 & max 10)       |



###Guilds
####URL
/api/guilds : get the guilds  
####Parameters
... 

###Realms
####URL
/api/realms : get realms
####Query parameters
| Name       | Content Structure | Description | Values  |   
| --------   | --------------- | ----------  | ------- |
| realm_zone | [region].[locale].[timezone] | filter by realm zone  |  us.en_US.America/Chicago<br>us.en_US.America/Los_Angeles<br>us.en_US.America/New_York<br>us.en_US.America/Denver<br>us.en_US.Australia/Melbourne<br>us.es_MX.America/Chicago<br>us.pt_BR.America/Sao_Paulo<br>eu.en_GB.Europe/Paris<br>eu.de_DE.Europe/Paris<br>eu.fr_FR.Europe/Paris<br>eu.es_ES.Europe/Paris<br>eu.ru_RU.Europe/Paris<br>eu.pt_BR.Europe/Paris<br>tw.zh_TW.Asia/Taipei<br>kr.ko_KR.Asia/Seoul|   


