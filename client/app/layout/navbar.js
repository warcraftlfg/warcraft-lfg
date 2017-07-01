(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('NavbarController', Navbar);

    Navbar.$inject = ['$scope', '$state', 'search', '$http', '__env'];
    function Navbar($scope, $state, search, $http, __env) {
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
          return $http.get(__env.apiProgressUrl+'/api/v1/search/'+val, {
              params: {
                  number: 5
              },
              withCredentials: false,
          }).then(function (response) {
              return response.data.map(function(guild) {
                  return guild;
              });
          });
      };

      $scope.onSelect = function(item, model, label, event) {
        if (event && event.type && event.type == "keydown") {
          $state.go('guild-read', {region: item.region, realm: item.realm, name: item.name});
        }
      };

      $scope.goSearch = function() {
        $state.go('search', {term: $scope.asyncSelected});
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