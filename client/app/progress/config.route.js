(function () {
    'use strict';

    angular
        .module('app.progress')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("progress", {
                url: "/pve/:page",
                templateUrl: "app/progress/progress.html",
                controlerAs: 'vm',
                title: 'WarcraftProgress',
                controller: "ProgressController"
            })
            .state("progressRegion", {
                url: "/pve/:region/:page",
                templateUrl: "app/progress/progress.html",
                controlerAs: 'vm',
                title: 'WarcraftProgress',
                controller: "ProgressController"
            })
            .state("progressRealm", {
                url: "/pve/:region/:realm/:page",
                templateUrl: "app/progress/progress.html",
                controlerAs: 'vm',
                title: 'WarcraftProgress',
                controller: "ProgressController"
            })

        ;
    }
})();