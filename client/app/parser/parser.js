(function () {
    'use strict';

    angular
        .module('app.parser')
        .controller('ParserDashboardController', ParserDashboardController)
        .controller('ParserController', ParserController)
    ;

    ParserDashboardController.$inject = ["$scope", "$state", "$stateParams", "$location", "guilds", "user", "wlfgAppTitle"];
    function ParserDashboardController($scope, $state, $stateParams, $location, guilds, user, wlfgAppTitle) {
        wlfgAppTitle.setTitle("WarcraftParser");

        $scope.fakeTimestamp = new Date().getTime();

        getGuildAds();

        /**
         * Get user's guildAds
         */
        function getGuildAds() {
            $scope.$parent.loading = true;
            user.query({param: "guildAds"}, function (guildAds) {
                $scope.guildAds = guildAds;
                $scope.$parent.loading = false;
                $.each(guildAds, function (i, guild) {
                    if (guild.perms) {
                        guild.perms.ad.edit = $.inArray(guild.rank, guild.perms.ad.edit) !== -1;
                        guild.perms.ad.del = $.inArray(guild.rank, guild.perms.ad.del) !== -1;
                    }
                    else {
                        guild.perms = {ad: {}};
                        guild.perms.ad.edit = true;
                        guild.perms.ad.del = true;
                    }
                });
            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        }

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

    ParserController.$inject = ["$scope", "$state", "$stateParams", "$location", "wlfgAppTitle", "guilds", "updates", "user", "moment", "__env"];
    function ParserController($scope, $state, $stateParams, $location, wlfgAppTitle, guilds, updates, user, moment, __env) {
        wlfgAppTitle.setTitle($stateParams.name + ' @ ' + $stateParams.realm + ' (' + $stateParams.region.toUpperCase() + ')');

        $scope.$parent.error = null;
        $scope.$parent.loading = true;

        $scope.route = $state.current.name;

        $scope.current_url = window.encodeURIComponent($location.absUrl());
        $scope.ilvlColor = __env.ilvlColor;
        $scope.sort = 'name';

        $scope.lastReset = getLastDay();
        $scope.raid = __env.tiers[__env.tiers.current];
        $scope.currentTier = __env.tiers.current;

        $scope.difficulty = "normalTimestamp";

        $scope.guildParser = [];

        guilds.get({
                "guildRegion": $stateParams.region,
                "guildRealm": $stateParams.realm,
                "guildName": $stateParams.name
            }, function (guild) {
                $scope.guild = guild;
                $scope.$parent.loading = false;
                if (guild && !guild.perms) {
                    //No perms set everyone can edit.
                    $scope.userCanEdit = true;
                } else {
                    if (guild.bnet && $scope.$parent.user && $scope.$parent.user.id) {
                        $scope.$parent.loading = true;
                        user.get({
                            param: "guildRank",
                            region: $stateParams.region,
                            realm: $stateParams.realm,
                            name: $stateParams.name
                        }, function (data) {
                            if (data && guild && guild.perms && guild.perms.ad && guild.perms.ad.edit) {
                                $scope.userCanEdit = $.inArray(data.rank, guild.perms.ad.edit) !== -1;
                            }

                            $scope.$parent.loading = false;
                        });
                    }
                }
            },
            function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            }
        );

        $scope.loading = true;

        guilds.query({part: "parser", "guildRegion": $stateParams.region, "guildRealm": $stateParams.realm, "guildName": $stateParams.name
            }, function(guildParser) {
                $scope.loading = false;
                $scope.guildParser = guildParser;

                if (guildParser.length <= 0) {
                    $scope.noResult = true;
                } else {
                    $scope.noResult = false;
                }
            }, function (error) {
                //$scope.$parent.error = error.data;
                $scope.guildParser = [];
                $scope.loading = false;
                $scope.noResult = true;
            }
        );

        $scope.updateGuild = function () {
            $scope.$parent.loading = true;
            updates.post({
                type: "guild",
                region: $stateParams.region,
                realm: $stateParams.realm,
                name: $stateParams.name
            }, function (queuePosition) {
                $scope.queuePosition = queuePosition;
                $scope.$parent.loading = false;

            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        };

        $scope.switchSort = function(value) {
            if ($scope.sort === value) {
                value = '-'+value;
            }
            
            $scope.sort = value;
        };
    }

    function getLastDay(region) {
        var today = new Date();
        var object;

        var data = {day: "Wednesday", number: 4};

        object = moment().day(-4);
        object.set({'hour': 9, 'minute': 0, 'second': 0});

        return object;
    }
})();