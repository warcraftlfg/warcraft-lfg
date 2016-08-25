(function() {
    'use strict';

    angular
    	.module('blocks.socket')
        .factory('socket', socket);

    function socket(socketFactory, __env) {
		var myIoSocket = io.connect(__env.apiUrl);

		return socketFactory({
			ioSocket: myIoSocket
		});
    }
})();
