'use strict';

angular.module('wow-guild-recruit',['pascalprecht.translate','btford.socket-io'])
    .factory('socket', function (socketFactory) {
        return socketFactory();
    })
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
    .controller('MainCtrl', ['$scope','$translate','socket',function ($scope,$translate,socket) {
        $scope.setLanguage = function (key){
            $translate.use(key);
        }
        $scope.user = undefined;
        socket.on('get:user', function(user) {
            $scope.user = user;
        });


}])








