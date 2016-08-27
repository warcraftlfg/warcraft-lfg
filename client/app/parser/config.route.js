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
            .state("parserLockout", {
                url: "/guild/:region/:realm/:name/parser/lockout",
                templateUrl: "app/parser/parser-lockout.html",
                controlerAs: 'vm',
                title: 'WarcraftParser',
                controller: "ParserController"
            })
            .state("parserBosses", {
                url: "/guild/:region/:realm/:name/parser/bosses",
                templateUrl: "app/parser/parser-bosses.html",
                controlerAs: 'vm',
                title: 'WarcraftParser',
                controller: "ParserController"
            })
            .state("parserStuff", {
                url: "/guild/:region/:realm/:name/parser/gear",
                templateUrl: "app/parser/parser-stuff.html",
                controlerAs: 'vm',
                title: 'WarcraftParser',
                controller: "ParserController"
            })
            .state("parserWCL", {
                url: "/guild/:region/:realm/:name/parser/wcl",
                templateUrl: "app/parser/parser-wcl.html",
                controlerAs: 'vm',
                title: 'WarcraftParser',
                controller: "ParserController"
            })
        ;
    }
})();