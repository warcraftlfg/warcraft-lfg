angular
    .module('app.filter')
    .directive('wlfgFilterLanguage', wlfgFilterLanguage);

wlfgFilterLanguage.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterLanguage(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/zone/filter.language.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.$watch('filters.languages', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var tmpLanguages = [];
            angular.forEach($scope.filters.languages,function(language){
                tmpLanguages.push(language.id);
            });

            if (tmpLanguages.length > 0) {
                 $location.search('languages', tmpLanguages.join('__'));
            } else {
                $location.search('languages', null);
            }

            //socket.emit('get:characterAds',$scope.filters, true);
        });

        $scope.resetLanguages = function(){
            $scope.filters.languages = [];
        };
    }
}