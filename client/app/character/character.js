(function() {
    'use strict';

    angular
        .module('app.character')
        .controller('CharacterReadController', CharacterRead)
        .controller('CharacterUpdateController', CharacterUpdate)
        .controller('CharacterListController', CharacterList)
    ;

    CharacterRead.$inject = ["$scope","socket","$state","$stateParams","$location","wlfgAppTitle"];
    function CharacterRead($scope,socket,$state,$stateParams,$location,wlfgAppTitle) {
        wlfgAppTitle.setTitle($stateParams.name+' @ '+$stateParams.realm+' ('+$stateParams.region.toUpperCase()+')');
        //Reset error message
        $scope.$parent.error=null;

        //Initialize $scope variables
        $scope.$parent.loading = true;
        $scope.current_url =  window.encodeURIComponent($location.absUrl());

        socket.emit('get:character',{"region":$stateParams.region,"realm":$stateParams.realm,"name":$stateParams.name});

        socket.forward('get:character',$scope);
        $scope.$on('socket:get:character',function(ev,character){
            $scope.character = character;
            if (character.ad.btag_display) {
                socket.emit('get:characterBattleTag', character._id);
                socket.forward('get:characterBattleTag',$scope);
                $scope.$on('socket:get:characterBattleTag',function(ev,battleTag){
                    $scope.$parent.loading = false;
                    $scope.character.battleTag = battleTag;
                });
            } else {
                $scope.$parent.loading = false;
            }
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

    CharacterList.$inject = ['$scope','$stateParams','$translate','$state','socket','LANGUAGES','TIMEZONES',"wlfgAppTitle"];
    function CharacterList($scope ,$stateParams, $translate,$state, socket, LANGUAGES,TIMEZONES,wlfgAppTitle) {
        wlfgAppTitle.setTitle('Characters LFG');

        //Reset error message
        $scope.$parent.error=null;
        $scope.$parent.loading = true;
        $scope.characters = [];

        $scope.filters = {};
        $scope.filters.faction = "";
        $scope.filters.lvlmax = true;
        $scope.filters.region = "";
        $scope.filters.role = "";
        $scope.filters.raids_per_week = {active:false,min:1,max:7};
        $scope.filters.days = [];
        $scope.filters.languages = [];
        $scope.filters.realm = {};
        $scope.filters.realmZones = [];
        $scope.filters.roles = [];
        $scope.filters.classes = [];
        $scope.filters.transfert = false;

        $scope.realms = [];
        $scope.languages=[];
        $scope.timezones= TIMEZONES;

        $scope.roles = [
            {id:'tank', name: $translate.instant("TANK"), icon:"<img src='/assets/images/icon/16/tank.png'>", selected:false},
            {id:'heal', name: $translate.instant("HEAL"), icon:"<img src='/assets/images/icon/16/healing.png'>", selected:false},
            {id:'melee_dps', name: $translate.instant("MELEE_DPS"), icon:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
            {id:'ranged_dps', name: $translate.instant("RANGED_DPS"), icon:"<img src='/assets/images/icon/16/ranged-dps.png'>", selected:false}
        ];
        $scope.classes = [
            {id:1, name: "<span class='class-1'>"+$translate.instant("CLASS_1")+"</span>", icon:"<img src='/assets/images/icon/16/class-1.png'>", selected:false},
            {id:2, name: "<span class='class-2'>"+$translate.instant("CLASS_2")+"</span>", icon:"<img src='/assets/images/icon/16/class-2.png'>", selected:false},
            {id:3, name: "<span class='class-3'>"+$translate.instant("CLASS_3")+"</span>", icon:"<img src='/assets/images/icon/16/class-3.png'>", selected:false},
            {id:4, name: "<span class='class-4'>"+$translate.instant("CLASS_4")+"</span>", icon:"<img src='/assets/images/icon/16/class-4.png'>", selected:false},
            {id:5, name: "<span class='class-5'>"+$translate.instant("CLASS_5")+"</span>", icon:"<img src='/assets/images/icon/16/class-5.png'>", selected:false},
            {id:6, name: "<span class='class-6'>"+$translate.instant("CLASS_6")+"</span>", icon:"<img src='/assets/images/icon/16/class-6.png'>", selected:false},
            {id:7, name: "<span class='class-7'>"+$translate.instant("CLASS_7")+"</span>", icon:"<img src='/assets/images/icon/16/class-7.png'>", selected:false},
            {id:8, name: "<span class='class-8'>"+$translate.instant("CLASS_8")+"</span>", icon:"<img src='/assets/images/icon/16/class-8.png'>", selected:false},
            {id:9, name: "<span class='class-9'>"+$translate.instant("CLASS_9")+"</span>", icon:"<img src='/assets/images/icon/16/class-9.png'>", selected:false},
            {id:10, name: "<span class='class-10'>"+$translate.instant("CLASS_10")+"</span>", icon:"<img src='/assets/images/icon/16/class-10.png'>", selected:false},
            {id:11, name: "<span class='class-11'>"+$translate.instant("CLASS_11")+"</span>", icon:"<img src='/assets/images/icon/16/class-11.png'>", selected:false}
        ];
        $scope.days = [
            {id:'monday', name: $translate.instant("MONDAY"), selected:false},
            {id:'tuesday', name: $translate.instant("TUESDAY"), selected:false},
            {id:'wednesday', name: $translate.instant("WEDNESDAY"), selected:false},
            {id:'thursday', name: $translate.instant("THURSDAY"), selected:false},
            {id:'friday', name: $translate.instant("FRIDAY"), selected:false},
            {id:'saturday', name: $translate.instant("SATURDAY"), selected:false},
            {id:'sunday', name: $translate.instant("SUNDAY"), selected:false},
        ];

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

        $scope.localClasses = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_CLASSES")
        };
        $scope.localLanguages = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_LANGUAGES")
        };
        $scope.localRoles = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_ROLES")
        };
        $scope.localDays = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_DAYS")
        };
        $scope.localRealms = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_REALMS")
        };
        $scope.localRealmZones = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_REALMZONES")
        };


        /* if params load filters */
        if($stateParams.realm_zones){
            var realmZones = $stateParams.realm_zones.split('__');
            angular.forEach($scope.realmZones,function(realmZone){

                angular.forEach(realmZones,function(realmZoneStr){
                    var params = realmZoneStr.split('--');
                    if (params.length == 4) {
                        var realmZoneTmp = {};
                        realmZoneTmp.region = params[0];
                        realmZoneTmp.locale = params[1];
                        realmZoneTmp.zone = params[2];
                        realmZoneTmp.cities = params[3].split('::');
                        if(realmZone.region == realmZoneTmp.region && realmZone.locale == realmZoneTmp.locale && realmZone.zone == realmZoneTmp.zone && angular.equals(realmZone.cities,realmZoneTmp.cities)){
                            $scope.filters.realmZones.push(realmZoneTmp);
                            realmZone.selected = true;
                        }
                    }
                });
            });
        }

        if($stateParams.realm_name && $stateParams.realm_region){
            $scope.filters.realm.region = $stateParams.realm_region;
            $scope.filters.realm.name = $stateParams.realm_name;

            $scope.realms = [{
                label: $stateParams.realm_name + " (" + $stateParams.realm_region.toUpperCase() + ")",
                selected: true
            }];
        }

        angular.forEach(LANGUAGES,function(language){
            var tmplng = {id:language,name:$translate.instant("LANG_"+language.toUpperCase())};
            if($stateParams.languages &&  $stateParams.languages.split("__").indexOf(language)!=-1) {
                tmplng.selected = true;
                $scope.filters.languages.push({id:language,selected:true});
            }
            $scope.languages.push(tmplng);
        });

        if($stateParams.faction)
            $scope.filters.faction = $stateParams.faction;

        if($stateParams.roles){
            var roles = $stateParams.roles.split("__");

            angular.forEach($scope.roles,function(role){
                if(roles.indexOf(role.id)!=-1) {
                    role.selected = true;
                    $scope.filters.roles.push({id:role.id,selected:true});
                }
            });
        }

        if($stateParams.classes){
            var classes = $stateParams.classes.split("__");
            angular.forEach($scope.classes,function(clas){
                if(classes.indexOf(clas.id.toString())!=-1) {
                    clas.selected = true;
                    $scope.filters.classes.push({id:clas.id,selected:true});
                }
            });
        }

        if($stateParams.days){
            var days = $stateParams.days.split("__");
            angular.forEach($scope.days,function(day){
                if(days.indexOf(day.id)!=-1) {
                    day.selected = true;
                    $scope.filters.days.push({id:day.id,selected:true});
                }
            });
        }

        if($stateParams.timezone) {
            $scope.filters.timezone = $stateParams.timezone;
        }

        if($stateParams.raids_per_week_active) {
            $scope.filters.raids_per_week.active = $stateParams.raids_per_week_active==="true";
        }

        if($stateParams.raids_per_week_min) {
            $scope.filters.raids_per_week.min = $stateParams.raids_per_week_min;
        }

        if($stateParams.raids_per_week_max) {
            $scope.filters.raids_per_week.max = $stateParams.raids_per_week_max;
        }

        if($stateParams.transfert) {
            $scope.filters.transfert = $stateParams.transfert==="true";
        }

        if($stateParams.lvlmax) {
            $scope.filters.lvlmax = $stateParams.lvlmax==="true";
        }

        $scope.$watch('filters.realmZones',function(){
            if($scope.$parent.loading || $scope.loading)
                return;

            var realmZones=[];
            var realmInRegion = false;

            angular.forEach($scope.filters.realmZones,function(realmZone){

                if(realmZone.region == $scope.filters.realm_region)
                    realmInRegion=true;

                realmZones.push(realmZone.region +'--'+realmZone.locale+"--"+realmZone.zone+"--"+realmZone.cities.join('::'));

            });

            if (!realmInRegion && $scope.filters.realmZones.length>0) {
                $stateParams.realm_region=null;
                $stateParams.realm_name=null;
            }

            $stateParams.realm_zones = realmZones.join('__');
            $state.go($state.current,$stateParams,{reload:true});

        },true);

        $scope.$watch('filters.realm',function(){
            if($scope.$parent.loading || $scope.loading)
                return;

            $stateParams.realm_region = $scope.filters.realm.region;
            $stateParams.realm_name = $scope.filters.realm.name;

            $state.go($state.current,$stateParams,{reload:true});

        });

        $scope.$watch('filters.languages', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }
            var tmpLanguages = [];
            angular.forEach($scope.filters.languages,function(language){
                tmpLanguages.push(language.id);
            });
            $stateParams.languages = tmpLanguages.join('__');
            $state.go($state.current,$stateParams,{reload:true});

        });

        $scope.$watch('filters.faction', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }
            $stateParams.faction = $scope.filters.faction;
            $state.go($state.current,$stateParams,{reload:true});

        });
        $scope.$watch('filters.roles', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }
            var roles = [];
            angular.forEach($scope.filters.roles,function(role){
                roles.push(role.id);
            });
            $stateParams.roles = roles.join('__');
            $state.go($state.current,$stateParams,{reload:true});

        });

        $scope.$watch('filters.classes', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }
            var classes = [];
            angular.forEach($scope.filters.classes,function(clas){
                classes.push(clas.id);
            });
            $stateParams.classes = classes.join('__');
            $state.go($state.current,$stateParams,{reload:true});

        });

        $scope.$watch('filters.days', function() {
            if($scope.$parent.loading || $scope.loading)
                return;
            var days = [];
            angular.forEach($scope.filters.days,function(day){
                days.push(day.id);
            });
            $stateParams.days = days.join('__');
            $state.go($state.current,$stateParams,{reload:true});

        });

        $scope.$watch('filters.timezone', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }
            $stateParams.timezone = $scope.filters.timezone;
            $state.go($state.current,$stateParams,{reload:true});
        });

        $scope.$watch('filters.raids_per_week.active', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }

            if($scope.filters.raids_per_week.active===false){
                $stateParams.raids_per_week_min = null;
                $stateParams.raids_per_week_max = null;
            }
            $stateParams.raids_per_week_active = $scope.filters.raids_per_week.active===true ? true : null;
            $state.go($state.current,$stateParams,{reload:true});
        });

        $scope.$watch('filters.raids_per_week.min', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }
            $stateParams.raids_per_week_min = $scope.filters.raids_per_week.min;
            $state.go($state.current,$stateParams,{reload:true});

        });

        $scope.$watch('filters.raids_per_week.max', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }
            $stateParams.raids_per_week_max = $scope.filters.raids_per_week.max;
            $state.go($state.current,$stateParams,{reload:true});

        });


        $scope.$watch('filters.transfert', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }
            $stateParams.transfert = $scope.filters.transfert===true ? true : null;
            $state.go($state.current,$stateParams,{reload:true});
        });

        $scope.$watch('filters.lvlmax', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }
            $stateParams.lvlmax = $scope.filters.lvlmax===false ? false : null;
            $state.go($state.current,$stateParams,{reload:true});
        });


        socket.emit('get:characterAds',$scope.filters);
        socket.emit('get:realms',$scope.filters.realmZones);

        $scope.resetRealmZones = function(){
            $scope.filters.realmZones = [];
        };

        $scope.setRealm = function(data){
            $scope.filters.realm = data;
        };

        $scope.resetRealm = function(){
            $scope.filters.realm = {};
        };

        $scope.resetLanguages = function(){
            $scope.filters.languages = [];
        };
        $scope.resetRoles = function(){
            $scope.filters.roles = [];
        };
        $scope.resetClasses = function(){
            $scope.filters.classes = [];
        };
        $scope.resetDays = function(){
            $scope.filters.days = [];
        };

        $scope.resetFilters = function(){
           $state.go($state.current,null,{reload:true,inherit: false});
        };

        $scope.getMoreCharacters = function(){
            if(($scope.$parent && $scope.$parent.loading) || $scope.loading) {
                return;
            }
            $scope.loading = true;

            if($scope.characters.length>0) {
                $scope.filters.last = $scope.characters[$scope.characters.length-1].ad.updated;
            }
            socket.emit('get:characterAds',$scope.filters);
        };

        socket.forward('get:characterAds',$scope);
        $scope.$on('socket:get:characterAds',function(ev,characters){
            $scope.$parent.loading = false;
            $scope.loading=false;
            $scope.characters = $scope.characters.concat(characters);
        });

        socket.forward('get:realms',$scope);
        $scope.$on('socket:get:realms',function(ev,realms){
            $scope.realms = realms;
            angular.forEach(realms,function (realm) {
                realm.label = realm.name + " (" + realm.region.toUpperCase() + ")";
                if($stateParams.realm_name && $stateParams.realm_name == realm.name &&  $stateParams.realm_region && $stateParams.realm_region==realm.region) {
                    realm.selected = true;
                }
            });
        });

    }
})();