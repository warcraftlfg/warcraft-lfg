"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the recruitment class criteria from param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){

    var paramArray = params.parseQueryParam(query.recruitment_class,2);

    if(paramArray.length > 0){

        var recruitment = [];

        paramArray.forEach(function(param){
            if (param[0] == "tank") {
                if (param[1] == 1) {
                    recruitment.push({"ad.recruitment.tank.warrior":true});
                }
                if (param[1] == 11) {
                    recruitment.push({"ad.recruitment.tank.druid":true});
                }
                if (param[1] == 2) {
                    recruitment.push({"ad.recruitment.tank.paladin":true});
                }
                if (param[1] == 10) {
                    recruitment.push({"ad.recruitment.tank.monk":true});
                }
                if (param[1] == 6) {
                    recruitment.push({"ad.recruitment.tank.deathknight":true});
                }
            }
            if (param[0] == "heal") {
                if (param[1] == 11) {
                    recruitment.push({"ad.recruitment.heal.druid":true});
                }
                if (param[1] == 5) {
                    recruitment.push({"ad.recruitment.heal.priest": true});
                }
                if (param[1] == 2) {
                    recruitment.push({"ad.recruitment.heal.paladin":true});
                }
                if (param[1] == 7) {
                    recruitment.push({"ad.recruitment.heal.shaman":true});
                }
                if (param[1] == 10) {
                    recruitment.push({"ad.recruitment.heal.monk":true});
                }
            }
            if (param[0] == "melee_dps") {
                if (param[1] == 11) {
                    recruitment.push({"ad.recruitment.melee_dps.druid":true});
                }
                if (param[1] == 6) {
                    recruitment.push({"ad.recruitment.melee_dps.deathknight":true});
                }
                if (param[1] == 2) {
                    recruitment.push({"ad.recruitment.melee_dps.paladin":true});
                }
                if (param[1] == 10) {
                    recruitment.push({"ad.recruitment.melee_dps.monk":true});
                }
                if (param[1] == 7) {
                    recruitment.push({"ad.recruitment.melee_dps.shaman":true});
                }
                if (param[1] == 1) {
                    recruitment.push({"ad.recruitment.melee_dps.warrior":true});
                }
                if (param[1] == 4) {
                    recruitment.push({"ad.recruitment.melee_dps.rogue":true});
                }
            }
            if (param[0] == "ranged_dps") {
                if (param[1] == 11) {
                    recruitment.push({"ad.recruitment.ranged_dps.druid":true});
                }
                if (param[1] == 5) {
                    recruitment.push({"ad.recruitment.ranged_dps.priest":true});
                }
                if (param[1] == 7) {
                    recruitment.push({"ad.recruitment.ranged_dps.shaman":true});
                }
                if (param[1] == 3) {
                    recruitment.push({"ad.recruitment.ranged_dps.hunter":true});
                }
                if (param[1] == 9) {
                    recruitment.push({"ad.recruitment.ranged_dps.warlock":true});
                }
                if (param[1] == 8) {
                    recruitment.push({"ad.recruitment.ranged_dps.mage":true});
                }
            }
        });
        if(recruitment.length>0) {
            if (!criteria["$and"]) {
                criteria["$and"] = [{"$or":recruitment}];
            }
            else {
                criteria["$and"] = criteria["$and"].concat({"$or":recruitment});
            }
        }
    }

};