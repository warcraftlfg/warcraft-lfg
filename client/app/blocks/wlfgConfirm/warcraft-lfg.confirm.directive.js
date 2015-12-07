angular
    .module('blocks.wlfgConfirm')
    .directive('wlfgConfirm', wlfgConfirm);

wlfgConfirm.$inject = ['$uibModal'];
function wlfgConfirm($uibModal) {
    var directive = {
        link: link,
        terminal: true,
        priority: 1
    };
    return directive;

    function link(scope, element, attrs) {

        var clickAction = attrs.ngClick;

        element.bind('click',function (event) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/blocks/wlfgConfirm/warcraft-lfg.confirm.modal.html',
                controller: 'WlfgConfirmController',
                animation: true,
                size: 'sm',
                resolve:{
                    wlfgConfirmTitle:function () {
                        return attrs.wlfgConfirmTitle;
                    },
                    wlfgConfirmContent:function () {
                        return attrs.wlfgConfirmContent;
                    }
                }
            });

            modalInstance.result.then(function () {
                scope.$eval(clickAction);
            });

        });
    }
}