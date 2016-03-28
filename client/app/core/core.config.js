(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(configure);

    function configure($translateProvider, $urlRouterProvider, $stateProvider, markedProvider) {

        //Translation Property
        $translateProvider.useLoader('wlfgTranslationLoader', {
                files: [{
                    languageKey: 'en',
                    localeFile: 'assets/locales/locale-en_US.json'
                }, {
                    languageKey: 'fr',
                    localeFile: 'assets/locales/locale-fr_FR.json'
                }]
            })
            .registerAvailableLanguageKeys(["en", "fr"], {
                "en*": "en",
                "fr_FR": "fr",
                "*": "en"
            })
            .fallbackLanguage('en')
            .determinePreferredLanguage()
            .useSanitizeValueStrategy('escape');


        //Define routes
        $urlRouterProvider.otherwise("/");

        // Override markdown href
        markedProvider.setRenderer({
            link: function (href, title, text) {
                return "<a href='" + href + "'" + (title ? " title='" + title + "'" : '') + " target='_blank'>" + text + "</a>";
            }
        });
    }
})();
