angular
    .module('app.guild')
    .directive('wlfgProgressGuild', wlfgProgressGuild);

function wlfgProgressGuild() {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/guild/directive/progress/guild.progress.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {

        scope.$watch(attrs.wlfgProgressGuild, function(progress){
            if (progress) {
                scope.progress = progress;
            } else {
            }
        });
    }
}