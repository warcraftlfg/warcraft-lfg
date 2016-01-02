(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('guilds', Guilds);

    Guilds.$inject = ['$resource'];
    function Guilds($resource) {
        return $resource('/api/guilds',{}, {
            getWithCount: {
                method: 'get',
                transformResponse: function (data, headersGetter) {
                    var response = {};
                    response.data = JSON.parse(data);
                    response.count = headersGetter()['x-total-count'];
                    return response;
                }
            }
        });
    }
})();