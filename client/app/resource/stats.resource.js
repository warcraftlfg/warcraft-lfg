(function () {
    'use strict';

    angular
        .module('app.resource')
        .factory('stats', Stats);

    Stats.$inject = ['$resource', '__env'];
    function Stats($resource, __env) {
        return $resource(__env.apiProgressUrl + '/api/v1/stats/boss/:tier/:raid', {}, {
            get: { method: 'get', withCredentials: false,  isArray: true}
        });
    }
})();