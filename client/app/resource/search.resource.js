(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('search', Search);

    Search.$inject = ['$resource', '__env'];
    function Search($resource, __env) {
        return $resource(__env.apiProgressUrl+'/api/v1/search/:search', {}, {
            get: { method: 'get', withCredentials: false,  isArray: true}
        });
    }
})();