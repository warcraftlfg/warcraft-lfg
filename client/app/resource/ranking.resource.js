(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('ranking', Ranking);

    Ranking.$inject = ['$resource'];
    function Ranking($resource) {
        return $resource('https://progress.warcraftlfg.com/api/v1/ranks/18');
    }
})();