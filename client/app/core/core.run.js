(function() {
    'use strict';

    var core = angular.module('app.core');

    core.run(runBlock);

    runBlock.$inject = ['$rootScope','$location', '$window', '$cookies', 'wlfgAppTitle', 'templateLoader', '__env'];


    function runBlock($rootScope, $location, $window, $cookies, wlfgAppTitle, templateLoader, __env) {
        $rootScope.host = templateLoader.getTemplate();

        $rootScope.$on('$viewContentLoaded', function() {
            jQuery('html, body').animate({ scrollTop: 0 }, 200);
        });

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            wlfgAppTitle.setTitle('');

            if (toState.name !== "redirect") {
                $cookies.putObject('lastUrl', toState);
                $cookies.putObject('lastUrlParams', toParams);
            }

            if (!$window.ga) {
                return;
            }

            $window.ga('send', 'pageview', { page: $location.path() });
        });
    }

})();
