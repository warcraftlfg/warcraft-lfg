(function () {
    'use strict';

    angular
        .module('blocks.stickyFooter')
        .directive('stickyFooter', stickyFooter)
    ;

    stickyFooter.$inject = ["$window"];
    function stickyFooter($window) {
        var directive = {
            link: link,
            restrict: 'A',
        };
        return directive;

        function link(scope, element) {
            var w = angular.element($window);

            var wrapper = document.getElementById('sticky-wrapper');
            var push = document.getElementById('sticky-push');
            var footer = document.getElementById('sticky-footer');

            wrapper.style.margin = "0 auto -"+footer.offsetHeight+'px';
            push.style.height = footer.offsetHeight+'px';

            scope.getWindowDimensions = function () {
                return { 'h': w.height(), 'w': w.width() };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                wrapper.style.margin = "0 auto -"+footer.offsetHeight+'px';
                push.style.height = footer.offsetHeight+'px';
            }, true);
        
            w.bind('resize', function () {
                scope.$apply();
            });
        }
    }

})();