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

    CharacterCreate.$inject = ['$scope','socket','$state'];
    function CharacterCreate($scope, socket, $state) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.userCharacters = null;

        socket.forward('get:userCharacters',$scope);
        $scope.$on('socket:get:userCharacters',function(ev,characters){
            $scope.$parent.loading = false;
            $scope.userCharacters = characters;
        });

        socket.forward('put:characterAd',$scope);
        $scope.$on('socket:put:characterAd',function(ev,characterAd){
            $scope.$parent.loading = false;
            $state.go("character-update",{region:characterAd.region,realm:characterAd.realm,name:characterAd.name});
        });

        $scope.updateRegion = function(){
            $scope.$parent.loading = true;
            socket.emit('get:userCharacters',$scope.region);
        };

        $scope.createCharacterAd = function(region,realm,name){
            $scope.$parent.loading = true;
            socket.emit('put:characterAd',{region:region,realm:realm,name:name});
        }

    }

    CharacterRead.$inject = ["$scope","socket","$state","$stateParams"];
    function CharacterRead($scope,socket,$state,$stateParams) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.$parent.loading = true;

        socket.emit('get:characterData',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:characterData',$scope);
        $scope.$on('socket:get:characterData',function(ev,characterData){
            $scope.characterData = characterData

            // TODO Throw 404
            $scope.$parent.loading = false;

        }); 
    }

    CharacterUpdate.$inject = ["$scope","socket","$state","$stateParams","LANGUAGES"];
    function CharacterUpdate($scope,socket,$state,$stateParams,LANGUAGES) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.languages = LANGUAGES;
        $scope.$parent.loading = true;

        socket.emit('get:characterAd',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:characterAd',$scope);
        $scope.$on('socket:get:characterAd',function(ev,characterAd){
            $scope.$parent.loading = false;
            $scope.characterAd = characterAd;
            console.log(characterAd);
        });

        $scope.save = function(){
            $scope.$parent.loading = true;
            socket.emit('put:characterAd',$scope.characterAd);
        };

        socket.forward('put:characterAd',$scope);
        $scope.$on('socket:put:characterAd',function(){
            $scope.$parent.loading = false;
            $state.go("account");
        });         
    }

    CharacterDelete.$inject = ['$scope','socket','$state','$stateParams'];
    function CharacterDelete($scope, socket, $state, $stateParams) {
        //Reset error message
        $scope.$parent.error=null;

        //Initialize var
        $scope.characterAd = {name:$stateParams.name, realm:$stateParams.realm, region:$stateParams.region};

        $scope.delete = function(){
            $scope.$parent.loading = true;
            socket.emit('delete:characterAd',$scope.characterAd);
        };

        socket.forward('delete:characterAd',$scope);
        $scope.$on('socket:delete:characterAd',function(ev,characterAd){
            $scope.$parent.loading = false;
            $state.go("account");
        });
    }
    CharacterList.$inject = ['$scope','socket'];
    function CharacterList($scope, socket) {

        //Reset error message
        $scope.$parent.error=null;
        $scope.$parent.loading = true;
        $scope.recruit = true;

        socket.emit('get:charactersData',$scope.recruit);
        socket.forward('get:charactersData',$scope);
        $scope.$on('socket:get:charactersData',function(ev,charactersData){
            $scope.$parent.loading = false;
            $scope.charactersData = charactersData;
        });

        $scope.getCharactersData = function(){
            $scope.$parent.loading = true;
            socket.emit('get:charactersData',$scope.recruit);

        }
    }
})();