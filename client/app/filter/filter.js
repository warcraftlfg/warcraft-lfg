(function() {
    'use strict';

    angular
    	.module('app.filter')
        .factory('filter', filter);

    filter.$inject = ["$stateParams", "$translate"];
    function filter($stateParams, $translate) {
    	var stateParams = $stateParams;
		return {
			initFilter: initFilter
        };
    }

    function initFilter() {
    	var filters = {};
    }
})();