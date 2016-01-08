(function() {
    'use strict';

    angular
        .module('app.character')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("character-read", {
                url: "/character/:region/:realm/:name/",
                templateUrl: "app/character/character-read.html",
                controlerAs: 'vm',
                title: 'Character Read',
                controller: "CharacterReadController"
            })
            .state("character-update", {
                url: "/character/:region/:realm/:name/update",
                templateUrl: "app/character/character-update.html",
                controlerAs: 'vm',
                title: 'Character update',
                controller: "CharacterUpdateController"
            })
            .state("character-list", {
                url: "/character/list?realm_zone&languages&faction&realm_name&realm_region&roles&classes&days&timezone&raids_per_week_active&raids_per_week_min&raids_per_week_max&transfert&lvlmax&ilevel_active&ilevel_min&ilevel_max&progress_active&progress_kill&progress_difficulty&sort",
                templateUrl: "app/character/character-list.html",
                controlerAs: 'vm',
                title: 'Character list',
                controller: "CharacterListController",
                reloadOnSearch: false
            })
        ;
    }
})();