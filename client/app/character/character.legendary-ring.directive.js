angular
    .module('app.character')
    .directive('wlfgLegendaryRing', legendaryRing);

function legendaryRing() {
    var directive = {
        link: link,
        restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgLegendaryRing, function(ring){
            if(ring && ring.id>=124634 && ring.id<=124638){
               element.html('<span class="ring">'+ring.itemLevel+'&nbsp;<img src="http://media.blizzard.com/wow/icons/56/'+ring.icon+'.jpg" /></span>');
            }
        });
    }

}