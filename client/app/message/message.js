(function () {
    'use strict';

    angular
        .module('app.message')
        .controller('MessageController', Message)
        .filter('conversationOrderFilter', ConversationOrderFilter)
        .filter('conversationDateFilter', ConversationDateFilter)
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
            getMessage();
        }

        function getConversations() {
            //Get All conversations
            messages.query(function (conversations) {
                console.log(conversations);
                $scope.$emit("updateMessageCount");
                $scope.$parent.loading = false;
                $scope.conversations = conversations;
                if (!$stateParams.objId1 && !$stateParams.objId2) {
                    $stateParams.objId1 = conversations[0].entities[0]._id || conversations[0].entities[0].id;
                    $stateParams.objId2 = conversations[0].entities[1]._id || conversations[0].entities[1].id;

                    $scope.objId1 = $stateParams.objId1;
                    $scope.objId2 = $stateParams.objId2;
                    getMessage();
                }
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
                resetCount();
            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        };

        $scope.$on('socket:newMessage', function (ev, message) {
            if ((message.objIds[0] == $stateParams.objId1 || message.objIds[0] == $stateParams.objId2) && (message.objIds[1] == $stateParams.objId1 || message.objIds[1] == $stateParams.objId2)) {
                $scope.messages.push(message);
            }
            getConversations();
        });

        $scope.getStyle = function (index) {
            if (index === 0) {
                $scope.messages[index].style = "#202020";
                $scope.messages[index].styleInverse = "#252525";
                return {
                    'background-color': '#202020'
                };
            } else if ($scope.messages[index - 1] && $scope.messages[index - 1].userId == $scope.messages[index].userId) {
                $scope.messages[index].style = $scope.messages[index - 1].style;
                $scope.messages[index].styleInverse = $scope.messages[index - 1].styleInverse;
                return {
                    'background-color': $scope.messages[index - 1].style
                };
            } else if ($scope.messages[index - 1] && $scope.messages[index - 1].userId != $scope.messages[index].userId) {
                $scope.messages[index].style = $scope.messages[index - 1].styleInverse;
                $scope.messages[index].styleInverse = $scope.messages[index - 1].style;
                return {
                    'background-color': $scope.messages[index - 1].styleInverse
                };
            }
        };

        $scope.getDisplay = function (index) {
            if (index === 0) {
                return true;
            } else if ($scope.messages[index - 1] && $scope.messages[index - 1].userId == $scope.messages[index].userId) {
                var timestamp1 = parseInt(("" + $scope.messages[index - 1]._id).substr(0, 8), 16) * 1000;
                var timestamp2 = parseInt(("" + $scope.messages[index]._id).substr(0, 8), 16) * 1000;
                if ((timestamp2 - timestamp1) > 60000) {
                    return true;
                }
                return false;
            } else {
                return true;
            }
        };

        $scope.focusInput = function () {
            // Set focus+select on message input
            document.getElementById("message-input").focus();
            document.getElementById("message-input").select();
            resetCount();
        };

        $scope.focusInput();

        function resetCount(callback) {
            if ($stateParams.objId1 && $stateParams.objId2) {
                messages.get({
                    objId1: $stateParams.objId1,
                    objId2: $stateParams.objId2,
                    param: "resetCount"
                }, function () {
                    $scope.$parent.loading = false;
                    getConversations();
                }, function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                });
            }
        }

        function getMessage() {
            //Get Messages for current conversation
            messages.get($stateParams, function (result) {
                $scope.$parent.loading = false;
                $scope.messages = result.messages;
                $scope.entities = result.entities;
                angular.forEach(result.entities, function (value, key) {
                    if (!Array.isArray(value.id)) {
                        $scope.entitiesKey[value.id] = value;
                    } else {
                        angular.forEach(value.id, function (value2, key2) {
                            $scope.entitiesKey[value2] = value;
                        });
                    }
                });
            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        }
    }

    ConversationOrderFilter.$inject = [];
    function ConversationOrderFilter() {
        return function (item, userId) {
            if (item[0].id == userId) {
                return item.slice().reverse();
            } else {
                return item;
            }
        };
    }

    ConversationDateFilter.$inject = ['moment'];
    function ConversationDateFilter(moment) {
        return function (item) {
            var date = new moment();
            if (date.format('DD-MM-YYYY') == item.format('DD-MM-YYYY')) {
                return item.format('HH:mm');
            } else {
                return item.format('DD/MM/YYYY HH:mm');
            }
        };
    }

})();