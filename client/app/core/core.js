(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Core);

    Core.$inject = ['$scope', '$translate', 'socket', 'wlfgAppTitle', 'user', 'amMoment'];

    function Core($scope, $translate, socket, wlfgAppTitle, user, amMoment) {
        $scope.wlfgAppTitle = wlfgAppTitle;


        $scope.setLanguage = function (key) {
            $translate.use(key);
            $scope.currentLanguage = key;
            amMoment.changeLocale(key);
        };

        $scope.user = user.get({param: "profile"});
        getUnreadMessageCount();

        $scope.$watch("user", function () {
            if ($scope.user && $scope.user.language && $scope.user.language !== "") {
                $scope.currentLanguage = $scope.user.language;
                $translate.use($scope.user.language);
                amMoment.changeLocale($scope.user.language);
            } else {
                $scope.currentLanguage = $translate.use() || $translate.preferredLanguage();
                amMoment.changeLocale($translate.use() || $translate.preferredLanguage());
            }
        }, true);
        
        //If new message capture it 
        socket.forward('newMessage', $scope);

        $scope.$on('socket:newMessage', function (ev, message) {
            getUnreadMessageCount();
        });

        $scope.$on('updateMessageCount', function () {
            getUnreadMessageCount();
        });

        function getUnreadMessageCount() {
            user.get({param: "unreadMessageCount"},function(unreadMessageCount){
                if($scope.unreadMessageCount && $scope.unreadMessageCount.count != unreadMessageCount.count){
                    $scope.unreadMessageCount = unreadMessageCount;
                }else if($scope.unreadMessageCount===undefined){
                    $scope.unreadMessageCount = unreadMessageCount;
                }
            });
        }

        /* Get user ads with profile ? */
        /*user.query({param: "guildAds"}, function (guildAds) {
            $scope.user.guildAds = [];
            $.each(guildAds, function (i, guild) {
                $scope.user.guildAds.push(guild.name + '-' + guild.realm + '-' + guild.region);
            });
        });*/
        /* I don't remember why :D */
    }
})();