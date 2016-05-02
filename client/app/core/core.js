(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Core);

    Core.$inject = ['$scope', '$translate', 'socket', 'wlfgAppTitle', 'user'];

    function Core($scope, $translate, socket, wlfgAppTitle, user) {
        $scope.wlfgAppTitle = wlfgAppTitle;

        $scope.currentLanguage = $translate.use() ||
            $translate.preferredLanguage();

        $scope.setLanguage = function (key) {
            $translate.use(key);
            $scope.currentLanguage = $translate.use();
        };

        $scope.user = user.get({param: "profile"});

        /* Get user ads with profile ? */
        user.query({param: "guildAds"}, function (guildAds) {
            $scope.user.guildAds = [];
            $.each(guildAds, function (i, guild) {
               $scope.user.guildAds.push(guild.name+'-'+guild.realm+'-'+guild.region);
            });
        });
    }
})();