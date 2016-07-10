(function () {
    'use strict';

    angular
        .module('blocks.expandable')
        .directive('expandable', expandable)
    ;

    expandable.$inject = [];
    function expandable() {
        var directive = {
            link: link,
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            var target = document.getElementById(attrs.target);

            var expandableCallback = function() {
                if (target.style.height == "auto") {
                    target.style.height = attrs.height+'px';
                    element.removeClass('expandable-open')
                } else {
                    target.style.height = "auto";
                    element.addClass('expandable-open');
                }
            }

            if (target.offsetHeight > 300) {
                target.style.height = attrs.height+'px';
                element.on('click', expandableCallback);
            } else {
                element.addClass('hide');
            }

        }
    }

})();