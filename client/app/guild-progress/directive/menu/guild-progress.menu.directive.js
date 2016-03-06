angular
    .module('app.guild')
    .directive('wlfgGuildProgressMenu', wlfgGuildProgressMenu);

function wlfgGuildProgressMenu() {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/guild-progress/directive/menu/guild-progress.menu.directive.html'
    };
    return directive;

    function link($scope, element, attrs) {
        $scope.menuContentShowed = true;
    }

}