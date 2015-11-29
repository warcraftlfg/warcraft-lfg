angular
    .module('app.character')
    .directive('wlfgItemAudit', wlfgItemAudit);

function wlfgItemAudit() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/character.item-audit.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgItemAudit, function(items){
            /*
            $neckEnchant = array(5317, 5318, 5319, 5320, 5321);
            $backEnchant = array(5310, 5311, 5312, 5313, 5314);
            $ringEnchant = array(5324, 5325, 5326, 5327, 5328);
            $weaponEnchant = array(5336, 5384, 5335, 5334, 5330, 5337, 5275, 5276, 3366, 3367, 3368, 3370, 3595, 3847);
            */

            var neckEnchant = [5317, 5318, 5319, 5320, 5321];
            var backEnchant = [5310, 5311, 5312, 5313, 5314];
            var ringEnchant = [5324, 5325, 5326, 5327, 5328];
            var weaponEnchant = [5336, 5384, 5335, 5334, 5330, 5337, 5275, 5276, 3366, 3367, 3368, 3370, 3595, 3847];
            var gemEnchant = [127760, 127761, 127762, 127763, 127764, 127765];

            var error = 0;
            var error_msg = '';
            if (items) {
                if (items.neck && items.neck.tooltipParams.enchant) {
                } else {
                    error++;
                    error_msg += 'No neck enchant.<br>';
                }

                if (items.back && items.back.tooltipParams.enchant) {

                } else {
                    error++;
                    error_msg += 'No back enchant.<br>';
                }

                if (items.finger1 && items.finger1.tooltipParams.enchant) {

                } else {
                    error++;
                    error_msg += 'No finger2 enchant.<br>';
                }

                if (items.finger2 && items.finger2.tooltipParams.enchant) {

                } else {
                    error++;
                    error_msg += 'No finger2 enchant.<br>';
                }

                if (items.mainHand && items.mainHand.tooltipParams.enchant) {

                } else {
                    error++;
                    error_msg += 'No mainHand enchant.<br>';
                }

                if (items.offHand && items.offHand.weaponInfo) {
                    if (items.offHand.tooltipParams.enchant) {

                    } else {
                        error++;
                        error_msg += 'No offhand enchant.<br>';
                    }
                }
            }

            error_msg = "toto";
            scope.error = error;
            scope.error_msg = error_msg;
        }, true);
    }
}