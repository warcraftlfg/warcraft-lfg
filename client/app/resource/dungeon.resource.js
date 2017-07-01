(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('dungeon', Dungeon);

    Dungeon.$inject = ['$resource', '__env'];
    function Dungeon($resource, __env) {
        return $resource(__env.apiProgressUrl+'/api/v1/dungeons/:extension/', {}, {
        	get: { method: 'get', withCredentials: false, isArray: true }
        });
    }
})();