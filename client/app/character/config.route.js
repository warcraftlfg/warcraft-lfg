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
                url: "/character/list?region&languages&faction&realm_name&realm_region&connected_realms",
                templateUrl: "app/character/character-list.html",
                controlerAs: 'vm',
                title: 'Character list',
                controller: "CharacterListController"
            })
        ;
    }
})();