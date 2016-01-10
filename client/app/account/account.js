(function() {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', Account);

    Account.$inject = ['$scope','$state','$filter', 'socket',"wlfgAppTitle","user"];

    function Account($scope,$state,$filter,socket,wlfgAppTitle,user) {
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
        var guildIds;


        $scope.characterAds = user.query({param1:"characterAds"});
        user.query({param1:"guildAds"},function(guildAds){
            $scope.guildAds = guildAds;
            $.each(guildAds, function (i, guild) {
                if(guild.perms) {
                    guild.perms.ad.edit = $.inArray(guild.rank, guild.perms.ad.edit) !== -1;
                    guild.perms.ad.del = $.inArray(guild.rank, guild.perms.ad.del) !== -1;
                }
            });
        });


        socket.forward('get:guild',$scope);
        $scope.$on('socket:get:guild',function(ev,guild){
            if (guild && guild.ad)
                socket.emit('put:guildAd',guild);
            else{
                guildIds.ad = {};
                socket.emit('put:guildAd',guildIds);
            }
        });

        socket.forward('put:guildAd',$scope);
        $scope.$on('socket:put:guildAd',function(ev,guild){
            socket.emit('get:userGuildRank',{"region":guild.region,"realm":guild.realm,"name":guild.name});
            socket.forward('get:userGuildRank',$scope);
            $scope.$on('socket:get:userGuildRank',function(ev,rank){
                // Err on the side of caution if this is the first time we've seen this guild and
                // don't have rank info for it yet. Worst case scenario someone who isn't an
                // officer gets to update the profile for the short period of time between the ad
                // getting created and the guild being scanned for the first time.
                if (!guild.perms || rank === null || $.inArray(rank, guild.perms.ad.edit) !== -1) {
                    $state.go("guild-update",{region:guild.region,realm:guild.realm,name:guild.name});
                } else {
                    // $route.reload() is suggested, but we don't inject $route here
                    window.location.reload();
                }
            });
        });

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

        $scope.createGuildAd = function(region,realm,name){
            $scope.$parent.loading = true;
            guildIds = {region:region,realm:realm,name:name};
            //PUT GUILD AD
        };


        socket.forward('get:character',$scope);
        $scope.$on('socket:get:character',function(ev,character){
            if (character && character.ad)
                socket.emit('put:characterAd',character);
            else{
                characterIds.ad = {};
                socket.emit('put:characterAd',characterIds);
            }
        });

        socket.forward('put:characterAd',$scope);
        $scope.$on('socket:put:characterAd',function(ev,character){
            $state.go("character-update",{region:character.region,realm:character.realm,name:character.name});
        });


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

        $scope.createCharacterAd = function(region,realm,name){
            $scope.$parent.loading = true;
            characterIds = {region:region,realm:realm,name:name};
            socket.emit('get:character',characterIds);

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