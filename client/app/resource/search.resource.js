(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('search', Search);

    Search.$inject = ['$resource', '__env'];
    function Search($resource, __env) {
        return $resource(__env.apiUrl+'/api/v1/:type/search/:search', {}, {
            get: { method: 'get', withCredentials: false }
        });
    }
})();