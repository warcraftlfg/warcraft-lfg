
'use strict';

angular.module('k1ss',['pascalprecht.translate'])
    .config(function ($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'locales/locale-',
            suffix: '.json'
        });
        $translateProvider.registerAvailableLanguageKeys(['en_US', 'fr_FR'], {
            'fr':'fr_FR',
            'en':'en_US'
        });
        $translateProvider.determinePreferredLanguage();

    })
    .controller('FooterCtrl', ['$scope','$translate',function ($scope,$translate) {
        $scope.setLanguage = function (key){
            $translate.use(key);
        }
    }]);








