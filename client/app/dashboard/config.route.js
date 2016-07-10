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

                    // Retrieve the cached template content from $templateCache service
                    //return '<div ng-include="\'app/home/home-' + result + '.html\'"></div>';
                    if (result == "progress") {
                        return '<div ng-controller="ProgressController" ng-include="\'app/progress/progress.html\'"></div>';
                    } else {
                        return '<div ng-controller="DashboardController" ng-include="\'app/dashboard/dashboard.html\'"></div>';
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