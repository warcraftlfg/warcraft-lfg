'use strict';

angular.module('wow-guild-recruit',['ui.router','pascalprecht.translate','btford.socket-io','mdl'])
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
            .state('home', {
                url: "/",
                templateUrl: "views/dashboard.html",
                controller: "DashboardCtrl"
            })
            .state('account', {
                url: "/account",
                templateUrl: "views/account.html",
                controller: "AccountCtrl"
            })
            .state('guild-add', {
                url: "/account/guild-add",
                templateUrl: "views/guild.add.html",
                controller: "GuildAddCtrl"
            })
            .state('character-add', {
                url: "/account/character-add",
                templateUrl: "views/character.add.html",
                controller: "CharacterAddCtrl"
            })
    });








