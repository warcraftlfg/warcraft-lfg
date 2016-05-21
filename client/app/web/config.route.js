(function () {
    'use strict';

    angular
        .module('app.web')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("faq", {
                url: "/faq",
                templateUrl: "app/web/faq.html",
                controllerAs: 'vm',
                title: 'About us',
                controller: "WebAboutController"
            })
            .state("legal_stuff", {
                url: "/legal-stuff",
                templateUrl: "app/web/legal-stuff.html",
                controllerAs: 'vm',
                title: 'About us',
                controller: "WebPrivacyController"
            });
    }
})();