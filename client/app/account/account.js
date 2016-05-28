(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', Account);

    Account.$inject = ['$scope', '$state', '$filter', "wlfgAppTitle", "user", "guilds", "characters"];

    function Account($scope, $state, $filter, wlfgAppTitle, user, guilds, characters) {
        wlfgAppTitle.setTitle('Account');

        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function () {
            if ($scope.$parent.user && $scope.$parent.user.logged_in === false) {
                $state.go('dashboard');
            }
        });

        //Reset error message
        $scope.$parent.error = null;

        //Initialize $scope variables
        $scope.userGuilds = null;
        $scope.userCharacters = null;
        $scope.guildRegion = "";
        $scope.characterRegion = "";


        //Load Guilds & Characters
        getGuildAds();
        getCharacterAds();

        /**
         * Get user's characterAds
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
         * Get user's characterAds
         */
        function getCharacterAds() {
            $scope.$parent.loading = true;
            user.query({param: "characterAds"}, function (characterAds) {
                $scope.characterAds = characterAds;
                $scope.$parent.loading = false;
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

        /**
         * Create a new Character Ad
         * @param region
         * @param realm
         * @param name
         */
        $scope.createCharacterAd = function (region, realm, name) {
            $scope.$parent.loading = true;
            characters.upsert({characterRegion: region, characterRealm: realm, characterName: name, part: "ad"}, {},
                function () {
                    $state.go("character-update", {region: region, realm: realm, name: name});
                },
                function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                }
            );

        };

        $scope.deleteCharacterAd = function (region, realm, name) {
            $scope.$parent.loading = true;
            characters.delete({characterRegion: region, characterRealm: realm, characterName: name, part: "ad"}, {},
                function () {
                    getCharacterAds();
                },
                function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                }
            );
        };

        $scope.deleteGuildAd = function (region, realm, name) {
            $scope.$parent.loading = true;
            guilds.delete({guildRegion: region, guildRealm: realm, guildName: name, part: "ad"}, {},
                function () {
                    getGuildAds();
                },
                function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                }
            );

        };

        $scope.saveUser = function () {

            //$scope.$parent.loading = true;
            user.update({param: "profile"}, $scope.user, function (user) {
                $scope.$parent.loading = false;
                $scope.$parent.user = user;
            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
            
        };
    }
})();