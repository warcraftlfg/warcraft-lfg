(function () {
    'use strict';

    angular
        .module('app.resource')
        .factory('kills', Kills);

    Kills.$inject = ['$resource', '__env'];
    function Kills($resource, __env) {
        return $resource(__env.apiProgressUrl + '/api/v1/kills/:tier/:raid/:region/:realm/:name/:difficulty/:boss/:timestamp', {}, {
            get: { method: 'get', withCredentials: false,  isArray: true}
        });
    }
})();