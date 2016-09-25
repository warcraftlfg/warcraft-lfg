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


        $scope.charts = {normal: {}, heroic: {}, mythic: {}};
        $scope.labels = [];
        $scope.data = [];
        $scope.series = [];
        $scope.stats = {};
        $scope.bosses = {};
        __env.tiers[__env.tiers.current].bosses.forEach(function (boss) {
            $scope.bosses[boss] = true;
        });

        var difficulties = ['normal', 'heroic', 'mythic'];
        stats.getGuildStats({
            "tier": $stateParams.tier,
            "raid": $stateParams.raid,
        }, function (stats) {
            $scope.stats = stats;
            $scope.refreshCharts();

        });
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

        $scope.refreshCharts = function () {
            difficulties.forEach(function (difficulty) {
                var chart = {labels: [], data: [], series: []};

                var bossDatas = {};
                $scope.stats.forEach(function (stat) {
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

                $scope.charts[difficulty] = chart;

            });
        };


    }
})();