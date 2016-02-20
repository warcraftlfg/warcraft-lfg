"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");
var applicationStorage = process.require("core/applicationStorage.js");
var ObjectId = require("mongodb").ObjectId;

/**
 * Add the last criteria in character's criterion
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {

    var config = applicationStorage.config;
    var raid = config.progress.raids[0];


    var paramLastArray = params.parseQueryParam(query.last, 2);
    var paramSortArray = params.parseQueryParam(query.sort, 1);


    if (paramLastArray.length > 0 && paramSortArray.length > 0) {

        var id = paramLastArray[0][0];
        var value = parseInt(paramLastArray[0][1], 10);
        var sort = paramSortArray[0][0];

        var tmpArray = [];
        if (isNaN(value)) {
            return;
        }

        var tmpObj;
        if (sort === "progress") {
            tmpObj = {};
            tmpObj["progress." + raid.name + ".score"] = {$lt: value};
            tmpArray.push(tmpObj);

            tmpObj = {};
            tmpObj["progress." + raid.name + ".score"] = value;
            tmpObj["_id"] = {$lt: new ObjectId(id)};
            tmpArray.push(tmpObj);

        } else if (sort === "ilevel") {
            tmpObj = {};
            tmpObj["bnet.items.averageItemLevelEquipped"] = {$lt: value};
            tmpArray.push(tmpObj);

            tmpObj = {};
            tmpObj["bnet.items.averageItemLevelEquipped"] = value;
            tmpObj["_id"] = {$lt: new ObjectId(id)};
            tmpArray.push(tmpObj);
        }
        else {
            tmpObj = {};
            tmpObj["ad.updated"] = {$lt: value};
            tmpArray.push(tmpObj);

            tmpObj = {};
            tmpObj["ad.updated"] = value;
            tmpObj["_id"] = {$lt: new ObjectId(id)};
            tmpArray.push(tmpObj);
        }

        if (tmpArray.length > 0) {
            if (!criteria["$and"]) {
                criteria["$and"] = [{"$or": tmpArray}];
            }
            else {
                criteria["$and"] = criteria["$and"].concat({"$or": tmpArray});
            }
        }
    }
};