(function () {
    'use strict';

    angular
        .module('app.redirect')
        .controller('RedirectController', RedirectController);

    RedirectController.$inject = ['$state', '$cookies'];
    function RedirectController($state, $cookies) {
    	var toState = $cookies.getObject('lastUrl');
    	var toParams = $cookies.getObject('lastUrlParams');
        
    	$state.go(toState.name, toParams);
    }
})();