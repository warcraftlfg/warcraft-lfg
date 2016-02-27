angular
    .module('blocks.wlfgTranslationLoader')
    .factory('wlfgTranslationLoader', wlfgTranslationLoader);

function wlfgTranslationLoader($http, $q) {

    return function (options) {
        var files = options.files || [];
        var key = options.key;
        var deferred = $q.defer();

        // Find language file
        var localeFile = null;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.languageKey === key) {
                localeFile = file.localeFile;
                break;
            }
        }

        if (localeFile === null) {
            deferred.reject(options.key);
        } else {
            $http(angular.extend({
                url: localeFile,
                method: 'GET',
                params: ''
            }, options.$http)).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject(data);
            });
        }

        return deferred.promise;
    };
}