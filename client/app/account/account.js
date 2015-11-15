(function() {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', Account);

    Account.$inject = ['$scope','$state', 'socket'];

    function Account($scope,$state,socket) {

        /*jshint validthis: true */
        var vm = this;

        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function() {
            if($scope.$parent.user && $scope.$parent.user.logged_in===false)
                $state.go('dashboard');
        });

        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.$parent.loading = true;

        socket.emit('get:userGuildAds');
        socket.forward('get:userGuildAds',$scope);
        $scope.$on('socket:get:userGuildAds',function(ev,guildAds){
            $scope.$parent.loading = false;
            $scope.guildAds = guildAds;
        });

        socket.emit('get:userCharacterAds');
        socket.forward('get:userCharacterAds',$scope);
        $scope.$on('socket:get:userCharacterAds',function(ev,characterAds){
            $scope.$parent.loading = false;
            $scope.characterAds = characterAds;
        });

        // Guild add
    }
})();