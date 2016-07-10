(function() {
    'use strict';

    angular
    	.module('blocks.templateLoader')
        .factory('templateLoader', templateLoader);

    templateLoader.$inject = ["$location"];
    function templateLoader($location) {
    	var template = "";
        if ($location.host() == "warcraftlfg") {
        	template = template + "lfg";
        } else if ($location.host().indexOf("warcraftprogress") >= 0) {
        	template = template +  "progress";
        } else if ($location.host().indexOf("warcraftparser") >= 0) {
        	template = template + "parser";
        } else {
        	template = "";
        }

		return {
			getTemplate: function() { return template; },
		};
    }
})();
