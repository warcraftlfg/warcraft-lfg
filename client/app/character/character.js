(function() {
    'use strict';

    angular
        .module('app.character')
        .controller('CharacterReadController', CharacterRead)
        .controller('CharacterUpdateController', CharacterUpdate)
        .controller('CharacterDeleteController', CharacterDelete)
        .controller('CharacterListController', CharacterList)
    ;

    CharacterRead.$inject = ["$scope","socket","$state","$stateParams"];
    function CharacterRead($scope,socket,$state,$stateParams) {
        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.$parent.loading = true;

        socket.emit('get:character',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:character',$scope);
        $scope.$on('socket:get:character',function(ev,character){
            $scope.$parent.loading = false;
            $scope.character = character;
        });

        $scope.updateCharacter = function(){
            $scope.$parent.loading = true;
            socket.emit('update:character',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});
        };

        socket.forward('update:character',$scope);
        $scope.$on('socket:update:character',function(ev,queuePosition){
            $scope.queuePosition = queuePosition;
            $scope.$parent.loading = false;

        });
    }

    CharacterUpdate.$inject = ["$scope","socket","$state","$stateParams","$translate","LANGUAGES"];
    function CharacterUpdate($scope,socket,$state,$stateParams,$translate,LANGUAGES) {
        //Reset error message
        $scope.$parent.error=null;

        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function() {
            if($scope.$parent.user && $scope.$parent.user.logged_in===false)
                $state.go('dashboard');
        });



        $scope.$watch('selectedLanguages', function() {
            if($scope.character) {
                $scope.character.ad.languages = [];
                $scope.selectedLanguages.forEach(function (language) {
                    $scope.character.ad.languages.push(language.id);
                });
            }
        });


        //Initialize $scope variables
        $scope.$parent.loading = true;

        socket.emit('get:character',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:character',$scope);
        $scope.$on('socket:get:character',function(ev,character){
            $scope.$parent.loading = false;
            $scope.character = character;
            $scope.languages = [];
            LANGUAGES.forEach(function(language){
                $scope.languages.push({id:language,name:$translate.instant("LANG_"+language.toUpperCase()),selected:$scope.character.ad.languages.indexOf(language)!=-1});
            });

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


        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function() {
            if($scope.$parent.user && $scope.$parent.user.logged_in===false)
                $state.go('dashboard');
        });

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
    CharacterList.$inject = ['$scope','$stateParams','$translate','socket','LANGUAGES'];
    function CharacterList($scope ,$stateParams, $translate, socket, LANGUAGES) {

        //Reset error message
        $scope.$parent.error=null;
        $scope.characters = [];

        $scope.languages=[];
        LANGUAGES.forEach(function(language){
            $scope.languages.push({id:language,name:$translate.instant("LANG_"+language.toUpperCase())});
        });

        $translate([
            'ALL_DAYS',
            'ALL_CLASSES',
            'ALL_ROLES',
            'ALL_LANGUAGES',
            'SELECT_ALL',
            'SELECT_NONE',
            'RESET',
            'SEARCH',
            'HEAL',
            'TANK',
            'RANGED_DPS',
            'MELEE_DPS',
            'CLASS_1',
            'CLASS_2',
            'CLASS_3',
            'CLASS_4',
            'CLASS_5',
            'CLASS_6',
            'CLASS_7',
            'CLASS_8',
            'CLASS_9',
            'CLASS_10',
            'CLASS_11',
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
            'SUNDAY'
        ]).then(function (translations) {
            $scope.classes = [
                {id:1, name: "<span class='class-1'>"+translations.CLASS_1+"</span>", icon:"<img src='/assets/images/icon/16/class-1.png'>", selected:false},
                {id:2, name: "<span class='class-2'>"+translations.CLASS_2+"</span>", icon:"<img src='/assets/images/icon/16/class-2.png'>", selected:false},
                {id:3, name: "<span class='class-3'>"+translations.CLASS_3+"</span>", icon:"<img src='/assets/images/icon/16/class-3.png'>", selected:false},
                {id:4, name: "<span class='class-4'>"+translations.CLASS_4+"</span>", icon:"<img src='/assets/images/icon/16/class-4.png'>", selected:false},
                {id:5, name: "<span class='class-5'>"+translations.CLASS_5+"</span>", icon:"<img src='/assets/images/icon/16/class-5.png'>", selected:false},
                {id:6, name: "<span class='class-6'>"+translations.CLASS_6+"</span>", icon:"<img src='/assets/images/icon/16/class-6.png'>", selected:false},
                {id:7, name: "<span class='class-7'>"+translations.CLASS_7+"</span>", icon:"<img src='/assets/images/icon/16/class-7.png'>", selected:false},
                {id:8, name: "<span class='class-8'>"+translations.CLASS_8+"</span>", icon:"<img src='/assets/images/icon/16/class-8.png'>", selected:false},
                {id:9, name: "<span class='class-9'>"+translations.CLASS_9+"</span>", icon:"<img src='/assets/images/icon/16/class-9.png'>", selected:false},
                {id:10, name: "<span class='class-10'>"+translations.CLASS_10+"</span>", icon:"<img src='/assets/images/icon/16/class-10.png'>", selected:false},
                {id:11, name: "<span class='class-11'>"+translations.CLASS_11+"</span>", icon:"<img src='/assets/images/icon/16/class-11.png'>", selected:false}
            ];
            $scope.roles = [
                {id:'tank', name: translations.TANK, icon:"<img src='/assets/images/icon/16/tank.png'>", selected:false},
                {id:'heal', name: translations.HEAL, icon:"<img src='/assets/images/icon/16/healing.png'>", selected:false},
                {id:'melee_dps', name: translations.MELEE_DPS, icon:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
                {id:'ranged_dps', name: translations.RANGED_DPS, icon:"<img src='/assets/images/icon/16/ranged-dps.png'>", selected:false}
            ];
            $scope.days = [
                {id:'monday', name: translations.MONDAY, selected:false},
                {id:'tuesday', name: translations.TUESDAY, selected:false},
                {id:'wednesday', name: translations.WEDNESDAY, selected:false},
                {id:'thursday', name: translations.THURSDAY, selected:false},
                {id:'friday', name: translations.FRIDAY, selected:false},
                {id:'saturday', name: translations.SATURDAY, selected:false},
                {id:'sunday', name: translations.SUNDAY, selected:false},
            ];
            $scope.localClasses = {
                selectAll       : translations.SELECT_ALL,
                selectNone      : translations.SELECT_NONE,
                reset           : translations.RESET,
                search          : translations.SEARCH,
                nothingSelected : translations.ALL_CLASSES
            };
            $scope.localLanguages = {
                selectAll       : translations.SELECT_ALL,
                selectNone      : translations.SELECT_NONE,
                reset           : translations.RESET,
                search          : translations.SEARCH,
                nothingSelected : translations.ALL_LANGUAGES
            };
            $scope.localRoles = {
                selectAll       : translations.SELECT_ALL,
                selectNone      : translations.SELECT_NONE,
                reset           : translations.RESET,
                search          : translations.SEARCH,
                nothingSelected : translations.ALL_ROLES
            };
            $scope.localDays = {
                selectAll       : translations.SELECT_ALL,
                selectNone      : translations.SELECT_NONE,
                reset           : translations.RESET,
                search          : translations.SEARCH,
                nothingSelected : translations.ALL_DAYS
            };
        });


        $scope.filters = {};
        $scope.filters.faction = "";
        $scope.filters.lvlmax = true;
        $scope.filters.region = "";
        $scope.language = {};
        $scope.filters.role = "";
        $scope.filters.raids_per_week = {min:1,max:7};
        $scope.filters.days = {};

        /* if params load filters */
        if($stateParams.region)
            $scope.filters.region = $stateParams.region;
        if($stateParams.language)
            $scope.filters.language = $stateParams.language;
        if($stateParams.faction)
            $scope.filters.faction = $stateParams.faction;


        $scope.$watch('filters.raids_per_week.min', function() {
            $scope.updateFilters();
        });
        $scope.$watch('filters.raids_per_week.max', function() {
            $scope.updateFilters();
        });
        $scope.$watch('filters.classes', function() {
            $scope.updateFilters();
        });
        $scope.$watch('filters.roles', function() {
            $scope.updateFilters();
        });
        $scope.$watch('filters.languages', function() {
            $scope.updateFilters();
        });
        $scope.$watch('filters.days', function() {
            $scope.updateFilters();
        });


        $scope.getMoreCharacters = function(){
            if($scope.$parent.loading || $scope.loading)
                return;
            $scope.loading = true;

            if($scope.characters.length>0)
                $scope.filters.last = $scope.characters[$scope.characters.length-1].ad.updated;
            socket.emit('get:characterAds',$scope.filters);
        };

        $scope.updateFilters = function(){
            if($scope.$parent.loading || $scope.loading)
                return;
            $scope.$parent.loading = true;
            $scope.filters.last = null;
            $scope.characters =[];
            socket.emit('get:characterAds',$scope.filters);

        };

        socket.forward('get:characterAds',$scope);
        $scope.$on('socket:get:characterAds',function(ev,characters){
            $scope.$parent.loading = false;
            $scope.loading=false;
            $scope.characters = $scope.characters.concat(characters);
        });

    }
})();