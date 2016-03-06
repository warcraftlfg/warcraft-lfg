(function () {
    'use strict';

    angular
        .module('app.guild')
        .controller('GuildProgressController', GuildProgressController)
    ;

    GuildProgressController.$inject = ['$scope', '$state', "wlfgAppTitle", "guilds"];
    function GuildProgressController($scope, $state, wlfgAppTitle, guilds) {
        wlfgAppTitle.setTitle("Guild Progress");

        $scope.$parent.error = null;
        $scope.$parent.loading = true;
        $scope.guilds = [];
        $scope.last = {};
        $scope.filters = {};
        $scope.filters.states = {};

        $scope.$watch('filters', function () {
            console.log($scope.filters.states);
            if ($scope.filters.states.faction  && $scope.filters.states.realm && $scope.filters.states.realmZones) {
                // && $scope.filters.states.timezone
                //socket.emit('get:guildAds', $scope.filters);
                $scope.guilds = [];
                getGuilds();
            }
        }, true);


        $scope.resetFilters = function () {
            $state.go($state.current, null, {reload: true, inherit: false});
        };

        $scope.getMoreGuilds = function () {
            if (($scope.$parent && $scope.$parent.loading) || $scope.loading) {
                return;
            }
            getGuilds();
        };


        function getGuilds() {
            $scope.loading = true;

            var params = {"rank": true, view: "detailed", number: 7};

            if ($scope.guilds.length > 0) {
                params.last = $scope.guilds[$scope.guilds.length - 1]._id + "." + $scope.guilds[$scope.guilds.length - 1].rank[Object.keys($scope.guilds[$scope.guilds.length - 1].progress)[0]].world;
            }


            angular.extend(params, $scope.filters);
            delete params.states;

            params.sort = "rank";

            guilds.query(params, function (guilds) {
                    $scope.$parent.loading = false;
                    $scope.loading = false;
                    $scope.guilds = $scope.guilds.concat(guilds);
                },
                function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                });
        }

    }
})();