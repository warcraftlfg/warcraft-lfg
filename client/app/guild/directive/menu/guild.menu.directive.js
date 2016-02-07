angular
    .module('app.guild')
    .directive('wlfgGuildMenu', wlfgGuildMenu);

function wlfgGuildMenu() {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/guild/directive/menu/guild.menu.directive.html'
    };
    return directive;

    function link($scope, element, attrs) {
        $scope.menuContentShowed = true;
    }

}