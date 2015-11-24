(function() {
    'use strict';

    angular
        .module('app.web')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("about", {
                url: "/about",
                templateUrl: "app/web/about.html",
                controllerAs: 'vm',
                title: 'About us',
                controller: "WebAboutController"
            })
            .state("contact", {
                url: "/contact",
                templateUrl: "app/web/contact.html",
                controllerAs: 'vm',
                title: 'About us',
                controller: "WebContactController"
            })
            .state("privacy", {
                url: "/privacy",
                templateUrl: "app/web/privacy.html",
                controllerAs: 'vm',
                title: 'About us',
                controller: "WebPrivacyController"
            })
            .state("terms", {
                url: "/terms",
                templateUrl: "app/web/terms.html",
                controllerAs: 'vm',
                title: 'About us',
                controller: "WebTermsController"
            })
            .state("cookies", {
                url: "/cookies",
                templateUrl: "app/web/cookies.html",
                controllerAs: 'vm',
                title: 'About us',
                controller: "WebCookiesController"
            })
        ;
    }
})();