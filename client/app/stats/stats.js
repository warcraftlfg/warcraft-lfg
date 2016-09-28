(function () {
    'use strict';

    angular
        .module('app.stats')
        .controller('StatsController', StatsController);

    StatsController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "$location", "$translate", "$timeout", "wlfgAppTitle", "ranking", "realms", "stats", "__env"];
    function StatsController($rootScope, $scope, $state, $stateParams, $location, $translate, $timeout, wlfgAppTitle, ranking, realms, stats, __env) {
        wlfgAppTitle.setTitle("WarcraftProgress");

        $scope.$parent.error = null;
        $scope.$parent.loading = false;


        $scope.guildCharts = {normal: {}, heroic: {}, mythic: {}};
        $scope.characterCharts = {};

        $scope.guildStats = {};
        $scope.characterStats = {};
        $scope.bosses = {};
        __env.tiers[__env.tiers.current].bosses.forEach(function (boss) {
            $scope.bosses[boss] = true;
        });

        var difficulties = ['normal', 'heroic', 'mythic'];
        stats.get({
            "tier": $stateParams.tier,
            "raid": $stateParams.raid,
            "type": "guild",
        }, function (stats) {
            $scope.guildStats = stats;
            $scope.refreshGuildCharts();

        });

        /*stats.get({
            "tier": $stateParams.tier,
            "raid": $stateParams.raid,
            "type": "character",
            "subtype": "class"
        }, function (stats) {
            $scope.characterStats = stats[0].stats;
            $scope.refreshCharacterCharts();
        });*/

        $scope.options = {
            scales: {
                xAxes: [{
                    type: 'time',

                    time: {
                        tooltipFormat: 'L LTS',
                        displayFormats: {
                            'hour': 'L LTS'
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                    }
                }]
            }
        };

        $scope.refreshGuildCharts = function () {
            difficulties.forEach(function (difficulty) {
                var chart = {labels: [], data: [], series: []};

                var bossDatas = {};
                $scope.guildStats.forEach(function (stat) {
                    chart.labels.push(parseInt(("" + stat._id).substr(0, 8), 16) * 1000);
                    angular.forEach(stat.stats[difficulty], function (value, boss) {
                        if (!bossDatas[boss]) {
                            bossDatas[boss] = [];
                        }
                        bossDatas[boss].push(stat.stats[difficulty][boss]);
                    });
                });
                angular.forEach(bossDatas, function (datas, boss) {
                    if ($scope.bosses[boss] === true) {
                        chart.data.push(datas);
                        chart.series.push(boss);
                    }
                });

                $scope.guildCharts[difficulty] = chart;

            });
        };

        /*$scope.refreshCharacterCharts = function () {
            $scope.characterStats.forEach(function (stat) {
                if (!$scope.characterCharts[stat.difficulty]) {
                    $scope.characterCharts[stat.difficulty] = {};
                }
                if (!$scope.characterCharts[stat.difficulty][stat.boss]) {
                    $scope.characterCharts[stat.difficulty][stat.boss] = {count: 0, data: [], series: []};
                }
                $scope.characterCharts[stat.difficulty][stat.boss].data.push(stat.count);
                $scope.characterCharts[stat.difficulty][stat.boss].series.push(stat.class);
            });
        };*/

    }
})();