(function() {
    'use strict';

    angular
        .module('app.message')
        .config(getRoutes);

    function getRoutes($stateProvider) {
        $stateProvider
            .state("messageList", {
                url: "/messages/",
                templateUrl: "app/message/message.html",
                controllerAs: 'vm',
                title: 'Message',
                controller: "MessageController"
            })
            .state("message", {
                url: "/messages/:objId1/:objId2/",
                templateUrl: "app/message/message.html",
                controllerAs: 'vm',
                title: 'Message',
                controller: "MessageController"
            })

        ;
    }
})();