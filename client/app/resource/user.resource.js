(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('user', User);

    User.$inject = ['$resource'];
    function User($resource) {
        return $resource('/user/:param1/:param2');
    }
})();