(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', Dashboard);

    Dashboard.$inject = ['$scope','$state','$timeout','socket','LANGUAGES'];
    function Dashboard($scope,$state,$timeout,socket,LANGUAGES) {

        $scope.$parent.loading = false;


        //Reset error message
        $scope.$parent.error = null;
        $scope.languages = LANGUAGES;

        //Initialize $scope variables
        $scope.guilds = [];
        $scope.characters = [];
        $scope.form = {type:"guild",region:"eu",language:"en"};

        socket.emit('get:lastGuildAds');
        socket.forward('get:lastGuildAds',$scope);
        $scope.$on('socket:get:lastGuildAds',function(ev,guilds){
            $scope.guilds=guilds;
        });
        socket.emit('get:lastCharacterAds');
        socket.forward('get:lastCharacterAds',$scope);
        $scope.$on('socket:get:lastCharacterAds',function(ev,characters){
            $scope.characters=characters;
        });

        socket.emit('get:charactersCount');
        socket.forward('get:charactersCount',$scope);
        $scope.$on('socket:get:charactersCount',function(ev,characterCount){
            $scope.characterCount=characterCount;
        });

        socket.emit('get:guildsCount');
        socket.forward('get:guildsCount',$scope);
        $scope.$on('socket:get:guildsCount',function(ev,guildCount){
            $scope.guildCount=guildCount;
        });

        socket.emit('get:characterAdsCount');
        socket.forward('get:characterAdsCount',$scope);
        $scope.$on('socket:get:characterAdsCount',function(ev,characterAdCount){
            $scope.characterAdCount=characterAdCount;
        });

        socket.emit('get:guildAdsCount');
        socket.forward('get:guildAdsCount',$scope);
        $scope.$on('socket:get:guildAdsCount',function(ev,guildAdCount){
            $scope.guildAdCount=guildAdCount;
        });

        $scope.CTAFormSubmit = function(){
            $state.go($scope.form.type+'-list',{region:$scope.form.region,language:$scope.form.language,faction:$scope.form.faction});
        };

        /*
         $scope.searchText="";

         socket.forward('get:search',$scope);
         $scope.$on('socket:get:search',function(ev,searchResult){
         $scope.searchLoading = false;
         $scope.searchResult=searchResult;
         });

         $scope.search = function(){
         if($scope.searchText.length>=2){
         socket.emit('get:search',$scope.searchText);
         $scope.searchLoading = true;
         }
         };

         $scope.clearResult = function(){
         $timeout(function(){
         $scope.searchResult = null;
         },125);
         };*/

    }
})();