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
                var languageParam = $stateParams.language;

                if (languageParam){
                    if(!angular.isArray(languageParam)) {
                        languageParam = [languageParam];
                    }
                    if(languageParam.indexOf(language) != -1) {
                        tmplng.selected = true;
                        $scope.filters.language = $stateParams.language;
                    }
                }
                $scope.languages.push(tmplng);
            });
        }

        $scope.filters.states.languages = true;

        $scope.$watch('languagesOut', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var tmpLanguages = [];
            angular.forEach($scope.languagesOut,function(language){
                tmpLanguages.push(language.id);
            });

            if (tmpLanguages.length > 0) {
                $location.search('language', tmpLanguages);
            } else {
                $location.search('language', null);
            }

            $scope.filters.language = tmpLanguages;
            $scope.$parent.loading = true;
        });

        $scope.resetLanguages = function(){
            $scope.languagesOut = null;
            angular.forEach($scope.languages,function(language) {
                language.selected = false;
            });
        };
    }
}