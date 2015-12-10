angular
    .module('app.character')
    .directive('wlfgChallengeInstance', wlfgChallengeInstance);

function wlfgChallengeInstance() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/directive/challenge/character.challenge-instance.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgChallengeInstance, function(records){
            if (records) {
                records.forEach(function(record) {
                    if (record.map && record.map.id == parseInt(attrs.instanceId,10)) {
                        scope.record = record;
                    }
                });
            }
        }, true);
    }
}