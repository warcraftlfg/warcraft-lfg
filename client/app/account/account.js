(function() {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', Account);

    Account.$inject = ['$scope','$state','$filter', 'socket',"wlfgAppTitle","user","guilds","characters"];

    function Account($scope,$state,$filter,socket,wlfgAppTitle,user,guilds,characters) {
        wlfgAppTitle.setTitle('Account');

        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function() {
            if($scope.$parent.user && $scope.$parent.user.logged_in===false)
                $state.go('dashboard');
        });

        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        //$scope.$parent.loading = true;
        $scope.userGuilds = null;
        $scope.userCharacters = null;
        $scope.guildRegion = "";
        $scope.characterRegion = "";
        var characterIds;


        //Get CharacterAds
        user.query({param1:"characterAds"}, function (characterAds) {
            $scope.characterAds = characterAds;
        },function(error){
            $scope.$parent.error = error.data;
        });

        //Get GuildAds
        user.query({param1: "guildAds"}, function (guildAds) {
            $scope.guildAds = guildAds;
            $.each(guildAds, function (i, guild) {
                if (guild.perms) {
                    guild.perms.ad.edit = $.inArray(guild.rank, guild.perms.ad.edit) !== -1;
                    guild.perms.ad.del = $.inArray(guild.rank, guild.perms.ad.del) !== -1;
                }
                else {
                    guild.perms={ad:{}};
                    guild.perms.ad.edit = true;
                    guild.perms.ad.del = true;
                }
            });
        },function(error){
            $scope.$parent.error = error.data;
        });


        /**
         * Get user's guilds by region
         */
        $scope.updateGuildRegion = function(){
            if($scope.guildRegion==='')
                $scope.userGuilds = null;
            else {
                $scope.$parent.loading = true;
                $scope.userGuilds = user.query({param1:"guilds",param2:$scope.guildRegion},function(){
                    $scope.$parent.loading = false;
                });
            }
        };

        /**
         * Get user's characters  by region
         */
        $scope.updateCharacterRegion = function(){
            if($scope.characterRegion==='')
                $scope.userCharacters = null;
            else {
                $scope.$parent.loading = true;
                user.query({param1:"characters",param2:$scope.characterRegion},function(characters){
                    $scope.userCharacters = $filter('orderBy')(  characters, ['-level','name']);
                    $scope.$parent.loading = false;
                });
            }
        };


        /**
         * Create a new Guild Ad
         * @param region
         * @param realm
         * @param name
         */
        $scope.createGuildAd = function(region,realm,name) {
            $scope.$parent.loading = true;
            guilds.upsert({guildRegion: region, guildRealm: realm, guildName: name}, {},
                function () {
                    $state.go("guild-update", {region: region, realm: realm, name: name});
                },
                function(error){
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
        $scope.createCharacterAd = function(region,realm,name){
            $scope.$parent.loading = true;
            characters.upsert({guildRegion: region, guildRealm: realm, guildName: name}, {},
                function () {
                    $state.go("character-update", {region: region, realm: realm, name: name});
                },
                function(error){
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                });

        };

        $scope.deleteCharacterAd = function(region,realm,name){
            $scope.$parent.loading = true;
            socket.emit('delete:characterAd',{region:region,realm:realm,name:name});
        };

        socket.forward('delete:characterAd',$scope);
        $scope.$on('socket:delete:characterAd',function(){
            socket.emit('get:userCharacterAds');
        });


        $scope.deleteGuildAd = function(region,realm,name){
            $scope.$parent.loading = true;
            socket.emit('delete:guildAd',{region:region,realm:realm,name:name});
        };

        socket.forward('delete:guildAd',$scope);
        $scope.$on('socket:delete:guildAd',function(){
            socket.emit('get:userGuildAds');
        });
    }
})();