angular
    .module('app.progress')
    .directive('wlfgProgressBoss', wlfgProgressBoss);

function wlfgProgressBoss() {
    var directive = {
        link: link,
        restrict: 'AE',
        templateUrl: 'app/progress/directive/boss/progress.boss.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.progress = angular.fromJson(attrs.progress);
        scope.progress.tooltip = "<strong>Tooltips</strong>";

        angular.forEach(scope.progress.mythic, function(value, key) {
            console.log('Value: '+value);
            console.log('Key: '+key);
            scope.progress.tooltip += 'M: ';
        });
    }

}