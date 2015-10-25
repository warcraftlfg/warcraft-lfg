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
        $scope.characterAds = [];

        socket.emit('get:guildAds');
        socket.forward('get:guildAds',$scope);
        $scope.$on('socket:get:guildAds',function(ev,guildAds){
            $scope.guildAds=guildAds;
        });
        socket.emit('get:characterAds');
        socket.forward('get:characterAds',$scope);
        $scope.$on('socket:get:characterAds',function(ev,characterAds){
            $scope.characterAds=characterAds;
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
    }
})();