(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('CharacterCreateController', CharacterCreate)
        .controller('CharacterReadController', CharacterRead)
        .controller('CharacterUpdateController', CharacterUpdate)
        .controller('CharacterDeleteController', CharacterDelete)
        .controller('CharacterListController', CharacterList)
    ;

    CharacterCreate.$inject = ['$scope','socket'];
    function CharacterCreate($scope, socket) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.userCharacters = null;

        socket.forward('get:user-characters',$scope);
        $scope.$on('socket:get:user-characters',function(ev,characters){
            $scope.$parent.loading = false;
            $scope.userCharacters = characters;
        });

        $scope.updateRegion = function(){
            $scope.$parent.loading = true;
            socket.emit('get:user-characters',$scope.region);
        }
        $scope.selectCharacter = function(character){
            $scope.character = character;
        }
    }

    CharacterRead.$inject = ["$scope","socket","$state","$stateParams","LANGUAGES","CHARACTER_AD"];
    function CharacterRead($scope,socket,$state,$stateParams,LANGUAGES,CHARACTER_AD) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.languages= LANGUAGES;
        $scope.character_ad = CHARACTER_AD;
        $scope.$parent.loading = true;

        socket.emit('get:character-ad',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:character-ad',$scope);
        $scope.$on('socket:get:character-ad',function(ev,character_ad){
            $scope.character_ad = angular.merge({},CHARACTER_AD,character_ad);

            // TODO Throw 404
            $scope.$parent.loading = false;

        }); 
    }

    CharacterUpdate.$inject = ["$scope","socket","$state","$stateParams","LANGUAGES","CHARACTER_AD"];
    function CharacterUpdate($scope,socket,$state,$stateParams,LANGUAGES,CHARACTER_AD) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.languages = LANGUAGES;
        $scope.character_ad = CHARACTER_AD;
        $scope.$parent.loading = true;

        socket.emit('get:character-ad',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:character-ad',$scope);
        $scope.$on('socket:get:character-ad',function(ev,character_ad){
            $scope.character_ad = angular.merge({},CHARACTER_AD,character_ad);
            if (!character_ad){
                $scope.character_ad.name = $stateParams.name;
                $scope.character_ad.realm = $stateParams.realm;
                $scope.character_ad.region = $stateParams.region;
            }
            $scope.$parent.loading = false;

        });

        $scope.save = function(){
            socket.emit('add:character-ad',$scope.character_ad);
            $scope.$parent.loading = true;
        };

        socket.forward('add:character-ad',$scope);
        $scope.$on('socket:add:character-ad',function(ev,character_ad){
            $scope.$parent.loading = false;
            $state.go("account");
        });         
    }

    CharacterDelete.$inject = ['$scope','socket'];
    function CharacterDelete($scope, socket) {
        
    }
    CharacterList.$inject = ['$scope','socket'];
    function CharacterList($scope, socket) {
        
    }
})();