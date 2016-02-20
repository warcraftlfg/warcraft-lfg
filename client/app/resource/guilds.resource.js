(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('guilds', Guilds);

    Guilds.$inject = ['$resource'];
    function Guilds($resource) {
        return $resource('/api/v1/guilds/:part/:guildRegion/:guildRealm/:guildName',{}, {
            upsert: {
                method:'put'
            }
        });
    }
})();