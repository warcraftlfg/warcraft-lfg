(function() {
    'use strict';

    angular
        .module('app.guild')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("guild-create", {
                url: "/guild/create",
                templateUrl: "app/guild/guild-create.html",
                controllerAs: 'vm',
                title: 'Guild create',
                controller: "GuildCreateController"
            })
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
            .state("guild-delete", {
                url: "/guild/:region/:realm/:name/delete",
                templateUrl: "app/guild/guild-delete.html",
                controlerAs: 'vm',
                title: 'Guild delete',
                controller: "GuildDeleteController"
            })
            .state("guild-list", {
                url: "/guild/list",
                templateUrl: "app/guild/guild-list.html",
                controlerAs: 'vm',
                title: 'Guild list',
                controller: "GuildListController"
            })
        ;
    }
})();