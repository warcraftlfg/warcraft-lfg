angular
    .module('app.character')
    .directive('wlfgProgress', wlfgProgress);

function wlfgProgress() {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/character/character.progress.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgProgress, function(progression){
            if (progression) {
                console.log(progression);
            }
        });
    }
}