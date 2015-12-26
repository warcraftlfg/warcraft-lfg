angular
    .module('app.filter')
    .directive('wlfgFilterLanguage', wlfgFilterLanguage);

wlfgFilterLanguage.$inject = ['$translate', '$stateParams', '$location', 'LANGUAGES'];
function wlfgFilterLanguage($translate, $stateParams, $location, LANGUAGES) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/zone/filter.language.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.languages = [];

        $scope.localLanguages = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_LANGUAGES")
        };

        $scope.filters.languages = [];
        initLanguages();
        function initLanguages() {
            angular.forEach(LANGUAGES, function (language) {
                var tmplng = {id: language, name: $translate.instant("LANG_" + language.toUpperCase())};
                if ($stateParams.languages && $stateParams.languages.split("__").indexOf(language) != -1) {
                    tmplng.selected = true;
                    $scope.filters.languages.push({id: language, selected: true});
                }
                $scope.languages.push(tmplng);
            });
        }

        $scope.filters.states.languages = true;

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
            $location.search('languages', null);
            $stateParams.languages = null;
            initLanguages();
            $scope.filters.languages = [];
        };
    }
}