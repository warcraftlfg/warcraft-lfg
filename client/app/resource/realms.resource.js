(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('realms', Realms);

    Realms.$inject = ['$resource'];
    function Realms($resource) {
        return $resource('/api/realms');
    }
})();