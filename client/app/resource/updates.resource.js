(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('updates', Update);

    Update.$inject = ['$resource'];
    function Update($resource) {
        return $resource('/api/v1/updates',{}, {
            post: {
                method:'post'
            }
        });
    }
})();