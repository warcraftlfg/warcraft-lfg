(function() {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', Account);

    Account.$inject = ['$scope','$state', 'socket'];

    function Account($scope,$state,socket) {

        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function() {
            if($scope.$parent.user && $scope.$parent.user.logged_in===false)
                $state.go('dashboard');
        });

        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.$parent.loading = true;
        $scope.userGuilds = null;
        $scope.userCharacters = null;
        $scope.guildRegion = "";
        $scope.characterRegion = "";
        var characterIds;
        var guildIds;


        socket.emit('get:userGuildAds');
        socket.forward('get:userGuildAds',$scope);
        $scope.$on('socket:get:userGuildAds',function(ev,guildAds){
            $scope.$parent.loading = false;
            $scope.guildAds = guildAds;
        });

        socket.emit('get:userCharacterAds');
        socket.forward('get:userCharacterAds',$scope);
        $scope.$on('socket:get:userCharacterAds',function(ev,characterAds){
            $scope.$parent.loading = false;
            $scope.characterAds = characterAds;
        });

        // Guild create
        socket.forward('get:userGuilds',$scope);
        $scope.$on('socket:get:userGuilds',function(ev,guilds){
            $scope.$parent.loading = false;
            $scope.userGuilds = guilds;
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
            $state.go("guild-update",{region:guild.region,realm:guild.realm,name:guild.name});
        });

        $scope.updateGuildRegion = function(){
            if($scope.guildRegion==='')
                $scope.userGuilds = null;
            else {
                $scope.$parent.loading = true;
                socket.emit('get:userGuilds', $scope.guildRegion);
            }

        };

        $scope.createGuildAd = function(region,realm,name){
            $scope.$parent.loading = true;
            guildIds = {region:region,realm:realm,name:name};
            socket.emit('get:guild',guildIds);
        };

        //Character Create
        socket.forward('get:userCharacters',$scope);
        $scope.$on('socket:get:userCharacters',function(ev,characters){
            $scope.$parent.loading = false;
            $scope.userCharacters = characters;
        });

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
                socket.emit('get:userCharacters', $scope.characterRegion);
            }
        };

        $scope.createCharacterAd = function(region,realm,name){
            $scope.$parent.loading = true;
            characterIds = {region:region,realm:realm,name:name};
            socket.emit('get:character',characterIds);

        };
    }
})();