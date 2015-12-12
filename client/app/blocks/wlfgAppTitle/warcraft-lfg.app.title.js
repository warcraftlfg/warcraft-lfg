(function() {
    'use strict';

    angular
    	.module('blocks.wlfgAppTitle')
        .factory('wlfgAppTitle', wlfgAppTitle);


    wlfgAppTitle.$inject = ["$rootScope"];
    function wlfgAppTitle($rootScope) {
        var title = "WarcraftLFG";

		return {
			title: function() { return title; },
			setTitle: function(newTitle) { 
				if (newTitle) { 
					title = newTitle+' - WarcraftLFG'; 
				} else {
					title = "WarcraftLFG";
				}
			}
		};
    }
})();
