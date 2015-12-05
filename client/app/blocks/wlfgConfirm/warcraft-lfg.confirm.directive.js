angular
    .module('blocks.wlfgConfirm')
    .directive('wlfgConfirm', wlfgConfirm);

function wlfgConfirm() {
    var directive = {
        link: link,
        terminal: true,
        priority: 1,
    };
    return directive;

    function link(scope, element, attrs) {
        scope.wlfgConfirm = {};
        scope.wlfgConfirm.title = attrs.title;
        scope.wlfgConfirm.content = attrs.content;
        scope.wlfgConfirm.href = attrs.href;
        $('#wlfgConfirmModal').modal();
        console.log(scope.wlfgConfirm);
    }
}