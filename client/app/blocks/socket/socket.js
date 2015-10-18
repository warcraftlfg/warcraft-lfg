(function() {
    'use strict';

    angular
    	.module('blocks.socket')
        .factory('socket', socket);

    function socket(socketFactory) {
        return socketFactory();
    }
})();
