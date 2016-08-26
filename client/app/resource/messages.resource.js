(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('messages', Messages);

    Messages.$inject = ['$resource', '__env'];
    function Messages($resource, __env) {
        return $resource(__env.apiUrl+'/api/v1/messages/:objId1/:objId2/:param',{}, {
            post: {
                method:'post'
            }
        });
    }
})();