"use strict"

angular.module("wow-guild-recruit")
    .controller('MainCtrl', ['$scope','$translate','socket','$mdUtil','$mdSidenav',function ($scope,$translate,socket,$mdUtil,$mdSidenav) {
        $scope.setLanguage = function (key){
            $translate.use(key);
        }
        $scope.user = undefined;
        socket.on('get:user', function(user) {
            $scope.user = user;
        });
        var originatorEv;
        $scope.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        $scope.toggleRight = function() {
            $mdSidenav("left")
                .toggle();
        }


    }])
    .controller('DashboardCtrl', ['$scope','socket',function ($scope,socket) {
        $scope.guild_ads=[];

        socket.emit('get:guild-ads');

        socket.forward('get:guild-ads',$scope);
        $scope.$on('socket:get:guild-ads',function(ev,guild_ads){
            $scope.guild_ads=guild_ads;
        });
        socket.forward('add:guild-ad',$scope);
        $scope.$on('socket:add:guild-ad',function(ev,guild_ad){
            //TODO informer l'utilisateur que c'est good
            //socket.emit('get:guild-ads');
        });
    }])
    .controller('AccountCtrl', ['$scope','socket',function ($scope,socket) {

    }])
    .controller('CharacterAddCtrl', ['$scope','socket',function ($scope,socket) {
        //Initialize $scope variables
        $scope.userCharacters = null;

        socket.forward('get:bnet-characters',$scope);
        $scope.$on('socket:get:bnet-characters',function(ev,characters){
            $scope.$parent.loading = false;
            $scope.userCharacters = characters;
        });

        $scope.updateRegion = function(){
            $scope.$parent.loading = true;
            socket.emit('get:bnet-characters',$scope.region);
        }
        $scope.selectCharacter = function(character){
            $scope.character = character;

        }
    }])
    .controller("GuildAddCtrl", ["$scope","socket", "LANGUAGES","GUILD_AD",function ($scope,socket,LANGUAGES,GUILD_AD) {

        //Initialize $scope variables
        $scope.userGuilds = null;
        $scope.languages= LANGUAGES;
        $scope.guild_ad =GUILD_AD;

        socket.forward('get:bnet-guilds',$scope);
        $scope.$on('socket:get:bnet-guilds',function(ev,guilds){
            $scope.$parent.loading = false;
            $scope.userGuilds = guilds;
        });

        $scope.updateRegion = function(){
            $scope.$parent.loading = true;
            socket.emit('get:bnet-guilds',$scope.region);
        };
        $scope.selectGuild = function(guild){
            $scope.guild_ad.name = guild.name;
            $scope.guild_ad.realm = guild.realm;
            $scope.guild_ad.region = guild.region
        };
        $scope.submit = function(){
            socket.emit('add:guild-ad',$scope.guild_ad);
        };
    }]);
