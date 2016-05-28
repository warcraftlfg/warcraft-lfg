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

            scope.openMessagePopup = function (size) {
                var modalInstance = $uibModal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: 'messagePopup',
                    controller: 'MessagePopupController',
                    scope: scope,
                    size: size
                });
            };
        }
    }

    MessagePopupController.$inject = ["$scope", "$uibModalInstance", "user"];
    function MessagePopupController($scope, $uibModalInstance, user) {

        if ($scope.user && $scope.user.id) {
            getGuildAds();
            getCharacterAds();
        }

        /**
         * Get user's guildAds
         */
        function getGuildAds() {
            $scope.$parent.loading = true;
            user.query({param: "guildAds"}, function (guildAds) {
                $scope.guildAds = guildAds;
                $scope.$parent.loading = false;
            }, function (error) {
                scope.$parent.loading = false;
            });
        }

        /**
         * Get user's characterAds
         */
        function getCharacterAds() {
            $scope.$parent.loading = true;
            user.query({param: "characterAds"}, function (characterAds) {
                $scope.characterAds = characterAds;
                $scope.$parent.loading = false;
            }, function (error) {
                $scope.$parent.loading = false;
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();