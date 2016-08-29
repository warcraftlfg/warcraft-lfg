(function() {
    'use strict';

    angular
        .module('blocks.wlfgConfirm')
        .controller('WlfgConfirmController', WlfgConfirm)
    ;

    WlfgConfirm.$inject = ["$scope","$uibModalInstance","wlfgConfirmTitle","wlfgConfirmContent"];
    function WlfgConfirm($scope,$uibModalInstance,wlfgConfirmTitle,wlfgConfirmContent) {
        $scope.wlfgConfirmTitle = wlfgConfirmTitle;
        $scope.wlfgConfirmContent = wlfgConfirmContent;

        $scope.validate = function(){
            $uibModalInstance.close();
        };
        $scope.cancel = function(){
            $uibModalInstance.dismiss();
        };
    }
})();

