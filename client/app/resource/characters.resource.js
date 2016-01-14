(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('characters', Characters);

    Characters.$inject = ['$resource'];
    function Characters($resource) {
        return $resource('/api/v1/characters/:part/:characterRegion/:characterRealm/:characterName',{}, {
            getWithCount: {
                method: 'get',
                transformResponse: function (data, headersGetter) {
                    var response = {};
                    response.data = JSON.parse(data);
                    response.count = headersGetter()['x-total-count'];
                    return response;
                }
            },
            upsert: {
                method:'put'
            }
        });
    }
})();