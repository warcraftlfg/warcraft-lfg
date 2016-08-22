(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('ranking', Ranking);

    Ranking.$inject = ['$resource', '__env'];
    function Ranking($resource, __env) {
        return $resource(__env.apiProgressUrl+'/api/v1/ranks/:tier/:region/:realm/:name');
    }
})();