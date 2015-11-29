angular
    .module('app.character')
    .directive('wlfgReputationRune', wlfgReputationRune);

function wlfgReputationRune() {
    var directive = {
        link: link,
        restrict: 'A',
        scope:true,
        templateUrl: 'app/character/character.reputation-rune.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgReputationRune, function(reputations){
            if (reputations) {
                reputations.some(function(reputation) {
                    if ((reputation.name == "Vol'jin's Headhunters" || reputation.name == "Hand of the Prophet") && reputation.standing == 7) {
                        scope.endlessRune = true;
                        return true;
                    }
                });
            }
        }, true);
    }
}