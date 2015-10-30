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
        var characterIds;

        socket.forward('get:userCharacters',$scope);
        $scope.$on('socket:get:userCharacters',function(ev,characters){
            $scope.$parent.loading = false;
            $scope.userCharacters = characters;
        });

        socket.forward('get:character',$scope);
        $scope.$on('socket:get:character',function(ev,character){
            if (character && character.ad)
                socket.emit('put:characterAd',character);
            else{
                characterIds.ad = {};
                socket.emit('put:characterAd',characterIds);
            }
        });

        socket.forward('put:characterAd',$scope);
        $scope.$on('socket:put:characterAd',function(ev,character){
            $state.go("character-update",{region:character.region,realm:character.realm,name:character.name});
        });


        $scope.updateRegion = function(){
            $scope.$parent.loading = true;
            socket.emit('get:userCharacters',$scope.region);
        };

        $scope.createCharacterAd = function(region,realm,name){
            $scope.$parent.loading = true;
            characterIds = {region:region,realm:realm,name:name}
            socket.emit('get:character',characterIds);

        };
    };

    CharacterRead.$inject = ["$scope","socket","$state","$stateParams"];
    function CharacterRead($scope,socket,$state,$stateParams) {
        //Reset error message
        $scope.$parent.error=null

        //Initialize $scope variables
        $scope.$parent.loading = true;

        socket.emit('get:character',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:character',$scope);
        $scope.$on('socket:get:character',function(ev,character){
            $scope.$parent.loading = false;
            $scope.character = character

            //If not exit, redirect user to dashboard
            if(character==null)
                $state.go("dashboard");

        });

        $scope.updateCharacter = function(){
            $scope.$parent.loading = true;
            socket.emit('update:character',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});
        }

        socket.forward('update:character',$scope);
        $scope.$on('socket:update:character',function(ev,queuePosition){
            $scope.queuePosition = queuePosition;
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

        socket.emit('get:character',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:character',$scope);
        $scope.$on('socket:get:character',function(ev,character){
            $scope.$parent.loading = false;
            $scope.character = character;
        });

        $scope.save = function(){
            $scope.$parent.loading = true;
            socket.emit('put:characterAd',$scope.character);
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
        $scope.characters = [];

        $scope.filters = {};
        $scope.filters.lvlmax = true;

        $scope.getMoreCharacters = function(){
            if($scope.characters.length>0)
                $scope.filters.last = $scope.characters[$scope.characters.length-1].ad.updated
            socket.emit('get:characterAds',$scope.filters);
        };

        $scope.updateFilters = function(){
            $scope.$parent.loading = true;
            $scope.filters.last = null;
            $scope.characters =[];
            socket.emit('get:characterAds',$scope.filters);

        };

        socket.forward('get:characterAds',$scope);
        $scope.$on('socket:get:characterAds',function(ev,characters){
            $scope.$parent.loading = false;
            $scope.characters = $scope.characters.concat(characters);
        });

    }
})();