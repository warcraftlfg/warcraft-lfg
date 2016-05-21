(function () {
    'use strict';

    angular
        .module('blocks.preventScroll')
        .directive('preventScroll', preventScroll)
    ;

    preventScroll.$inject = [];
    function preventScroll() {
        var directive = {
            link: link,
            restrict: 'A',
        };
        return directive;

        function link(scope, element) {
            element.bind('mousewheel DOMMouseScroll', function ( e ) {
                var e0 = e.originalEvent;
                var delta = e0.wheelDelta || -e0.detail;
                
                this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                e.preventDefault();
            });
        }
    }

})();