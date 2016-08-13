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

        $scope.$parent.error = null;
        $scope.$parent.loading = true;
        $scope.characters = [];
        $scope.last = {};
        $scope.filters = {};
        $scope.filters.states = {};
        var initialLoading = false;
        var paginate = { since: false, max: false, character: null };

        $scope.page = (parseInt($stateParams.page) > 0) ? parseInt($stateParams.page) : 1;

        $scope.$watch('filters', function () {
            //  if ($scope.filters.states.classes && $scope.filters.states.faction && $scope.filters.states.role && $scope.filters.states.ilevel && $scope.filters.states.levelMax && $scope.filters.states.transfert && $scope.filters.states.days && $scope.filters.states.rpw && $scope.filters.states.languages && $scope.filters.states.realm && $scope.filters.states.realmZones && $scope.filters.states.sort && $scope.filters.states.progress) {
            // && $scope.filters.states.timezone
            if ($scope.filters.states.realmZones && $scope.filters.states.languages && $scope.filters.states.realm && $scope.filters.states.role && $scope.filters.states.classes && $scope.filters.states.ilevel && $scope.filters.states.faction && $scope.filters.states.progress && $scope.filters.states.days && $scope.filters.states.levelMax && $scope.filters.states.transfert && $scope.filters.states.sort) {
                if (initialLoading) {
                    $scope.page = 1;
                    paginate = { since: false, max: false, character: null };
                }

                $scope.characters = [];
                getCharacterAds();

               initialLoading = true;
            }
        }, true);

        $scope.changePage = function (page) {
            if (page > $scope.page) {
                paginate.character = $scope.characters[$scope.characters.length - 1];
                paginate.since = true;
                paginate.max = false;
            } else {
                paginate.since = false;
                paginate.max = true;
                paginate.character = $scope.characters[0];
            }

            if (page <= 1) {
                paginate = { since: false, max: false, character: null };
            }

            $scope.page = page;

            $scope.characters = [];
            getCharacterAds();
        };

        function getCharacterAds() {
            $scope.loading = true;

            var params = {lfg: true, view: "detailed", number: 20, page: ($scope.page - 1)};

            if ((paginate.max || paginate.since) && paginate.character) {
                var type = (paginate.max) ? 'max' : 'since';
                if ($scope.filters.sort == "progress") {
                    if (paginate.character.progress) {
                        params.last = paginate.character._id + "." + paginate.character.progress.score;
                    } else {
                        params.last = paginate.character._id + ".0";
                    }
                } else if ($scope.filters.sort == "ilevel") {

                    if (paginate.character.bnet && paginate.character.bnet.items && paginate.character.bnet.items.averageItemLevelEquipped) {
                        params.last = paginate.character._id + "." + paginate.character.bnet.items.averageItemLevelEquipped;
                    } else {
                        params.last = paginate.character._id + ".0";
                    }
                } else {
                    params.last = paginate.character._id + "." + paginate.character.ad.updated;
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
                }
            );
        }
    }
})();