(function () {
    'use strict';

    angular
        .module('app.message')
        .directive('wlfgMessageHeightList', wlfgMessageHeightList)
    ;

    wlfgMessageHeightList.$inject = ["$window", "$timeout"];
    function wlfgMessageHeightList($window, $timeout) {
        var directive = {
            link: link,
            restrict: 'A',
        };
        return directive;

        function link(scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return { 'h': w.height(), 'w': w.width() };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.heightListStyle = function () {
                    return { 
                        'height': (newValue.h - 213) + 'px',
                    };
                };
                
            }, true);
        
            w.bind('resize', function () {
                scope.$apply();
            });
        }
    }

})();