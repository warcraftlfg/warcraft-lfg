(function() {
    'use strict';

    angular
        .module('app.account')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider.state("account", {
            url: "/account/",
            templateUrl: "app/account/account.html",
            controllerAs: 'vm',
            title: 'Account',
            controller: "AccountController"
        });
    }
})();