(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(configure);

	function configure($translateProvider,$urlRouterProvider,$stateProvider,markedProvider) {

        //Translation Property
        $translateProvider.useStaticFilesLoader({
            prefix: "assets/locales/locale-",
            suffix: ".json"
        });
        $translateProvider.registerAvailableLanguageKeys(["en_US"], {
            "*":"en_US"
        });
        $translateProvider.preferredLanguage("en_US");
        $translateProvider.useSanitizeValueStrategy('escape');

        //Define routes
        $urlRouterProvider.otherwise("/");

        // Override markdown href
        markedProvider.setRenderer({
            link: function(href, title, text) {
                return "<a href='" + href + "'" + (title ? " title='" + title + "'" : '') + " target='_blank'>" + text + "</a>";
            }
        });
    }
})();
