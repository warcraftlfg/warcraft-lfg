(function () {
    'use strict';

    angular
        .module('app.guild-progress')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("guild-progress", {
                url: "/guild-progress/",
                templateUrl: "app/guild-progress/guild-progress.html",
                controlerAs: 'vm',
                title: 'Guild Progress',
                controller: "GuildProgressController"
            });
    }
})();