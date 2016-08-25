(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('user', User);

    User.$inject = ['$resource', '__env'];
    function User($resource, __env) {
        return $resource(__env.apiUrl+'/user/:param/:region/:realm/:name',{}, {
            update: {
                method:'put'
            }
        });
    }
})();