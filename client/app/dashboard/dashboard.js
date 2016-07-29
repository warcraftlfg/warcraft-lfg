(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', Dashboard);

    Dashboard.$inject = ['$rootScope', '$scope', '$state', '$translate', 'socket', 'LANGUAGES', "wlfgAppTitle", "characters", "guilds"];
    function Dashboard($rootScope, $scope, $state, $translate, socket, LANGUAGES, wlfgAppTitle, characters, guilds) {
        wlfgAppTitle.setTitle('Home');

        $scope.$parent.loading = false;

        $scope.realmZones = [
            {name: 'EU', msGroup: true},
            {
                name: $translate.instant("ENGLISH"),
                region: "eu",
                locale: "en_GB",
                zone: "Europe",
                cities: ["Paris"],
                selected: false
            },
            {
                name: $translate.instant("GERMAN"),
                region: "eu",
                locale: "de_DE",
                zone: "Europe",
                cities: ["Paris"],
                selected: false
            },
            {
                name: $translate.instant("FRENCH"),
                region: "eu",
                locale: "fr_FR",
                zone: "Europe",
                cities: ["Paris"],
                selected: false
            },
            {
                name: $translate.instant("SPANISH"),
                region: "eu",
                locale: "es_ES",
                zone: "Europe",
                cities: ["Paris"],
                selected: false
            },
            {
                name: $translate.instant("RUSSIAN"),
                region: "eu",
                locale: "ru_RU",
                zone: "Europe",
                cities: ["Paris"],
                selected: false
            },
            {
                name: $translate.instant("ITALIAN"),
                region: "eu",
                locale: "it_IT",
                zone: "Europe",
                cities: ["Paris"],
                selected: false
            },
            {
                name: $translate.instant("PORTUGUESE"),
                region: "eu",
                locale: "pt_BR",
                zone: "Europe",
                cities: ["Paris"],
                selected: false
            },
            {msGroup: false},
            {name: 'US', msGroup: true},
            {
                name: $translate.instant("OCEANIC"),
                region: "us",
                locale: "en_US",
                zone: "Australia",
                cities: ["Melbourne"],
                selected: false
            },
            {
                name: $translate.instant("LATIN_AMERICA"),
                region: "us",
                locale: "es_MX",
                zone: "America",
                cities: ["Chicago"],
                selected: false
            },
            {
                name: $translate.instant("BRAZIL"),
                region: "us",
                locale: "pt_BR",
                zone: "America",
                cities: ["Sao_Paulo"],
                selected: false
            },
            {name: 'USA', msGroup: true},
            {
                name: $translate.instant("USA_PACIFIC"),
                region: "us",
                locale: "en_US",
                zone: "America",
                cities: ["Los_Angeles"],
                selected: false
            },
            {
                name: $translate.instant("USA_MOUNTAIN"),
                region: "us",
                locale: "en_US",
                zone: "America",
                cities: ["Denver"],
                selected: false
            },
            {
                name: $translate.instant("USA_CENTRAL"),
                region: "us",
                locale: "en_US",
                zone: "America",
                cities: ["Chicago"],
                selected: false
            },
            {
                name: $translate.instant("USA_EASTERN"),
                region: "us",
                locale: "en_US",
                zone: "America",
                cities: ["New_York"],
                selected: false
            },
            {msGroup: false},
            {msGroup: false},
            {
                name: $translate.instant("TAIWANESE"),
                region: "tw",
                locale: "zh_TW",
                zone: "Asia",
                cities: ["Taipei"],
                selected: false
            },
            {
                name: $translate.instant("KOREAN"),
                region: "kr",
                locale: "ko_KR",
                zone: "Asia",
                cities: ["Seoul"],
                selected: false
            }
        ];

        $scope.localRealmZones = {
            selectAll: $translate.instant("SELECT_ALL"),
            selectNone: $translate.instant("SELECT_NONE"),
            reset: $translate.instant("RESET"),
            search: $translate.instant("SEARCH"),
            nothingSelected: $translate.instant("ALL_REALMZONES")
        };

        $rootScope.$on('$translateChangeSuccess', function () {
            $scope.realmZones = [
                {name: 'EU', msGroup: true},
                {
                    name: $translate.instant("ENGLISH"),
                    region: "eu",
                    locale: "en_GB",
                    zone: "Europe",
                    cities: ["Paris"],
                    selected: false
                },
                {
                    name: $translate.instant("GERMAN"),
                    region: "eu",
                    locale: "de_DE",
                    zone: "Europe",
                    cities: ["Paris"],
                    selected: false
                },
                {
                    name: $translate.instant("FRENCH"),
                    region: "eu",
                    locale: "fr_FR",
                    zone: "Europe",
                    cities: ["Paris"],
                    selected: false
                },
                {
                    name: $translate.instant("SPANISH"),
                    region: "eu",
                    locale: "es_ES",
                    zone: "Europe",
                    cities: ["Paris"],
                    selected: false
                },
                {
                    name: $translate.instant("RUSSIAN"),
                    region: "eu",
                    locale: "ru_RU",
                    zone: "Europe",
                    cities: ["Paris"],
                    selected: false
                },
                {
                    name: $translate.instant("ITALIAN"),
                    region: "eu",
                    locale: "it_IT",
                    zone: "Europe",
                    cities: ["Paris"],
                    selected: false
                },
                {
                    name: $translate.instant("PORTUGUESE"),
                    region: "eu",
                    locale: "pt_BR",
                    zone: "Europe",
                    cities: ["Paris"],
                    selected: false
                },
                {msGroup: false},
                {name: 'US', msGroup: true},
                {
                    name: $translate.instant("OCEANIC"),
                    region: "us",
                    locale: "en_US",
                    zone: "Australia",
                    cities: ["Melbourne"],
                    selected: false
                },
                {
                    name: $translate.instant("LATIN_AMERICA"),
                    region: "us",
                    locale: "es_MX",
                    zone: "America",
                    cities: ["Chicago"],
                    selected: false
                },
                {
                    name: $translate.instant("BRAZIL"),
                    region: "us",
                    locale: "pt_BR",
                    zone: "America",
                    cities: ["Sao_Paulo"],
                    selected: false
                },
                {name: 'USA', msGroup: true},
                {
                    name: $translate.instant("USA_PACIFIC"),
                    region: "us",
                    locale: "en_US",
                    zone: "America",
                    cities: ["Los_Angeles"],
                    selected: false
                },
                {
                    name: $translate.instant("USA_MOUNTAIN"),
                    region: "us",
                    locale: "en_US",
                    zone: "America",
                    cities: ["Denver"],
                    selected: false
                },
                {
                    name: $translate.instant("USA_CENTRAL"),
                    region: "us",
                    locale: "en_US",
                    zone: "America",
                    cities: ["Chicago"],
                    selected: false
                },
                {
                    name: $translate.instant("USA_EASTERN"),
                    region: "us",
                    locale: "en_US",
                    zone: "America",
                    cities: ["New_York"],
                    selected: false
                },
                {msGroup: false},
                {msGroup: false},
                {
                    name: $translate.instant("TAIWANESE"),
                    region: "tw",
                    locale: "zh_TW",
                    zone: "Asia",
                    cities: ["Taipei"],
                    selected: false
                },
                {
                    name: $translate.instant("KOREAN"),
                    region: "kr",
                    locale: "ko_KR",
                    zone: "Asia",
                    cities: ["Seoul"],
                    selected: false
                }
            ];

            $scope.localRealmZones = {
                selectAll: $translate.instant("SELECT_ALL"),
                selectNone: $translate.instant("SELECT_NONE"),
                reset: $translate.instant("RESET"),
                search: $translate.instant("SEARCH"),
                nothingSelected: $translate.instant("ALL_REALMZONES")
            };
        });

        //Reset error message
        $scope.$parent.error = null;
        $scope.languages = LANGUAGES;

        //Initialize $scope variables
        $scope.guildAds = guilds.query({lfg: true, view: "minimal"});
        $scope.characterAds = characters.query({lfg: true, view: "minimal"});

        //Initialize $scope variables
        $scope.guildAdsCount = guilds.get({part: "count", lfg: true, view: "minimal"});
        $scope.characterAdsCount = characters.get({part: "count", lfg: true, view: "minimal"});


        $scope.form = {type: "guild", region: "", language: "", realmZones: []};

        $scope.CTAFormSubmit = function () {

            var realmZones = [];
            angular.forEach($scope.form.realmZones, function (realmZone) {
                realmZones.push(realmZone.region + '.' + realmZone.locale + "." + realmZone.zone + "." + realmZone.cities.join('::'));
            });

            $state.go($scope.form.type + '-list', {
                region: $scope.form.region,
                language: $scope.form.language,
                faction: $scope.form.faction,
                realm_zone: realmZones
            });
        };

    }
})();