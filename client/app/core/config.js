(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(configure);

	function configure($translateProvider,$urlRouterProvider,$stateProvider) {

        //Translation Property
        $translateProvider.useStaticFilesLoader({
            prefix: "assets/locales/locale-",
            suffix: ".json"
        });
        $translateProvider.registerAvailableLanguageKeys(["en_US"], {
            "en":"en_US"
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.useSanitizeValueStrategy('escape');

        //Define routes
        $urlRouterProvider.otherwise("/");
    }
    
})();
