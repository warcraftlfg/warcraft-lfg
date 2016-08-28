(function () {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchController', SearchController)
    ;

    SearchController.$inject = ["$scope", "$state", "$stateParams", "search", "wlfgAppTitle"];
    function SearchController($scope, $state, $stateParams, search, wlfgAppTitle) {
        wlfgAppTitle.setTitle("Search");

        console.log($stateParams.term);

    }
})();