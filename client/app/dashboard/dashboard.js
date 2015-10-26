(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', Dashboard);

    Dashboard.$inject = ['$scope','socket'];
    function Dashboard($scope,socket) {

        /*jshint validthis: true */
        var vm = this;

        //Reset error message
        $scope.$parent.error = null

        //Initialize $scope variables
        $scope.guildAds = [];
        $scope.characters = [];

        socket.emit('get:lastGuildAds');
        socket.forward('get:lastGuildAds',$scope);
        $scope.$on('socket:get:lastGuildAds',function(ev,guildAds){
            $scope.guildAds=guildAds;
        });
        socket.emit('get:lastCharacterAds');
        socket.forward('get:lastCharacterAds',$scope);
        $scope.$on('socket:get:lastCharacterAds',function(ev,characters){
            $scope.characters=characters;
        });


        socket.emit('get:characterCount');
        socket.forward('get:characterCount',$scope);
        $scope.$on('socket:get:characterCount',function(ev,characterCount){
            $scope.characterCount=characterCount;
        });

        socket.emit('get:guildCount');
        socket.forward('get:guildCount',$scope);
        $scope.$on('socket:get:guildCount',function(ev,guildCount){
            $scope.guildCount=guildCount;
        });

        socket.emit('get:characterAdCount');
        socket.forward('get:characterAdCount',$scope);
        $scope.$on('socket:get:characterAdCount',function(ev,characterAdCount){
            $scope.characterAdCount=characterAdCount;
        });

        socket.emit('get:guildAdCount');
        socket.forward('get:guildAdCount',$scope);
        $scope.$on('socket:get:guildAdCount',function(ev,guildAdCount){
            $scope.guildAdCount=guildAdCount;
        });


    }
})();