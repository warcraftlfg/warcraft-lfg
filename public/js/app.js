'use strict';

angular.module('wow-guild-recruit',['pascalprecht.translate','btford.socket-io'])
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

        $translateProvider.useSanitizeValueStrategy('escape');

    });








