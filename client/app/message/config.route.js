(function() {
    'use strict';

    angular
        .module('app.message')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("message", {
                url: "/message/:type/:region/:realm/:name/",
                templateUrl: "app/message/message.html",
                controllerAs: 'vm',
                title: 'Message',
                controller: "MessageController"
            })
        ;
    }
})();