angular
    .module('app.character')
    .directive('wlfgChallengeMedal', wlfgChallengeMedal);

function wlfgChallengeMedal() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/directive/challenge/character.challenge-medal.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgChallengeMedal, function(challenge){
            if (challenge && challenge[attrs.medalType]) {
                scope.medalCount = challenge[attrs.medalType];
            } else {
                scope.medalCount = null;
            }

        }, true);
    }
}