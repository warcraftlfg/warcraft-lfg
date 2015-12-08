(function() {
    'use strict';

    angular
        .module('app.character')
        .controller('CharacterReadController', CharacterRead)
        .controller('CharacterUpdateController', CharacterUpdate)
        .controller('CharacterListController', CharacterList)
    ;

    CharacterRead.$inject = ["$scope","socket","$state","$stateParams","$location"];
    function CharacterRead($scope,socket,$state,$stateParams,$location) {
        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.$parent.loading = true;
        $scope.current_url =  window.encodeURIComponent($location.absUrl());

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

    CharacterUpdate.$inject = ["$scope","socket","$state","$stateParams","$translate","LANGUAGES","TIMEZONES"];
    function CharacterUpdate($scope,socket,$state,$stateParams,$translate,LANGUAGES,TIMEZONES) {
        //Reset error message
        $scope.$parent.error=null;
        $scope.timezones = TIMEZONES;

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

    CharacterList.$inject = ['$scope','$stateParams','$translate','$location','socket','LANGUAGES','TIMEZONES'];
    function CharacterList($scope ,$stateParams, $translate, $location, socket, LANGUAGES,TIMEZONES) {

        //Reset error message
        $scope.$parent.error=null;
        $scope.characters = [];

        $scope.current_url =  window.encodeURIComponent($location.absUrl());


        $translate([
            'ALL_REALMS',
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
            $scope.localRealms = {
                selectAll       : translations.SELECT_ALL,
                selectNone      : translations.SELECT_NONE,
                reset           : translations.RESET,
                search          : translations.SEARCH,
                nothingSelected : translations.ALL_REALMS
            };
        });

        $scope.filters = {};
        $scope.filters.faction = "";
        $scope.filters.lvlmax = true;
        $scope.filters.region = "";
        $scope.filters.role = "";
        $scope.filters.raids_per_week = {min:1,max:7};
        $scope.filters.days = {};
        $scope.filters.languages = [];
        $scope.realms = [];

        $scope.languages=[];
        angular.forEach(LANGUAGES,function(language){
            var tmplng = {id:language,name:$translate.instant("LANG_"+language.toUpperCase())};
            if($stateParams.languages &&  $stateParams.languages.split("__").indexOf(language)!=-1) {
                tmplng.selected = true;
               $scope.filters.languages.push({id:language,selected:true});
            }
            $scope.languages.push(tmplng);
        });

        $scope.timezones= TIMEZONES;

        /* if params load filters */
        if($stateParams.region)
            $scope.filters.region = $stateParams.region;

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

        $scope.$watch('filters.region', function() {
            $scope.filters.realm={};
            $scope.updateFilters();
            console.log("REGION");
            socket.emit('get:realms',$scope.filters.region);
        });

        $scope.getMoreCharacters = function(){
            if(($scope.$parent && $scope.$parent.loading) || $scope.loading)
                return;
            $scope.loading = true;

            if($scope.characters.length>0)
                $scope.filters.last = $scope.characters[$scope.characters.length-1].ad.updated;
            socket.emit('get:characterAds',$scope.filters);
        };

        $scope.updateFilters = function(){
            console.log('update');
            if($scope.$parent.loading || $scope.loading)
                return;
            console.log('updateIN');

            $scope.$parent.loading = true;
            $scope.filters.last = null;
            $scope.characters =[];

            //Beurk Filters !!!
            if($scope.filters) {
                var urlParams={};
                //region
                if ($scope.filters.region && $scope.filters.region !== "")
                    urlParams.region = $scope.filters.region;
                //realm (Array)
                if ($scope.filters.realm && $scope.filters.realm.region)
                    urlParams.realm_region = $scope.filters.realm.region;
                if ($scope.filters.realm && $scope.filters.realm.name)
                    urlParams.realm_name = $scope.filters.realm.name;
                if ($scope.filters.realm && $scope.filters.realm.connected_realms){
                    var connectedRealms = [];
                    angular.forEach($scope.filters.realm.connected_realms,function(realm){
                        connectedRealms.push(realm.name);
                    });
                    urlParams.connected_realms = connectedRealms.join('__');
                }
                //language (Array)
                if ($scope.filters.languages && $scope.filters.languages.length>0){
                    var tmpLanguages = [];
                    angular.forEach($scope.filters.languages,function(language){
                        tmpLanguages.push(language.id);
                    });
                    urlParams.languages = tmpLanguages.join('__');
                }
                //faction
                if($scope.filters.faction)
                    urlParams.faction = $scope.filters.faction;

                //role (Array)
                if($scope.filters.roles && $scope.filters.roles.length>0){
                    var roles = [];
                    angular.forEach($scope.filters.roles,function(role){
                        roles.push(role.id);
                    });
                    urlParams.roles = roles.join('__');
                }

                //classes (Array)
                if($scope.filters.classes && $scope.filters.classes.length>0){
                    var classes = [];
                    angular.forEach($scope.filters.classes,function(classe){
                        classes.push(classe.id);
                    });
                    urlParams.classes = classes.join('__');
                }

                //day (Array)
                if($scope.filters.days && $scope.filters.days.length>0){
                    var days = [];
                    angular.forEach($scope.filters.days,function(day){
                        days.push(day.id);
                    });
                    urlParams.days = days.join('__');
                }
                //timezone
                if($scope.filters.timezone)
                    urlParams.timezone = $scope.filters.timezone;

                //raids per week
                if($scope.filters.raids_per_week && $scope.filters.raids_per_week.active){
                    urlParams.raids_per_week = $scope.filters.raids_per_week.active.toString();
                    urlParams.raids_per_week_min = $scope.filters.raids_per_week.min;
                    urlParams.raids_per_week_max = $scope.filters.raids_per_week.max;
                }
                //transfert
                if($scope.filters.transfert)
                    urlParams.transfert = $scope.filters.transfert.toString();
                //level100
                if($scope.filters.lvlmax)
                    urlParams.lvlmax = $scope.filters.lvlmax.toString();
                $location.search(urlParams);
            }

            socket.emit('get:characterAds',$scope.filters);

        };

        $scope.setRealm = function(data){
            $scope.filters.realm = data;
            $scope.filters.realm.connected_realms= $scope.connected_realms[$scope.filters.realm.connected_realms.join("")];
            $scope.updateFilters();
        };

        $scope.resetRealm = function(){
            $scope.filters.realm = undefined;
            $scope.updateFilters();
        };

        socket.forward('get:characterAds',$scope);
        $scope.$on('socket:get:characterAds',function(ev,characters){
            $scope.$parent.loading = false;
            $scope.loading=false;
            $scope.characters = $scope.characters.concat(characters);
        });

        socket.forward('get:realms',$scope);
        $scope.$on('socket:get:realms',function(ev,realms){
            console.log("GETREALM");
            $scope.realms = realms;
            $scope.connected_realms = {};
            //Beurk !!!
            angular.forEach(realms,function (realm) {
                if (!$scope.connected_realms[realm.bnet.connected_realms.join("")])
                    $scope.connected_realms[realm.bnet.connected_realms.join("")] = [];
                $scope.connected_realms[realm.bnet.connected_realms.join("")].push(realm);
                realm.label = realm.name + " (" + realm.region.toUpperCase() + ")";
                realm.connected_realms = realm.bnet.connected_realms;
                if($stateParams.realm_name && $stateParams.realm_name == realm.name &&  $stateParams.realm_region && $stateParams.realm_region==realm.region && $stateParams.connected_realms ) {
                    realm.selected = true;
                    $scope.filters.realm.region = $stateParams.realm_region;
                    $scope.filters.realm.name = $stateParams.realm_name;
                    $scope.filters.realm.connected_realms = $stateParams.connected_realms.split("__");
                }
            });


        });

    }
})();