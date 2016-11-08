(function () {
    'use strict';

    angular
        .module('app.stats')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("stats", {
                url: "/stats/:tier/:raid",
                templateUrl: "app/stats/stats.html",
                controlerAs: 'vm',
                title: 'WarcraftProgress',
                controller: "StatsController"
            })
        ;
    }
})();