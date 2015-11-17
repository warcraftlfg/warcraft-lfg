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
            .state("character-delete", {
                url: "/character/:region/:realm/:name/delete",
                templateUrl: "app/character/character-delete.html",
                controlerAs: 'vm',
                title: 'Character delete',
                controller: "CharacterDeleteController"
            })
            .state("character-list", {
                url: "/character/list?region&language",
                templateUrl: "app/character/character-list.html",
                controlerAs: 'vm',
                title: 'Character list',
                controller: "CharacterListController"
            })
        ;
    }
})();