#Battle.NET API Integration

##What

This site usese the [Battle.NET API](http://dev.battle.net), and will need to be configured for you to run it locally.

A configured battle.net API will allow you to connect to their OAuth from the website when doing local development.

##How

###Battle.NET Setup

1. Go to [dev.battle.net](http://dev.battle.net) and either login or create a new account
2. Once logged in, go to [my account](https://dev.battle.net/apps/mykeys)
3. Go to the *Applications* tab
4. Click *Create New Application*
5. Your application will look like this:
<img src="http://imgur.com/NZhrXv8.jpg">
6. For the callback URL, you will enter this value: `https://localhost:3000/auth/bnet/callback`
This value comes from `config.default.json`, and is the default value for the callback URL

###Warcraft LFG Setup

Once you have a key, you can navigate to the [MyKeys page](https://dev.battle.net/apps/mykeys) on battle.net

The next steps assume that you've setup the `config.dev.json` file in `/server/app/config/`, and will not cover that step.

1. Navigate to [MyKeys](https://dev.battle.net/apps/mykeys) on the dev.battle.net site.
2. In `config.dev.json`, scroll to the `oauth.bnet` node.
3. `client_id` should have its value set to "Key" from the battle.net site
4. `client_secret` should have its value set to the "Secret" from the battle.net site

After the site rebuilds, it should now allow authentication.