(function () {
    'use strict';

    angular
        .module('app.parser')
        .controller('ParserDashboardController', ParserDashboardController);

    ParserDashboardController.$inject = ["$scope", "$state", "$stateParams", "$location", "guilds", "wlfgAppTitle"];
    function ParserDashboardController($scope, $state, $stateParams, $location, guilds, wlfgAppTitle) {
        wlfgAppTitle.setTitle("WarcraftParser");

        /**
         * Create a new Guild Ad
         * @param region
         * @param realm
         * @param name
         */
        $scope.createGuildAd = function (region, realm, name) {
            $scope.$parent.loading = true;
            guilds.upsert({guildRegion: region, guildRealm: realm, guildName: name, part: "ad"}, {},
                function () {
                    $state.go("guild-update", {region: region, realm: realm, name: name});
                },
                function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                });
        };
    }
})();