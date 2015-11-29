angular
    .module('blocks.socket')
    .directive('wlfgConvertToNumber', wlfgConvertToNumber);

function wlfgConvertToNumber() {
    var directive =  {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function(val) {
                return '' + val;
            });
        }
    };
    return directive;
}