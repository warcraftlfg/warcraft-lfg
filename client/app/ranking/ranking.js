(function () {
    'use strict';

    angular
        .module('app.ranking')
        .controller('RankingController', Ranking);

    Ranking.$inject = ["$scope", "wlfgAppTitle","ranking"];
    function Ranking($scope, wlfgAppTitle,ranking) {
        wlfgAppTitle.setTitle("Ranking");
        //Reset error message
        $scope.$parent.error = null;
        
        ranking.get({limit:49},function(ranking){
            $scope.ranking = ranking;
        });
        $scope.getMoreRanks = function(){
            ranking.get({limit:49,start:Object.keys($scope.ranking).length},function(ranking){
                angular.extend($scope.ranking,ranking);
            });
        };
    }




})();