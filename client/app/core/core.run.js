(function() {
    'use strict';

    var core = angular.module('app.core');

    core.run(runBlock);

    runBlock.$inject = ['$rootScope','$location', '$window'];


    function runBlock($rootScope, $location, $window) {
        $rootScope.$on('$viewContentLoaded',function(){
            jQuery('html, body').animate({ scrollTop: 0 }, 200);
        });

		$rootScope.$on('$stateChangeSuccess', function(event){
            if (!$window.ga)
                return;

            $window.ga('send', 'pageview', { page: $location.path() });
        });
    }

})();
