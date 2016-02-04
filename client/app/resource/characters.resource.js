(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('characters', Characters);

    Characters.$inject = ['$resource'];
    function Characters($resource) {
        return $resource('/api/v1/characters/:part/:characterRegion/:characterRealm/:characterName',{}, {
            upsert: {
                method:'put'
            }
        });
    }
})();