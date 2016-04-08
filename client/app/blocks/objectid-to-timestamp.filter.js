angular
    .module('blocks.socket')
    .filter('wlfgObjectIdToTimestamp', wlfgObjectIdToTimestamp);

function wlfgObjectIdToTimestamp() {

    return function (objectID) {
        return parseInt(("" + objectID).substr(0, 8), 16) * 1000;
    };
}


