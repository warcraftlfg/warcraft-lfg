(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('NavbarController', Navbar);

    Navbar.$inject = ['$scope', 'search', '$http', '__env'];
    function Navbar($scope, search, $http, __env) {
        $scope.warcraftLfgUrl = __env.warcraftLfgUrl;
        $scope.warcraftProgressUrl = __env.warcraftProgressUrl;
        $scope.warcraftParserUrl = __env.warcraftParserUrl;
        $scope.apiUrl = __env.apiUrl;
        if (__env.html5) {
            $scope.hashbang = '';
            $scope.hashbangAbs = '';
        } else {
            $scope.hashbang = '#';
            $scope.hashbangAbs = '#/';
        }

        $scope.getLocation = function(val) {
            return $http.get(__env.apiUrl+'/api/v1/guilds/search/'+val, {
                params: {
                    number: 5
                }
            }).then(function (response) {
                return response.data.map(function(guild) {
                    console.log(guild);
                    return guild;
                });
            });
      };

      $scope.ngModelOptionsSelected = function(value) {
        if (arguments.length) {
          _selected = value;
        } else {
          return _selected;
        }
      };

      $scope.modelOptions = {
        debounce: {
          default: 500,
          blur: 250
        },
        getterSetter: true
      };
    }
})();