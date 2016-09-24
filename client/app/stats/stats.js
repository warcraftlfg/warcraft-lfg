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


        $scope.charts = [];
        $scope.labels = [];
        $scope.data= [];
        $scope.series = [];
        stats.get({
            "tier": $stateParams.tier,
            "raid": $stateParams.raid,
        }, function (stats) {

            var bosses = __env.tiers[__env.tiers.current].bosses;

            bosses.forEach(function(boss){
                var chart = {labels:[],data:[],series:[],options:[]};

                var bossDatas = {normal:[],heroic:[],mythic:[]};
                stats.forEach(function (stat) {
                    chart.labels.push(parseInt(("" + stat._id).substr(0, 8), 16) * 1000);
                    bossDatas.normal.push((stat.stats.normal[boss]/stat.stats.count*100).toFixed(2));
                    bossDatas.heroic.push((stat.stats.heroic[boss]/stat.stats.count*100).toFixed(2));
                    bossDatas.mythic.push((stat.stats.mythic[boss]/stat.stats.count*100).toFixed(2));
                });
                angular.forEach(bossDatas,function(datas,difficulty) {
                    chart.data.push(datas);
                    chart.series.push(difficulty);
                });
                chart.options= {
                    title: {
                        display:true,
                        text:boss
                    },
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
                                max: 100,
                                min: 0,
                                stepSize: 25
                            }
                        }]
                    }
                };
                $scope.charts.push(chart);

            });

        });



    }
})();