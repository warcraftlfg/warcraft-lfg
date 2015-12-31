(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('profile', User);

    User.$inject = ['$resource'];
    function User($resource) {
        return $resource('/profile');
    }
})();