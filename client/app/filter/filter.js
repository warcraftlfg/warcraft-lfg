(function() {
    'use strict';

    angular
    	.module('app.filter')
        .factory('filter', filter);

    filter.$inject = ["$stateParams", "$translate"];
    function filter($stateParams, $translate) {
    	var stateParams = $stateParams;
		return {
			initFilter: initFilter,
			stateParamsFilter: function() { stateParamsFilter(stateParams); },
		};
    }

    function initFilter() {
    	var filters = {};
        filters.faction = "";
        filters.lvlmax = true;
        filters.region = "";
        filters.role = "";
        filters.raids_per_week = {active:false,min:1,max:7};
        filters.days = [];
        filters.languages = [];
        filters.realm = {};
        filters.realmZones = [];
        filters.roles = [];
        filters.classes = [];
        filters.transfert = false;

        return filters;
    }

    function stateParamsFilter($stateParams) {

    }
})();