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

    GuildCreate.$inject = ['$scope','socket','$state'];
    function GuildCreate($scope, socket, $state) {
        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.userGuilds = null;

        socket.forward('get:userGuilds',$scope);
        $scope.$on('socket:get:userGuilds',function(ev,guilds){
            $scope.$parent.loading = false;
            $scope.userGuilds = guilds;
        });

        socket.forward('put:guildAd',$scope);
        $scope.$on('socket:put:guildAd',function(ev,guildAd){
            $scope.$parent.loading = false;
            $state.go("guild-update",{region:guildAd.region,realm:guildAd.realm,name:guildAd.name});
        });

        $scope.updateRegion = function(){
            $scope.$parent.loading = true;
            socket.emit('get:userGuilds',$scope.region);
        };

        $scope.createGuildAd = function(region,realm,name){
            $scope.$parent.loading = true;
            socket.emit('put:guildAd',{region:region,realm:realm,name:name});
        }

    }

    GuildRead.$inject = ["$scope","socket","$state","$stateParams"];
    function GuildRead($scope,socket,$state,$stateParams) {
        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.guild_ad = null;
        $scope.$parent.loading = true;

        socket.emit('get:guildAd',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:guildAd',$scope);
        $scope.$on('socket:get:guildAd',function(ev,guildAd){
            $scope.$parent.loading = false;

            //If not exit, redirect user to dashboard
            if(guildAd==null)
                $state.go("dashboard");

            $scope.guildAd = guildAd;
        });

    }

    GuildUpdate.$inject = ["$scope","socket","$state","$stateParams","LANGUAGES"];
    function GuildUpdate($scope,socket,$state,$stateParams,LANGUAGES) {
        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.languages= LANGUAGES;
        $scope.$parent.loading = true;


        socket.emit('get:guildAd',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:guildAd',$scope);
        $scope.$on('socket:get:guildAd',function(ev,guildAd){
            $scope.$parent.loading = false;
            //If not exit, redirect user to dashboard
            if(guildAd==null)
                $state.go("dashboard");
            $scope.guildAd = guildAd;
        });

        $scope.save = function(){
            socket.emit('put:guildAd',$scope.guildAd);
            $scope.$parent.loading = true;
        };

        socket.forward('put:guildAd',$scope);
        $scope.$on('socket:put:guildAd',function(){
            $scope.$parent.loading = false;
            $state.go("account");
        });
    }

    GuildDelete.$inject = ['$scope','socket','$state','$stateParams'];
    function GuildDelete($scope, socket, $state, $stateParams) {
        //Reset error message
        $scope.$parent.error=null;

        //Initialize var
        $scope.guild_ad = {name:$stateParams.name, realm:$stateParams.realm, region:$stateParams.region};

        $scope.delete = function(){
            $scope.$parent.loading = true;
            socket.emit('delete:guildAd',$scope.guild_ad);
        };

        socket.forward('delete:guildAd',$scope);
        $scope.$on('socket:delete:guildAd',function(ev,guild_ad){
            $scope.$parent.loading = false;
            $state.go("account");
        });
    }

    GuildList.$inject = ['$scope','socket'];
    function GuildList($scope, socket) {
        
    }
})();