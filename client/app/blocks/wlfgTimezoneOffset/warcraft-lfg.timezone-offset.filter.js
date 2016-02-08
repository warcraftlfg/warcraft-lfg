angular
    .module('blocks.wlfgTimezoneOffset')
    .filter('wlfgTimezoneOffset', wlfgTimezoneOffset);

function wlfgTimezoneOffset() {

    return function (input) {
        var zone = moment.tz.zone(input);
        if (zone) {
            var offset = zone.parse(Date.UTC()) / 60;
            if (offset > 0) {
                return "-" + offset;
            } else {
                return "+" + offset;
            }
        }
    };
}
