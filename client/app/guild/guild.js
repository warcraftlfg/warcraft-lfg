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


        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function() {
            if($scope.$parent.user && $scope.$parent.user.logged_in===false)
                $state.go('dashboard');
        });

        //Initialize $scope variables
        $scope.userGuilds = null;

        var guildIds;

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

        $scope.updateRegion = function(){
            $scope.$parent.loading = true;
            socket.emit('get:userGuilds',$scope.region);
        };

        $scope.createGuildAd = function(region,realm,name){
            $scope.$parent.loading = true;
            guildIds = {region:region,realm:realm,name:name};
            socket.emit('get:guild',guildIds);
        };

    }

    GuildRead.$inject = ["$scope","socket","$state","$stateParams"];
    function GuildRead($scope,socket,$state,$stateParams) {
        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.guild_ad = null;
        $scope.$parent.loading = true;

        socket.emit('get:guild',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:guild',$scope);
        $scope.$on('socket:get:guild',function(ev,guild){
            $scope.$parent.loading = false;
            $scope.guild = guild;
        });

        $scope.updateGuild = function(){
            $scope.$parent.loading = true;
            socket.emit('update:guild',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});
        };

        socket.forward('update:guild',$scope);
        $scope.$on('socket:update:guild',function(ev,queuePosition){
            $scope.queuePosition = queuePosition;
            $scope.$parent.loading = false;

        });


    }

    GuildUpdate.$inject = ["$scope","socket","$state","$stateParams","LANGUAGES"];
    function GuildUpdate($scope,socket,$state,$stateParams,LANGUAGES) {
        //Reset error message
        $scope.$parent.error=null;

        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function() {
            if($scope.$parent.user && $scope.$parent.user.logged_in===false)
                $state.go('dashboard');
        });


        //Initialize $scope variables
        $scope.languages= LANGUAGES;
        $scope.$parent.loading = true;


        socket.emit('get:guild',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:guild',$scope);
        $scope.$on('socket:get:guild',function(ev,guild){
            $scope.$parent.loading = false;
            //If not exit, redirect user to dashboard
            if(guild===null)
                $state.go("dashboard");
            $scope.guild = guild;
        });

        $scope.save = function(){
            socket.emit('put:guildAd',$scope.guild);
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


        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function() {
            if($scope.$parent.user && $scope.$parent.user.logged_in===false)
                $state.go('dashboard');
        });

        //Initialize var
        $scope.guild = {name:$stateParams.name, realm:$stateParams.realm, region:$stateParams.region};

        $scope.delete = function(){
            $scope.$parent.loading = true;
            socket.emit('delete:guildAd',$scope.guild);
        };

        socket.forward('delete:guildAd',$scope);
        $scope.$on('socket:delete:guildAd',function(ev,guild){
            $scope.$parent.loading = false;
            $state.go("account");
        });
    }

    GuildList.$inject = ['$scope','$stateParams','socket'];
    function GuildList($scope, $stateParams, socket) {

        $scope.$parent.error=null;
        $scope.$parent.loading = true;
        $scope.guilds = [];
        $scope.loading = false;

        $scope.filters = {};

        /* if params load filters */
        if($stateParams.region)
            $scope.filters.region = $stateParams.region;
        if($stateParams.language)
            $scope.filters.language = $stateParams.language;

        $scope.getMoreGuilds = function(){
            if($scope.loading)
                return;

            $scope.loading = true;
            if($scope.guilds.length>0)
                $scope.filters.last = $scope.guilds[$scope.guilds.length-1].ad.updated;
            socket.emit('get:guildAds',$scope.filters);
        };

        $scope.updateFilters = function(){
            $scope.$parent.loading = true;
            $scope.filters.last = null;
            $scope.guilds =[];
            socket.emit('get:guildAds',$scope.filters);

        };

        socket.forward('get:guildAds',$scope);
        $scope.$on('socket:get:guildAds',function(ev,guilds){
            $scope.loading = false;
            $scope.$parent.loading = false;
            $scope.guilds = $scope.guilds.concat(guilds);
        });

        
    }
})();