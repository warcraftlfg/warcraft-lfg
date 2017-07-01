(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('characters', Characters);

    Characters.$inject = ['$resource', '__env'];
    function Characters($resource, __env) {
        return $resource(__env.apiUrl+'/api/v1/characters/:part/:characterRegion/:characterRealm/:characterName',{}, {
            upsert: {
                method:'put'
            }
        });
    }
})();