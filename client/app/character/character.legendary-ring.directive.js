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
        scope.$watch(attrs.wlfgLegendaryRing, function(ring) {
            if (ring && ring.id>=124634 && ring.id<=124638) {
               element.html('<span class="ring"><img src="http://media.blizzard.com/wow/icons/56/'+ring.icon+'.jpg" /> :</span> <span class="legendary">'+ring.itemLevel+'</span>');
            } else if (ring && ring.id >= 118305 && ring.id <= 118309) {
               element.html('<span class="ring"><img src="http://media.blizzard.com/wow/icons/56/'+ring.icon+'.jpg" /> :</span> <span class="epic">'+ring.itemLevel+'</span>');
            } else if (ring && ring.id >= 118300 && ring.id <= 118304) {
               element.html('<span class="ring"><img src="http://media.blizzard.com/wow/icons/56/'+ring.icon+'.jpg" /> :</span> <span class="rare">'+ring.itemLevel+'</span>');
            } else if (ring && ring.id >= 118295 && ring.id <= 118299) {
               element.html('<span class="ring"><img src="http://media.blizzard.com/wow/icons/56/'+ring.icon+'.jpg" /> :</span> <span class="uncommon">'+ring.itemLevel+'</span>');
            } else if (ring && ring.id >= 118290 && ring.id <= 118294) {
               element.html('<span class="ring"><img src="http://media.blizzard.com/wow/icons/56/'+ring.icon+'.jpg" /> :</span> <span class="common">'+ring.itemLevel+'</span>');
            }
        });
    }

}