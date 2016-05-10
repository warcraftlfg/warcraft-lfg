var applicationStorage = process.require("core/applicationStorage.js");
/**
 * Increment message count
 * @param id
 * @param objId1
 * @param objId2
 * @param callback
 */
module.exports.incrementCount = function (id, objId1, objId2, callback) {
    var objIds = [objId1, objId2].sort();
    //Upsert
    var collection = applicationStorage.mongo.collection("conversations");
    collection.update({id: id, objIds: objIds}, {$inc: {count: 1}}, {upsert: true}, function (error, result) {
        callback(error, result);
    });
};

/**
 * Reset the unread message count
 * @param id
 * @param objId1
 * @param objId2
 * @param callback
 */
module.exports.resetCount = function (id, objId1, objId2, callback) {
    var objIds = [objId1, objId2].sort();

    var now = new Date().getTime();

    var collection = applicationStorage.mongo.collection("conversations");
    collection.update({id: id, objIds: objIds}, {
        $set: {
            count: 0,
            last: now
        }
    }, {upsert: true}, function (error, result) {
        callback(error, result);
    });
};

/**
 * Return the unreadMessageCount
 * @param id
 * @param callback
 */
module.exports.getCount = function (id, callback) {
    var collection = applicationStorage.mongo.collection("conversations");
    collection.aggregate([
            {$match: {id: id}},
            {
                $group: {
                    _id: {id: "$id"},
                    count: {$sum: "$count"}
                }
            },
            {
                $project: {_id: 0, count: 1}
            }
        ],
        function (error, count) {
            callback(error, count)
        }
    );

};

/**
 * Get one conversation
 * @param criteria
 * @param projection
 * @param callback
 */
module.exports.findOne = function (criteria, projection, callback) {
    var collection = applicationStorage.mongo.collection("conversations");
    collection.findOne(criteria, projection, function (error, conversation) {
        callback(error, conversation);
    });

};

