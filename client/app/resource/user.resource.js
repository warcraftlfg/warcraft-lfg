(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('user', User);

    User.$inject = ['$resource'];
    function User($resource) {
        return $resource('/user/:param/:region/:realm/:name',{}, {
            update: {
                method:'put'
            }
        });
    }
})();