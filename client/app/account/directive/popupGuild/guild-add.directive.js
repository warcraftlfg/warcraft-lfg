(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountGuildAddPopupController', AccountGuildAddPopupController)
        .directive('wlfgGuildAddPopup', wlfgGuildAddPopup);

    wlfgGuildAddPopup.$inject = ["$uibModal", "$location"];
    function wlfgGuildAddPopup($uibModal, $location) {
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/account/directive/popupGuild/guild-add.html'
        };
        return directive;

        function link(scope, element) {
            scope.animationsEnabled = true;

            scope.openGuildAddPopup = function (size) {
                var modalInstance = $uibModal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: 'guildAddPopup',
                    controller: 'AccountGuildAddPopupController',
                    scope: scope,
                    size: size
                });
            };
        }
    }

    AccountGuildAddPopupController.$inject = ["$scope", "$filter", "$uibModalInstance", "socket", "user"];
    function AccountGuildAddPopupController($scope, $filter, $uibModalInstance, socket, user) {
        /**
         * Get user's guilds by region
         */
        $scope.updateGuildRegion = function () {
            if ($scope.guildRegion === '') {
                $scope.userGuilds = null;
            } else {
                $scope.$parent.loading = true;
                $scope.userGuilds = user.query({param: "guilds", region: $scope.guildRegion}, function () {
                    $scope.$parent.loading = false;
                }, function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();