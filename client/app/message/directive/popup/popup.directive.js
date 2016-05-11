(function () {
    'use strict';

    angular
        .module('app.message')
        .controller('MessagePopupController', MessagePopupController)
        .directive('wlfgMessagePopup', wlfgMessagePopup);

    wlfgMessagePopup.$inject = ["$uibModal", "$location", "user"];
    function wlfgMessagePopup($uibModal, $location, user) {
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/message/directive/popup/popup.directive.html'
        };
        return directive;

        function link(scope, element) {
            scope.animationsEnabled = true;

            getGuildAds();
            getCharacterAds();

            scope.openMessagePopup = function (size) {
                var modalInstance = $uibModal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: 'messagePopup',
                    controller: 'MessagePopupController',
                    scope: scope,
                    size: size,
                    resolve: {
                        user: function () {
                            return scope.user;
                        }
                    }
                });
            };

            /**
             * Get user's guildAds
             */
            function getGuildAds() {
                scope.$parent.loading = true;
                user.query({param: "guildAds"}, function (guildAds) {
                    console.log(guildAds);
                    scope.guildAds = guildAds;
                    scope.$parent.loading = false;
                }, function (error) {
                    scope.$parent.error = error.data;
                    scope.$parent.loading = false;
                });
            }

            /**
             * Get user's characterAds
             */
            function getCharacterAds() {
                scope.$parent.loading = true;
                user.query({param: "characterAds"}, function (characterAds) {
                    console.log(characterAds);
                    scope.characterAds = characterAds;
                    scope.$parent.loading = false;
                }, function (error) {
                    scope.$parent.error = error.data;
                    scope.$parent.loading = false;
                });
            }

        }
    }

    MessagePopupController.$inject = ["$scope", "socket", "messages"];
    function MessagePopupController($scope, socket, messages) {

    }
})();