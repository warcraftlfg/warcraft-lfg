(function () {
    'use strict';

    angular
        .module('app.search')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("search", {
                url: "/search/?term",
                templateUrl: "app/search/search.html",
                controlerAs: 'vm',
                title: 'WarcraftHub',
                controller: "SearchController",
                reloadOnSearch: true
            })
        ;
    }
})();