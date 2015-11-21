(function() {
    'use strict';

    var core = angular.module('app.core');

    core.run(runBlock);

    runBlock.$inject = ['$rootScope'];


    function runBlock($rootScope) {
        $rootScope.$on('$viewContentLoaded',function(){
            jQuery('html, body').animate({ scrollTop: 0 }, 200);
        });
    }

})();
