(function () {
    'use strict';

    angular
        .module('app.redirect')
        .controller('RedirectController', RedirectController);

    RedirectController.$inject = ['$state', '$cookies'];
    function RedirectController($state, $cookies) {
    	var toState = $cookies.getObject('lastUrl');
    	var toParams = $cookies.getObject('lastUrlParams');

        if (toState && toParams && toState.name) {        
    	   $state.go(toState.name, toParams);
        } else {
            $state.go('dashboard');
        }
    }
})();