(function() {
    'use strict';

    angular
        .module('app.message')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("message", {
                url: "/messages/",
                templateUrl: "app/message/message.html",
                controllerAs: 'vm',
                title: 'Message',
                controller: "MessageController"
            })
            .state("messageRead", {
                url: "/messages/:creatorId/:type/:region/:realm/:name/",
                templateUrl: "app/message/read.html",
                controllerAs: 'vm',
                title: 'Message',
                controller: "MessageController"
            })
        ;
    }
})();