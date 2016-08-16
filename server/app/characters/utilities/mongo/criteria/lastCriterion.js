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


    var paramLastArray = params.parseQueryParam(query.last, 3);
    var paramSortArray = params.parseQueryParam(query.sort, 1);

    if (paramLastArray.length > 0 && paramSortArray.length > 0) {

        var type = paramLastArray[0][0];
        var id = paramLastArray[0][1];
        var value = parseInt(paramLastArray[0][2], 10);
        var sort = paramSortArray[0][0];

        var tmpArray = [];
        if (isNaN(value)) {
            return;
        }

        var tmpObj;
        if (sort === "ilevel") {
            tmpObj = {};
            if (type == "max") {
                tmpObj["bnet.items.averageItemLevelEquipped"] = {$lt: value};
            } else {
                tmpObj["bnet.items.averageItemLevelEquipped"] = {$lt: value};
            }
            tmpArray.push(tmpObj);

            tmpObj = {};
            tmpObj["bnet.items.averageItemLevelEquipped"] = value;
            if (type == "max") {
                tmpObj["_id"] = {$gt: new ObjectId(id)};
            } else {
                tmpObj["_id"] = {$lt: new ObjectId(id)};
            }
            tmpArray.push(tmpObj);
        }
        else if (sort === "progress") {
            tmpObj = {};
            if (type == "max") {
                tmpObj["progress.score"] = {$gt: value};
            } else {
                tmpObj["progress.score"] = {$lt: value};
            }
            tmpArray.push(tmpObj);

            tmpObj = {};
            tmpObj["progress.score"] = value;
            if (type == "max") {
                tmpObj["_id"] = {$gt: new ObjectId(id)};
            } else {
                tmpObj["_id"] = {$lt: new ObjectId(id)};
            }
            tmpArray.push(tmpObj);

        } else {
            tmpObj = {};
            if (type == "max") {
                tmpObj["ad.updated"] = {$gt: value};
            } else {
                tmpObj["ad.updated"] = {$lt: value};
            }
            tmpArray.push(tmpObj);

            tmpObj = {};
            tmpObj["ad.updated"] = value;
            if (type == "max") {
                tmpObj["_id"] = {$gt: new ObjectId(id)};
            } else {
                tmpObj["_id"] = {$lt: new ObjectId(id)};
            }
            tmpArray.push(tmpObj);
        }

        console.log(tmpArray);

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