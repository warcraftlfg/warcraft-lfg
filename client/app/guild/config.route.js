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
                url: "/guild/:region/:realm/:name/update",
                templateUrl: "app/guild/guild-update.html",
                controlerAs: 'vm',
                title: 'Guild update',
                controller: "GuildUpdateController"
            })
            .state("guild-list", {
                url: "/guild/list?realm_zones&languages&faction&realm_name&realm_region&connected_realms&classes&days&timezone&raids_per_week_active&raids_per_week_min&raids_per_week_max",
                templateUrl: "app/guild/guild-list.html",
                controlerAs: 'vm',
                title: 'Guild list',
                controller: "GuildListController"
            })
        ;
    }
})();