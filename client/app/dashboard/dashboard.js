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
    }
})();