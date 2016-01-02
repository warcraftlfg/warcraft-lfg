(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('characters', Characters);

    Characters.$inject = ['$resource'];
    function Characters($resource) {
        return $resource('/api/characters',{}, {
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