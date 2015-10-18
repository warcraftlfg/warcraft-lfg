(function() {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', Account);

    Account.$inject = ['$scope','socket'];

    function Account($scope,socket) {

        /*jshint validthis: true */
        var vm = this;

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
    }
})();