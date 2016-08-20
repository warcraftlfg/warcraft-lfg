angular
    .module('app.character')
    .directive('wlfgItemAudit', wlfgItemAudit);

wlfgItemAudit.$inject = ['$translate', '$stateParams', '$location'];
function wlfgItemAudit($translate) {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/directive/item/character.item-audit.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgItemAudit, function(items){

            /* WOD */
            /*var neckEnchant = [5317, 5318, 5319, 5320, 5321];
            var backEnchant = [5310, 5311, 5312, 5313, 5314];
            var ringEnchant = [5324, 5325, 5326, 5327, 5328];
            var weaponEnchant = [5336, 5384, 5335, 5334, 5330, 5337, 5275, 5276, 3366, 3367, 3368, 3370, 3595, 3847];
            var gemEnchant = [127760, 127761, 127762, 127763, 127764, 127765];*/

            /* Legion */
            var neckEnchant = [228408, 228409, 228410, 190892, 191006, 191023, 190893, 191007, 191024, 228402, 228403, 228404, 190894, 191008, 191025, 228405, 228406, 228407];
            
            var ringEnchantLow = [190866, 190992, 191009, 190867, 190993, 191010, 190868, 190994, 191011, 190869, 190995, 191012];
            var ringEnchantHigh = [190870, 190996, 191013, 190871, 190997, 191014, 190872, 190998, 191015, 190873, 190999, 191016];

            var backEnchantLow = [190875, 191001, 191018, 190876, 191002, 191019, 190874, 191000, 191017];
            var backEnchantHigh = [190878, 191004, 191021, 190879, 191005, 191022, 190877, 191003, 191020];

            var gemLow = [195848, 195851, 195849, 195850];
            var gemMedium = [195852, 195855, 195853, 195854];
            var gemHigh = [195879, 195880, 195878];

            var errorCount = 0;
            var errors = {};

            // Init errors & check gems
            angular.forEach(items, function(item, key) {
                if (item && item.icon) {
                    errors[key] = { "icon": item.icon, "problems": [] };
                } else {
                    errors[key] = { "icon": "", "problems": [] };
                }
                if (item.tooltipParams && item.tooltipParams.gem0) {
                    if (gemLow.indexOf(item.tooltipParams.gem0) >= 0) {
                        errorCount++;
                        errors[key].problems.push({'message': $translate.instant("LOW_GEM"), 'type': 'warning'});
                    } else if (gemMedium.indexOf(item.tooltipParams.gem0) >= 0) {
                        errorCount++;
                        errors[key].problems.push({'message': $translate.instant("LOW_GEM"), 'type': 'warning'});
                    } else if (gemHigh.indexOf(item.tooltipParams.gem0) == -1) {
                        errorCount++;
                        errors[key].problems.push({'message': $translate.instant("NO_GEM"), 'type': 'danger'});
                    }
                }
                if (item.tooltipParams && !item.tooltipParams.gem0 && item.bonusLists && item.bonusLists.indexOf(565) != -1 ) {
                    errorCount++;
                    errors[key].problems.push({'message': $translate.instant("NO_GEM"), 'type': 'danger'});
                }
            });

            if (items) {
                if (items.neck && items.neck.tooltipParams.enchant) {
                    if (neckEnchant.indexOf(items.neck.tooltipParams.enchant) == -1) {
                        errorCount++;
                        errors['neck'].problems.push({'message': $translate.instant("NO_ENCHANT"), 'type': 'danger'});
                    }
                } else {
                    errorCount++;
                    errors['neck'].problems.push({'message': $translate.instant("NO_ENCHANT"), 'type': 'danger'});
                }

                if (items.back && items.back.tooltipParams.enchant) {
                    if (backEnchantLow.indexOf(items.back.tooltipParams.enchant) >= 0) {
                        errorCount++;
                        errors['back'].problems.push({'message': $translate.instant("LOW_ENCHANT"), 'type': 'warning'});
                    } else if (backEnchantHigh.indexOf(items.back.tooltipParams.enchant) == -1) {
                        errorCount++;
                        errors['back'].problems.push({'message': $translate.instant("NO_ENCHANT"), 'type': 'danger'});    
                    }
                } else {
                    errorCount++;
                    errors['back'].problems.push({'message': $translate.instant("NO_ENCHANT"), 'type': 'danger'});
                }

                if (items.finger1 && items.finger1.tooltipParams.enchant) {
                    if (ringEnchantLow.indexOf(items.finger1.tooltipParams.enchant) >= 0) {
                        errorCount++;
                        errors['finger1'].problems.push({'message': $translate.instant("LOW_ENCHANT"), 'type': 'warning'});
                    } else if (ringEnchantHigh.indexOf(items.finger1.tooltipParams.enchant) == -1) {
                        errorCount++;
                        errors['finger1'].problems.push({'message': $translate.instant("NO_ENCHANT"), 'type': 'danger'});
                    }
                } else {
                    if (!items.finger1) {
                        items.finger1 = {icon: ""};
                    }
                    errorCount++;
                    errors['finger1'].problems.push({'message': $translate.instant("NO_ENCHANT"), 'type': 'danger'});
                }

                if (items.finger2 && items.finger2.tooltipParams.enchant) {
                    if (ringEnchantLow.indexOf(items.finger1.tooltipParams.enchant) >= 0) {
                        errorCount++;
                        errors['finger2'].problems.push({'message': $translate.instant("LOW_ENCHANT"), 'type': 'warning'});
                    } else if (ringEnchantHigh.indexOf(items.finger1.tooltipParams.enchant) == -1) {
                        errorCount++;
                        errors['finger2'].problems.push({'message': $translate.instant("NO_ENCHANT"), 'type': 'danger'});
                    }
                } else {
                    if (!items.finger2) {
                        items.finger2 = {icon: ""};
                    }
                    errorCount++;
                    errors['finger2'].problems.push({'message': $translate.instant("NO_ENCHANT"), 'type': 'danger'});
                }

                /*if (items.mainHand && items.mainHand.tooltipParams.enchant) {
                    if (weaponEnchant.indexOf(items.mainHand.tooltipParams.enchant) == -1) {
                        errorCount++;
                        errors.push($translate.instant("LOW_MAINHAND_ENCHANT"));
                    }
                } else {
                    errorCount++;
                    errors.push($translate.instant("NO_MAINHAND_ENCHANT"));
                }

                if (items.offHand && items.offHand.weaponInfo) {
                    if (items.offHand.tooltipParams.enchant) {
                        if (weaponEnchant.indexOf(items.offHand.tooltipParams.enchant) == -1) {
                            errorCount++;
                            errors.push($translate.instant("LOW_OFFHAND_ENCHANT"));
                        }
                    } else {
                        errorCount++;
                        errors.push($translate.instant("NO_OFFHAND_ENCHANT"));
                    }
                }*/
            }

            scope.errorCount = errorCount;
            scope.audits = errors;
        }, true);
    }
}