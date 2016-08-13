(function () {
    'use strict';

    angular
        .module('app.character')
        .controller('CharacterReadController', CharacterRead)
        .controller('CharacterUpdateController', CharacterUpdate)
        .controller('CharacterListController', CharacterList)
    ;

    CharacterRead.$inject = ["$scope", "socket", "$state", "$stateParams", "$location", "wlfgAppTitle", "characters", "updates", "messages"];
    function CharacterRead($scope, socket, $state, $stateParams, $location, wlfgAppTitle, characters, updates, messages) {
        wlfgAppTitle.setTitle($stateParams.name + ' @ ' + $stateParams.realm + ' (' + $stateParams.region.toUpperCase() + ')');
        //Reset error message
        $scope.$parent.error = null;

        //Initialize $scope variables
        $scope.$parent.loading = true;
        $scope.current_url = window.encodeURIComponent($location.absUrl());

        characters.get({
            "characterRegion": $stateParams.region,
            "characterRealm": $stateParams.realm,
            "characterName": $stateParams.name
        }, function (character) {
            $scope.$parent.loading = false;
            $scope.character = character;
        }, function () {
            $scope.$parent.loading = false;
        });

        $scope.updateCharacter = function () {
            $scope.$parent.loading = true;
            updates.post({
                type: "character",
                region: $stateParams.region,
                realm: $stateParams.realm,
                name: $stateParams.name
            }, function (queuePosition) {
                $scope.queuePosition = queuePosition;
                $scope.$parent.loading = false;

            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        };
    }

    CharacterUpdate.$inject = ["$scope", "socket", "$state", "$stateParams", "$translate", "LANGUAGES", "TIMEZONES", "characters"];
    function CharacterUpdate($scope, socket, $state, $stateParams, $translate, LANGUAGES, TIMEZONES, characters) {
        //Reset error message
        $scope.$parent.error = null;
        $scope.timezones = TIMEZONES;

        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function () {
            if ($scope.$parent.user && $scope.$parent.user.logged_in === false) {
                $state.go('dashboard');
            }
        });


        $scope.$watch('selectedLanguages', function () {
            if ($scope.character) {
                $scope.character.ad.languages = [];
                $scope.selectedLanguages.forEach(function (language) {
                    $scope.character.ad.languages.push(language.id);
                });
            }
        });

        //Initialize $scope variables
        $scope.$parent.loading = true;

        characters.get({
            "characterRegion": $stateParams.region,
            "characterRealm": $stateParams.realm,
            "characterName": $stateParams.name
        }, function (character) {
            $scope.$parent.loading = false;
            $scope.character = character;
            $scope.languages = [];
            LANGUAGES.forEach(function (language) {
                $scope.languages.push({
                    id: language,
                    name: $translate.instant("LANG_" + language.toUpperCase()),
                    selected: $scope.character.ad.languages.indexOf(language) != -1
                });
            });
        }, function () {
            $scope.$parent.loading = false;
        });

        $scope.save = function () {
            $scope.$parent.loading = true;
            characters.upsert({
                    characterRegion: $scope.character.region,
                    characterRealm: $scope.character.realm,
                    characterName: $scope.character.name,
                    part: "ad"
                }, $scope.character.ad,
                function () {
                    $state.go("account");
                },
                function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                }
            );
        };
    }

    CharacterList.$inject = ['$scope', '$stateParams', '$state', '$location', 'socket', "wlfgAppTitle", "characters"];
    function CharacterList($scope, $stateParams, $state, $location, socket, wlfgAppTitle, characters) {
        wlfgAppTitle.setTitle('Characters LFG');
        //Reset error message
        $scope.$parent.error = null;
        $scope.$parent.loading = true;
        $scope.characters = [];
        $scope.last = {};
        $scope.filters = {};
        $scope.filters.states = {};
        var initialLoading = false;
        var paginate = { since: null, max: null};

        $scope.page = (parseInt($stateParams.page) > 0) ? parseInt($stateParams.page) : 1;

        $scope.$watch('filters', function () {
            //  if ($scope.filters.states.classes && $scope.filters.states.faction && $scope.filters.states.role && $scope.filters.states.ilevel && $scope.filters.states.levelMax && $scope.filters.states.transfert && $scope.filters.states.days && $scope.filters.states.rpw && $scope.filters.states.languages && $scope.filters.states.realm && $scope.filters.states.realmZones && $scope.filters.states.sort && $scope.filters.states.progress) {
            // && $scope.filters.states.timezone
            if ($scope.filters.states.realmZones && $scope.filters.states.languages && $scope.filters.states.realm && $scope.filters.states.role && $scope.filters.states.classes && $scope.filters.states.ilevel && $scope.filters.states.faction && $scope.filters.states.progress && $scope.filters.states.days && $scope.filters.states.levelMax && $scope.filters.states.transfert && $scope.filters.states.sort) {
                if (initialLoading) {
                    $scope.page = 1;
                    paginate = { since: null, max: null};
                    $location.search('max', null);
                    $location.search('since', null);
                    $state.go('.', {page: $scope.page}, {notify: false});
                }

                $scope.characters = [];
                getCharacterAds();

               initialLoading = true;
            }
        }, true);


        $scope.getMoreCharacters = function () {
            if (($scope.$parent && $scope.$parent.loading) || $scope.loading) {
                return;
            }
            getCharacterAds();
        };

        $scope.changePage = function (page) {
            if (page > $scope.page) {
                paginate.since = $scope.characters[$scope.characters.length - 1]._id;
                paginate.max = null;
                $location.search('since', paginate.since);
                $location.search('max', null);
            } else {
                paginate.since = null;
                paginate.max = $scope.characters[0]._id;
                $location.search('since', null);
                $location.search('max', paginate.max);
            }

            $scope.page = page;
            //$state.go('.', {page: $scope.page}, {notify: false});

            $scope.characters = [];
            getCharacterAds();
        };

        function getCharacterAds() {
            $scope.loading = true;

            var params = {lfg: true, view: "detailed", number: 20, page: ($scope.page - 1)};
            params.since = paginate.since;
            params.max = paginate.max;

            if ($scope.characters.length > 0) {
                if ($scope.filters.sort == "progress") {
                    if ($scope.characters[$scope.characters.length - 1].progress) {
                        params.last = $scope.characters[$scope.characters.length - 1]._id + "." + $scope.characters[$scope.characters.length - 1].progress.score;
                    } else {
                        params.last = $scope.characters[$scope.characters.length - 1]._id + ".0";
                    }
                } else if ($scope.filters.sort == "ilevel") {

                    if ($scope.characters[$scope.characters.length - 1].bnet && $scope.characters[$scope.characters.length - 1].bnet.items && $scope.characters[$scope.characters.length - 1].bnet.items.averageItemLevelEquipped) {
                        params.last = $scope.characters[$scope.characters.length - 1]._id + "." + $scope.characters[$scope.characters.length - 1].bnet.items.averageItemLevelEquipped;
                    } else {
                        params.last = $scope.characters[$scope.characters.length - 1]._id + ".0";
                    }
                } else {
                    params.last = $scope.characters[$scope.characters.length - 1]._id + "." + $scope.characters[$scope.characters.length - 1].ad.updated;
                }

            }

            angular.extend(params, $scope.filters);
            delete params.states;

            characters.query(params, function (characters) {
                    $scope.$parent.loading = false;
                    $scope.loading = false;

                    $scope.characters = $scope.characters.concat(characters);

                },
                function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                });
        }
    }
})();