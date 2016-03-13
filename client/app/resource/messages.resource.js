(function() {
    'use strict';

    angular
        .module('app.resource')
        .factory('messages', Messages);

    Messages.$inject = ['$resource'];
    function Messages($resource) {
        return $resource('/api/v1/messages/:userId',{}, {
            post: {
                method:'post'
            }
        });
    }
})();