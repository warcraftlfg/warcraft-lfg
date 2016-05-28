(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountCharacterAddPopupController', AccountCharacterAddPopupController)
        .directive('wlfgCharacterAddPopup', wlfgCharacterAddPopup);

    wlfgCharacterAddPopup.$inject = ["$uibModal", "$location"];
    function wlfgCharacterAddPopup($uibModal, $location) {
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/account/directive/popupCharacter/character-add.html'
        };
        return directive;

        function link(scope, element) {
            scope.animationsEnabled = true;

            scope.openCharacterAddPopup = function (size) {
                var modalInstance = $uibModal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: 'characterAddPopup',
                    controller: 'AccountCharacterAddPopupController',
                    scope: scope,
                    size: size
                });
            };
        }
    }

    AccountCharacterAddPopupController.$inject = ["$scope", "$filter", "$uibModalInstance",  "socket", "user"];
    function AccountCharacterAddPopupController($scope, $filter, $uibModalInstance, socket, user) {
        /**
         * Get user's characters  by region
         */
        $scope.updateCharacterRegion = function () {
            console.log($scope.characterRegion);
            if ($scope.characterRegion === '') {
                $scope.userCharacters = null;
            } else {
                $scope.$parent.loading = true;
                user.query({param: "characters", region: $scope.characterRegion}, function (characters) {
                    $scope.userCharacters = $filter('orderBy')(characters, ['-level', 'name']);
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