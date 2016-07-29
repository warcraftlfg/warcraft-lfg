(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('progress', Progress);

    Progress.$inject = ['$resource'];
    function Progress($resource) {
        return $resource('https://progress.warcraftlfg.com/api/v1/progress/:tier/:region/:realm/:name');
    }
})();