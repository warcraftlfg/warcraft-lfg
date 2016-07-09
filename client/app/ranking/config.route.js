(function () {
    'use strict';

    angular
        .module('app.ranking')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("ranking", {
                url: "/ranking",
                templateUrl: "app/ranking/ranking.html",
                controlerAs: 'vm',
                title: 'Ranking',
                controller: "RankingController"
            });
    }
})();