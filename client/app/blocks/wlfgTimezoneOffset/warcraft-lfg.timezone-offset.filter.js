angular
    .module('blocks.wlfgTimezoneOffset')
    .filter('wlfgTimezoneOffset', wlfgTimezoneOffset);

function wlfgTimezoneOffset() {

    return function (input) {
        var zone = moment.tz.zone(input);
        if (zone) {
            var offset = zone.parse(moment.utc()) / 60;
            if (offset > 0) {
                return "-" + Math.abs(offset);
            } else {
                return "+" + Math.abs(offset);
            }
        }
    };
}
