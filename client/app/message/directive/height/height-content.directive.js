(function () {
    'use strict';

    angular
        .module('app.message')
        .directive('wlfgMessageHeightContent', wlfgMessageHeightContent)
    ;

    wlfgMessageHeightContent.$inject = ["$window", "$timeout"];
    function wlfgMessageHeightContent($window, $timeout) {
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
                scope.heightContentStyle = function () {
                    return { 
                        'height': (newValue.h - 268) + 'px',
                    };
                };
                
            }, true);
        
            w.bind('resize', function () {
                scope.$apply();
            });
        }
    }

})();