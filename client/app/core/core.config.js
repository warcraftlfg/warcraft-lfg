(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(configure);

    function configure($httpProvider, $translateProvider, $urlRouterProvider, $stateProvider, $locationProvider, $uibTooltipProvider, $urlMatcherFactoryProvider, markedProvider, __env) {
        $httpProvider.defaults.withCredentials = true;

        // Remove hashtag from url
        if (__env.html5) {
            $locationProvider.html5Mode(true);
        }

        if (window.innerWidth < 992) {
            var options = {
                trigger: 'dontTrigger' // default dummy trigger event to show tooltips
            };

            $uibTooltipProvider.options(options);
        }

        //Translation Property
        $translateProvider.useLoader('wlfgTranslationLoader', {
                files: [{
                    languageKey: 'en',
                    localeFile: 'assets/locales/locale-en_US.json'
                }, {
                    languageKey: 'fr',
                    localeFile: 'assets/locales/locale-fr_FR.json'
                }, {
                    languageKey: 'de',
                    localeFile: 'assets/locales/locale-de_DE.json'
                }, {
                    languageKey: 'ru',
                    localeFile: 'assets/locales/locale-ru_RU.json'
                }]
            })
            .registerAvailableLanguageKeys(["en", "fr", "de", "ru"], {
                "en*": "en",
                "fr_FR": "fr",
                "de_DE": "de",
                "ru_RU": "ru",
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
