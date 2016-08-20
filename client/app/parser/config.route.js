(function () {
    'use strict';

    angular
        .module('app.progress')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("parserDashboard", {
                url: "/parser/",
                templateUrl: "app/parser/dashboard.html",
                controlerAs: 'vm',
                title: 'WarcraftParser',
                controller: "ParserDashboardController"
            })
            .state("parser", {
                url: "/guild/:region/:realm/:name/parser/",
                templateUrl: "app/parser/parser.html",
                controlerAs: 'vm',
                title: 'WarcraftParser',
                controller: "ParserController"
            })
            .state("parserRealm", {
                url: "/parser/:region/:realm/",
                templateUrl: "app/parser/realm.html",
                controlerAs: 'vm',
                title: 'WarcraftParser',
                controller: "ParserRealmController"
            })
        ;
    }
})();