(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('updates', Update);

    Update.$inject = ['$resource', '__env'];
    function Update($resource, __env) {
        return $resource(__env.apiUrl+'/api/v1/updates',{}, {
            post: {
                method:'post'
            }
        });
    }
})();