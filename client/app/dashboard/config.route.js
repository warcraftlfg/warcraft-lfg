(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider.state("dashboard", {
            url: "/",
            templateUrl: "app/dashboard/dashboard.html",
            controllerAs: 'vm',
            title: 'Dashboard',
            controller: "DashboardController"
        });
    }
})();