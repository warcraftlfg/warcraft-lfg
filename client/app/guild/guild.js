(function() {
    'use strict';

    angular
        .module('app.guild')
        .controller('GuildReadController', GuildRead)
        .controller('GuildUpdateController', GuildUpdate)
        .controller('GuildDeleteController', GuildDelete)
        .controller('GuildListController', GuildList)
    ;

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
        $scope.guildAd = {name:$stateParams.name, realm:$stateParams.realm, region:$stateParams.region};

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

    GuildList.$inject = ['$scope','$stateParams','socket','LANGUAGES'];
    function GuildList($scope, $stateParams, socket,LANGUAGES) {

        $scope.$parent.error=null;
        $scope.guilds = [];
        $scope.languages = LANGUAGES;

        $scope.filters = {};
        $scope.filters.faction = "";
        $scope.filters.region = "";
        $scope.filters.language ="";
        $scope.filters.classes = {1:true,2:true,3:true,4:true,5:true,6:true,7:true,8:true,9:true,10:true,11:true};
        $scope.filters.role = "";
        $scope.filters.raids_per_week = {min:1,max:7};

        /* if params load filters */
        if($stateParams.region)
            $scope.filters.region = $stateParams.region;
        if($stateParams.language)
            $scope.filters.language = $stateParams.language;
        if($stateParams.faction)
            $scope.filters.faction = $stateParams.faction;

        $scope.$watch('filters.raids_per_week.min', function() {
            $scope.updateFilters();
        });
        $scope.$watch('filters.raids_per_week.max', function() {
            $scope.updateFilters();
        });

        $scope.getMoreGuilds = function(){
            if($scope.$parent.loading || $scope.loading)
                return;

            $scope.loading = true;
            if($scope.guilds.length>0)
                $scope.filters.last = $scope.guilds[$scope.guilds.length-1].ad.updated;
            socket.emit('get:guildAds',$scope.filters);
        };

        $scope.updateFilters = function(){
            if($scope.$parent.loading || $scope.loading)
                return;
            $scope.$parent.loading = true;
            $scope.filters.last = null;
            $scope.guilds =[];
            socket.emit('get:guildAds',$scope.filters);

        };

        socket.forward('get:guildAds',$scope);
        $scope.$on('socket:get:guildAds',function(ev,guilds){
            $scope.$parent.loading = false;
            $scope.loading = false;
            $scope.guilds = $scope.guilds.concat(guilds);
        });

        
    }
})();