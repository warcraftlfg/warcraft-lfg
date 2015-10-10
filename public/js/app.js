'use strict';

angular.module('wow-guild-recruit',['ui.router','pascalprecht.translate','btford.socket-io'])
    .config(function ($translateProvider,$urlRouterProvider,$stateProvider) {

        //Translation Property
        $translateProvider.useStaticFilesLoader({
            prefix: 'locales/locale-',
            suffix: '.json'
        });
        $translateProvider.registerAvailableLanguageKeys(['en_US', 'fr_FR'], {
            'fr':'fr_FR',
            'en':'en_US'
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.useSanitizeValueStrategy('escape');

        //Define routes
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('/', {
                url: "/",
                templateUrl: "views/dashboard.html",
                controller: "DashboardCtrl"
            })
            .state('/account', {
                url: "/account",
                templateUrl: "views/account.html",
                controller: "AccountCtrl"
            });


    });








