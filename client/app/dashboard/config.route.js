(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("dashboard", {
                url: "/",
                templateProvider: function(templateLoader) {
                    var result = templateLoader.getTemplate();
                    var template;
                    if (result == "progress") {
                        // File revision h4ck
                        template = "app/progress/progress.html";
                        return '<div ng-controller="ProgressController" ng-include="\''+template+'\'"></div>';
                    } else if (result == "parser") {
                        // File revision h4ck
                        template = "app/parser/dashboard.html";
                        return '<div ng-controller="ParserDashboardController" ng-include="\''+template+'\'"></div>';
                    } else {
                        // File revision h4ck
                        template = "app/dashboard/dashboard.html";
                        return '<div ng-controller="DashboardController" ng-include="\''+template+'\'"></div>';
                    }
                },
                controllerAs: 'vm',
                title: 'Dashboard'
            })
            .state("dashboard-progress", {
                url: "/dashboard-progress",
                templateUrl: "app/progress/progress.html",
                controlerAs: 'vm',
                title: 'Dashboard Progress',
                controller: "ProgressController"
            })
        ;
    }
})();