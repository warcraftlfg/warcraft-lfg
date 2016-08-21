(function() {
    'use strict';

    angular
        .module('app.redirect')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("redirect", {
                url: "/redirect",
                controlerAs: 'vm',
                title: 'Redirect after OAuth',
                controller: "RedirectController"
            })
        ;
    }
})();