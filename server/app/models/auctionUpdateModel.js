"use strict";

//Defines dependencies
var applicationStorage = process.require("api/applicationStorage");

module.exports.insertOrUpdate = function (region,realm,name,priority,callback) {
    var database = applicationStorage.getDatabase();


    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in auctionUpdateModel'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in auctionUpdateModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in auctionUpdateModel'));
        return;
    }
    if(priority == null){
        callback(new Error('Field priority is required in auctionUpdateModel'));
        return;
    }

    //Force region to lower case
    region = region.toLowerCase();

    //Create or update guildUpdate
    database.insertOrUpdate("auction-updates",{region:region,realm:realm,name:name}, null, {region:region,realm:realm,name:name,priority:priority}, function(error){
        callback(error);
    });
};

module.exports.delete = function (region,realm,name,callback) {
    var database = applicationStorage.getDatabase();

    database.remove("auction-updates",{region:region,realm:realm,name:name},function(error){
        callback(error);
    });
};

module.exports.getNextToUpdate = function (callback){
    var database = applicationStorage.getDatabase();
    database.search("auction-updates", {}, {_id: 0}, 1, 1, {priority:-1,_id:1}, function(error,auctionUpdate){
        if(error) {
            callback(error);
            return;
        }
        if(auctionUpdate.length == 0 ) {
            callback (null,null);
            return;
        }

        callback(null, auctionUpdate[0]);
    });
};
