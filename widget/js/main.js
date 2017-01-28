/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('app', [
  'ngRoute', 'ngResource'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Widget Progress
    .when("/guild/:region/:realm/:name/ranking", { templateUrl: "partials/widget-ranking.html", controller: "WidgetRankingController"})
}]);


/**
 * Controls all other Pages
 */
app.controller('WidgetRankingController', function ($scope, $routeParams, $resource) {
  console.log($routeParams);
  ranking = $resource('https://api.warcraftprogress.com/api/v1/ranks/:tier/:raid/:region/:realm/:name', {}, { get: { method: 'get', withCredentials: false }});
  console.log(ranking);
  var query = {};
  query.raid = "The Nighthold"
  query.tier = "19";
  query.region = $routeParams.region;
  query.realm = $routeParams.realm;
  query.name = $routeParams.name;
  $scope.region = $routeParams.region;
  $scope.realm = $routeParams.realm;
  $scope.name = $routeParams.name;
  ranking.get(query, function (ranking) {
      if (ranking) {
          $scope.ranking = ranking;
      }
  });
});