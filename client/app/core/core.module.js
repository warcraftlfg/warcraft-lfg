(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngSanitize','ngResource',
        //'ngAnimate', 'ngRoute', 'ngSanitize',
        /*
         * Our reusable cross app code modules
         */
        'blocks.socket', 'blocks.wlfgConfirm', 'blocks.wlfgAppTitle', 'blocks.wlfgWCL', 'blocks.wlfgTimezoneOffset', 'blocks.wlfgTranslationLoader', 'blocks.preventScroll',
        'blocks.stickyFooter', 'blocks.expandable', 'blocks.templateLoader',
        /*
         * 3rd Party modules
         */
        'ui.router', 'pascalprecht.translate', 'btford.socket-io', 'angularMoment', 'infinite-scroll', 'ui.bootstrap', 'angular-ranger', 'isteven-multi-select', 'hc.marked', 'perfect_scrollbar'
    ]);
})();