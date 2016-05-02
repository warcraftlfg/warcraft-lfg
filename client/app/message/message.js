(function () {
    'use strict';

    angular
        .module('app.message')
        .controller('MessageController', Message)
    ;

    Message.$inject = ["$scope", "socket", "$stateParams", "$location", "messages", "wlfgAppTitle"];
    function Message($scope, socket, $stateParams, $location, messages, wlfgAppTitle) {
        wlfgAppTitle.setTitle($stateParams.name + ' @ ' + $stateParams.realm + ' (' + $stateParams.region.toUpperCase() + ')');
        //Reset error message
        $scope.$parent.error = null;

        $scope.region = $stateParams.region;
        $scope.realm = $stateParams.realm;
        $scope.name = $stateParams.name;
        $scope.type = $stateParams.type;
        $scope.recipient = $location.search().recipient;

        $scope.$parent.loading = true;

        messages.query({
        }, function (messageList) {
            $scope.$parent.loading = false;
            $scope.messageList = messageList;
        }, function (error) {
            $scope.$parent.error = error.data;
            $scope.$parent.loading = false;
        });

        messages.query({
            creatorId: $stateParams.creatorId,
            type: $stateParams.type,
            region: $stateParams.region,
            realm: $stateParams.realm,
            name: $stateParams.name
        }, function (messages) {
            $scope.$parent.loading = false;
            $scope.messages = messages;
        }, function (error) {
            $scope.$parent.error = error.data;
            $scope.$parent.loading = false;
        });


        $scope.newMessage = {text: ""};

        $scope.sendMessage = function () {
            messages.post({
                creatorId: $stateParams.creatorId,
                type: $stateParams.type,
                region: $stateParams.region,
                realm: $stateParams.realm,
                name: $stateParams.name,
                text: $scope.newMessage.text
            }, function () {
                $scope.newMessage.text = "";
            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        };


        socket.forward('newMessage', $scope);
        $scope.$on('socket:newMessage', function (ev, message) {
            if (message.creatorId == $stateParams.creatorId && message.type == $stateParams.type && message.region == $stateParams.region && message.realm == $stateParams.realm && message.name == $stateParams.name) {
                $scope.messages.push(message);
            }
        });
    }
})();