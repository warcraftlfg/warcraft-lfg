(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('guilds', Guilds);

    Guilds.$inject = ['$resource', '__env'];
    function Guilds($resource, __env) {
        return $resource(__env.apiUrl+'/api/v1/guilds/:part/:guildRegion/:guildRealm/:guildName',{}, {
            upsert: {
                method:'put'
            }
        });
    }
})();