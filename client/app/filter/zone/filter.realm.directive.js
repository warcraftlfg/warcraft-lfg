angular
    .module('app.filter')
    .directive('wlfgFilterRealm', wlfgFilterRealm);

wlfgFilterRealm.$inject = ['$translate', '$stateParams', '$location', 'realms'];
function wlfgFilterRealm($translate, $stateParams, $location, realms) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/zone/filter.realm.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.realms = [];

        $scope.localRealms = {
            selectAll: $translate.instant("SELECT_ALL"),
            selectNone: $translate.instant("SELECT_NONE"),
            reset: $translate.instant("RESET"),
            search: $translate.instant("SEARCH"),
            nothingSelected: $translate.instant("ALL_REALMS")
        };

        $scope.filters.realm = null;

        if ($stateParams.realm) {
            var realm = $stateParams.realm;

            var params = realm.split('.');

            if (params.length == 2) {
                $scope.realms = [{
                    label: params[1] + " (" + params[0].toUpperCase() + ")",
                    selected: true
                }];
                $scope.filters.realm = realm;
            }
        }

        $scope.filters.states.realm = true;

        $scope.$watch('realmOut', function () {

            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.realmOut) {
                $location.search('realm', $scope.realmOut.region + "." + $scope.realmOut.name);
                $scope.filters.realm = $scope.realmOut.region + "." + $scope.realmOut.name;
            } else {
                $location.search('realm', null);
                $scope.filters.realm = null;
            }

            $scope.$parent.loading = true;
        }, true);

        $scope.setRealm = function (data) {
            $scope.realmOut = data;
        };

        $scope.resetRealm = function () {
            $scope.realmOut = null;
            angular.forEach($scope.realms, function (realm) {
                realm.selected = false;
            });
        };

        $scope.$on('get:realms', function () {
            console.log($scope.filters.realm_zone);
            realms.query({realm_zone: $scope.filters.realm_zone}, function (realms) {
                $scope.realms = realms;
                var realmIsInRealmZone = false;
                angular.forEach(realms, function (realm) {
                    realm.label = realm.name + " (" + realm.region.toUpperCase() + ")";
                    if ($stateParams.realm) {
                        var params = $stateParams.realm.split('.');
                        if (params.length == 2 && params[1] == realm.name && params[0] == realm.region) {
                            realm.selected = true;
                            realmIsInRealmZone = true;
                        }
                    }
                });

                if (!realmIsInRealmZone) {
                    $location.search('realm', null);
                    $scope.filters.realm = null;
                }
            });
        });
    }
}