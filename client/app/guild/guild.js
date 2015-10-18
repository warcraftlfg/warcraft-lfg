(function() {
    'use strict';

    angular
        .module('app.guild')
        .controller('GuildCreateController', GuildCreate)
        .controller('GuildReadController', GuildRead)
        .controller('GuildUpdateController', GuildUpdate)
        .controller('GuildDeleteController', GuildDelete)
        .controller('GuildListController', GuildList)
    ;

    GuildCreate.$inject = ['$scope','socket'];
    function GuildCreate($scope, socket) {
        //Reset error message
        $scope.$parent.error=null;

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
    }

    GuildRead.$inject = ["$scope","socket","$state","$stateParams"];
    function GuildRead($scope,socket,$state,$stateParams) {
        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.guild_ad = null;
        $scope.$parent.loading = true;

        socket.emit('get:guild-ad',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:guild-ad',$scope);
        $scope.$on('socket:get:guild-ad',function(ev,guild_ad){
            $scope.$parent.loading = false;
            console.log(guild_ad);

            //If not exit, redirect user to dashboard
            if(guild_ad==null)
                $state.go("dashboard");

            $scope.guild_ad = guild_ad;
        });

    }

    GuildUpdate.$inject = ["$scope","socket","$state","$stateParams","LANGUAGES","GUILD_AD"];
    function GuildUpdate($scope,socket,$state,$stateParams,LANGUAGES,GUILD_AD) {
        //Reset error message
        $scope.$parent.error=null;

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
    }

    GuildDelete.$inject = ['$scope','socket'];
    function GuildDelete($scope, socket) {
        
    }
    GuildList.$inject = ['$scope','socket'];
    function GuildList($scope, socket) {
        
    }
})();