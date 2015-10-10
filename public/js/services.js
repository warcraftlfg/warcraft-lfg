"use strict"

angular.module('wow-guild-recruit')
    .factory('socket', function (socketFactory) {
        return socketFactory();
    });
