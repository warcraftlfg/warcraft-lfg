(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('realms', Realms);

    Realms.$inject = ['$resource', '__env'];
    function Realms($resource, __env) {
        return $resource(__env.apiUrl+'/api/v1/realms');
    }
})();