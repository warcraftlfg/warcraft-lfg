(function() {
    'use strict';

    angular
        .module('app.guild')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("guild-read", {
                url: "/guild/:region/:realm/:name/",
                templateUrl: "app/guild/guild-read.html",
                controlerAs: 'vm',
                title: 'Guild Read',
                controller: "GuildReadController"
            })
            .state("guild-update", {
                url: "/guild/:region/:realm/:name/update?parser",
                templateUrl: "app/guild/guild-update.html",
                controlerAs: 'vm',
                title: 'Guild update',
                controller: "GuildUpdateController"
            })
            .state("guild-list", {
                url: "/guild/list/:page?realm_zone&language&faction&realm&class&day&timezone&raids_per_week&progress&sort&role",
                templateUrl: "app/guild/guild-list.html",
                controlerAs: 'vm',
                title: 'Guild list',
                controller: "GuildListController",
                reloadOnSearch: false
            })
        ;
    }
})();