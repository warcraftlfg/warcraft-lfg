(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('User', User);

    User.$inject = ['$resource'];
    function User($resource) {
        return $resource('/user');
    }
})();