(function () {
    'use strict';

    angular
        .module('app.message')
        .controller('MessageController', Message)
        .filter('conversationOrderFilter', ConversationOrderFilter)
    ;

    Message.$inject = ["$scope", "socket", "$stateParams", "messages"];
    function Message($scope, socket, $stateParams, messages) {
        //Reset error message
        $scope.$parent.error = null;

        $scope.$parent.loading = true;
        $scope.objId1 = $stateParams.objId1;
        $scope.objId2 = $stateParams.objId2;
        $scope.entitiesKey = [];

        if ($stateParams.objId1 && $stateParams.objId2) {
            //Get Messages for current conversation
            messages.get($stateParams, function (result) {
                $scope.$parent.loading = false;
                $scope.messages = result.messages;
                $scope.entities = result.entities;
                console.log($scope.messages);
                angular.forEach(result.entities, function(value, key) {
                    if (!Array.isArray(value.id)) {
                        $scope.entitiesKey[value.id] = value;
                    } else {

                    }
                });
                console.log($scope.entitiesKey);
            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        }

        function getConversations() {
            //Get All conversations
            messages.query(function (conversations) {
                    $scope.$parent.loading = false;
                $scope.conversations = conversations;
            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        }

        getConversations();

        $scope.newMessage = {text: ""};

        $scope.sendMessage = function () {
            messages.post({
                objId1: $stateParams.objId1,
                objId2: $stateParams.objId2,
                text: $scope.newMessage.text
            }, function () {
                $scope.newMessage.text = "";
            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        };


        $scope.$on('socket:newMessage', function (ev, message) {
            if ((message.objIds[0] == $stateParams.objId1 || message.objIds[0] == $stateParams.objId2) && (message.objIds[1] == $stateParams.objId1 || message.objIds[1] == $stateParams.objId2)) {
                $scope.messages.push(message);
                console.log('push message');
                $(".messages").getNiceScroll().resize();
                $scope.reInit();
            }
            getConversations();
        });
    }

    ConversationOrderFilter.$inject = [];
    function ConversationOrderFilter() {
        return function(item, userId) {
            if (item[0].id == userId) {
                return item.slice().reverse();
            } else {
                return item;
            }
        }
    }

})();