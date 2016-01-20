(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', Dashboard);

    Dashboard.$inject = ['$scope','$state','$translate','socket','LANGUAGES',"wlfgAppTitle","characters","guilds"];
    function Dashboard($scope,$state,$translate,socket,LANGUAGES,wlfgAppTitle,characters,guilds) {
        wlfgAppTitle.setTitle('Home');
        
        $scope.$parent.loading = false;

        $scope.realmZones = [
            {name: 'US', msGroup: true},
            {name:$translate.instant("US--EN_US--AMERICA--CHICAGO::LOS_ANGELES::NEW_YORK::DENVER") ,region:"us", locale:"en_US", zone:"America", cities:["Chicago","Los_Angeles","New_York","Denver"], selected:false},
            {name:$translate.instant("US--EN_US--AUSTRALIA--MELBOURNE"), region:"us", locale:"en_US", zone:"Australia", cities:["Melbourne"], selected:false},
            {name:$translate.instant("US--ES_MX--AMERICA--CHICAGO"), region:"us",  locale:"es_MX", zone:"America", cities:["Chicago"], selected:false},
            {name:$translate.instant("US--PT_BR--AMERICA--SAO_PAULO"), region:"us", locale:"pt_BR", zone:"America", cities:["Sao_Paulo"], selected:false},
            { msGroup: false},
            {name: 'EU', msGroup: true},
            {name:$translate.instant("EU--EN_GB--EUROPE--PARIS"), region:"eu", locale:"en_GB", zone:"Europe", cities:["Paris"], selected:false},
            {name:$translate.instant("EU--DE_DE--EUROPE--PARIS"), region:"eu", locale:"de_DE", zone:"Europe", cities:["Paris"],selected:false},
            {name:$translate.instant("EU--FR_FR--EUROPE--PARIS"), region:"eu", locale:"fr_FR", zone:"Europe", cities:["Paris"],selected:false},
            {name:$translate.instant("EU--ES_ES--EUROPE--PARIS"), region:"eu", locale:"es_ES", zone:"Europe", cities:["Paris"],selected:false},
            {name:$translate.instant("EU--RU_RU--EUROPE--PARIS"), region:"eu", locale:"ru_RU", zone:"Europe", cities:["Paris"],selected:false},
            {name:$translate.instant("EU--PT_BR--EUROPE--PARIS"), region:"eu", locale:"pt_BR", zone:"Europe", cities:["Paris"],selected:false},
            { msGroup: false},
            {name:$translate.instant("TW--ZH_TW--ASIA--TAIPEI"), region:"tw", locale:"zh_TW", zone:"Asia", cities:["Taipei"], selected:false},
            {name:$translate.instant("KR--KO_KR--ASIA--SEOUL"), region:"kr", locale:"ko_KR", zone:"Asia", cities:["Seoul"], selected:false}
        ];

        $scope.localRealmZones = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_REALMZONES")
        };
        //Reset error message
        $scope.$parent.error = null;
        $scope.languages = LANGUAGES;

        //Initialize $scope variables
        $scope.guildAdsObj = guilds.getWithCount({lfg:true,view:"minimal"});
        $scope.characterAdsObj = characters.getWithCount({lfg:true,view:"minimal"});

        //Initialize $scope variables
        $scope.guildsObj = guilds.getWithCount({number:0});
        $scope.charactersObj = characters.getWithCount({number:0});


        $scope.form = {type:"guild",region:"",language:"",realmZones:[]};

        $scope.CTAFormSubmit = function(){

            var realmZones=[];
            angular.forEach($scope.form.realmZones,function(realmZone){
                realmZones.push(realmZone.region +'.'+realmZone.locale+"."+realmZone.zone+"."+realmZone.cities.join('::'));
            });

            $state.go($scope.form.type+'-list',{region:$scope.form.region,language:$scope.form.language,faction:$scope.form.faction,realm_zone:realmZones});
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