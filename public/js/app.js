'use strict';

angular.module('wow-guild-recruit',["wow-guild-recruit.config","ui.router","pascalprecht.translate","btford.socket-io","angularMoment"])
    .config(function ($translateProvider,$urlRouterProvider,$stateProvider) {

        //Translation Property
        $translateProvider.useStaticFilesLoader({
            prefix: "locales/locale-",
            suffix: ".json"
        });
        $translateProvider.registerAvailableLanguageKeys(["en_US", "fr_FR"], {
            "fr":"fr_FR",
            "en":"en_US"
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.useSanitizeValueStrategy('escape');

        //Define routes
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "views/dashboard.html",
                controller: "DashboardCtrl"
            })
            .state("account", {
                url: "/account",
                templateUrl: "views/account.html",
                controller: "AccountCtrl"
            })
            .state("guildad-add", {
                url: "/account/guildad",
                templateUrl: "views/guildad-add.html",
                controller: "GuildAdAddCtrl"
            })
            .state("guildad-edit", {
                url: "/account/guildad/:region/:realm/:name",
                templateUrl: "views/guildad-edit.html",
                controller: "GuildAdEditCtrl"
            })
            .state("characterad-add", {
                url: "/account/characterad",
                templateUrl: "views/characterad-add.html",
                controller: "CharacterAdAddCtrl"
            })
            .state("characterad-edit", {
                url: "/account/characterad/:region/:realm/:name",
                templateUrl: "views/characterad-edit.html",
                controller: "CharacterAdEditCtrl"
            })
    });








