(function () {
    'use strict';

    angular
        .module('app.message')
        .controller('MessagePopupController', MessagePopupController)
        .directive('wlfgMessagePopup', wlfgMessagePopup);

        wlfgMessagePopup.$inject = ["$uibModal", "$location", "user"];
        function wlfgMessagePopup($uibModal, $location, user) {
            var directive = {
                link: link,
                restrict: 'E',
                templateUrl: 'app/message/directive/popup/popup.directive.html'
            };
            return directive;

            function link(scope, element) {
                scope.animationsEnabled = true;
                getGuildAds();


                scope.openMessagePopup = function(size) {
                    var modalInstance = $uibModal.open({
                      animation: scope.animationsEnabled,
                      templateUrl: 'messagePopup',
                      controller: 'MessagePopupController',
                      scope: scope,
                      size: size,
                      resolve: {
                        user: function () {
                            return scope.user;
                        }
                      }
                    });
                };

                /**
                 * Get user's guildAds
                 */
                function getGuildAds() {
                    scope.$parent.loading = true;
                    user.query({param: "guildAds"}, function (guildAds) {
                        scope.guildAds = guildAds;
                        scope.$parent.loading = false;
                        $.each(guildAds, function (i, guild) {
                            if (guild.perms) {
                                guild.perms.ad.edit = $.inArray(guild.rank, guild.perms.ad.edit) !== -1;
                                guild.perms.ad.del = $.inArray(guild.rank, guild.perms.ad.del) !== -1;
                            }
                            else {
                                guild.perms = {ad: {}};
                                guild.perms.ad.edit = true;
                                guild.perms.ad.del = true;
                            }
                        });
                    }, function (error) {
                        scope.$parent.error = error.data;
                    });
                }
            }
        }

    MessagePopupController.$inject = ["$scope", "socket", "messages"];
    function MessagePopupController($scope, socket, messages) {

    }
})();