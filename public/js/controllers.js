"use strict"

angular.module("wow-guild-recruit")
    .controller('MainCtrl', ['$scope','$translate','socket',function ($scope,$translate,socket) {
        $scope.setLanguage = function (key){
            $translate.use(key);
        }
        $scope.user = undefined;
        socket.on('get:user', function(user) {
            $scope.user = user;
        });

        socket.on('global:error', function(error) {
            $scope.error = error;
            $scope.loading=false;
        });



    }])
    .controller('DashboardCtrl', ['$scope','socket',function ($scope,socket) {
        //Reset error message
        $scope.$parent.error = null

        //Initialize $scope variables
        $scope.guild_ads = [];
        $scope.character_ads = [];

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

        socket.emit('get:character-ads');
        socket.forward('get:character-ads',$scope);
        $scope.$on('socket:get:character-ads',function(ev,character_ads){
            $scope.character_ads=character_ads;
        });
    }])
    .controller('AccountCtrl', ['$scope','socket',function ($scope,socket) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.$parent.loading = true;

        socket.emit('get:user-guild-ads');
        socket.forward('get:user-guild-ads',$scope);
        $scope.$on('socket:get:user-guild-ads',function(ev,guild_ads){
            $scope.$parent.loading = false;
            $scope.guild_ads = guild_ads;
        });

        socket.emit('get:user-character-ads');
        socket.forward('get:user-character-ads',$scope);
        $scope.$on('socket:get:user-character-ads',function(ev,character_ads){
            $scope.$parent.loading = false;
            $scope.character_ads = character_ads;
        });


    }])
    .controller('CharacterAdAddCtrl', ['$scope','socket',function ($scope,socket) {
        //Reset error message
        $scope.$parent.error=null

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
    .controller("CharacterAdEditCtrl", ["$scope","socket","$state","$stateParams","LANGUAGES","CHARACTER_AD",function ($scope,socket,$state,$stateParams,LANGUAGES,CHARACTER_AD) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.languages= LANGUAGES;
        $scope.character_ad = CHARACTER_AD;
        $scope.$parent.loading = true;

        socket.emit('get:character-ad',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:character-ad',$scope);
        $scope.$on('socket:get:character-ad',function(ev,character_ad){
            $scope.character_ad = angular.merge({},CHARACTER_AD,character_ad);
            if (!character_ad){
                $scope.character_ad.name = $stateParams.name;
                $scope.character_ad.realm = $stateParams.realm;
                $scope.character_ad.region = $stateParams.region;
            }
            $scope.$parent.loading = false;

        });

        $scope.save = function(){
            socket.emit('add:character-ad',$scope.character_ad);
            $scope.$parent.loading = true;
        };

        socket.forward('add:character-ad',$scope);
        $scope.$on('socket:add:character-ad',function(ev,character_ad){
            $scope.$parent.loading = false;
            $state.go("account");
        });
    }])
    .controller("CharacterAdCtrl", ["$scope","socket","$state","$stateParams","LANGUAGES","CHARACTER_AD",function ($scope,socket,$state,$stateParams,LANGUAGES,CHARACTER_AD) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.languages= LANGUAGES;
        $scope.character_ad = CHARACTER_AD;
        $scope.$parent.loading = true;

        socket.emit('get:character-ad',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:character-ad',$scope);
        $scope.$on('socket:get:character-ad',function(ev,character_ad){
            $scope.character_ad = angular.merge({},CHARACTER_AD,character_ad);

            // TODO Throw 404
            $scope.$parent.loading = false;

        });
    }])
    .controller("GuildAdAddCtrl", ["$scope","socket",function ($scope,socket) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.userGuilds = null;

        socket.forward('get:bnet-guilds',$scope);
        $scope.$on('socket:get:bnet-guilds',function(ev,guilds){
            $scope.$parent.loading = false;
            $scope.userGuilds = guilds;
        });

        $scope.updateRegion = function(){
            $scope.$parent.loading = true;
            socket.emit('get:bnet-guilds',$scope.region);
        };
    }])
    .controller("GuildAdEditCtrl", ["$scope","socket","$state","$stateParams","LANGUAGES","GUILD_AD",function ($scope,socket,$state,$stateParams,LANGUAGES,GUILD_AD) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.languages= LANGUAGES;
        $scope.guild_ad = GUILD_AD;
        $scope.$parent.loading = true;


        socket.emit('get:guild-ad',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:guild-ad',$scope);
        $scope.$on('socket:get:guild-ad',function(ev,guild_ad){
            $scope.guild_ad = angular.merge({},GUILD_AD,guild_ad);
            if (!guild_ad){
                $scope.guild_ad.name = $stateParams.name;
                $scope.guild_ad.realm = $stateParams.realm;
                $scope.guild_ad.region = $stateParams.region;
            }
            $scope.$parent.loading = false;

        });

        $scope.save = function(){
            socket.emit('add:guild-ad',$scope.guild_ad);
            $scope.$parent.loading = true;
        };

        socket.forward('add:guild-ad',$scope);
        $scope.$on('socket:add:guild-ad',function(ev,guild_ad){
            $scope.$parent.loading = false;
            $state.go("account");
        });
    }]);
