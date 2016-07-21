(function () {
    'use strict';

    angular
        .module('app.guild')
        .controller('GuildReadController', GuildRead)
        .controller('GuildUpdateController', GuildUpdate)
        .controller('GuildListController', GuildList)
    ;

    GuildRead.$inject = ["$scope", "socket", "$state", "$stateParams", "$location", "wlfgAppTitle", "guilds", "updates", "user"];
    function GuildRead($scope, socket, $state, $stateParams, $location, wlfgAppTitle, guilds, updates, user) {
        wlfgAppTitle.setTitle($stateParams.name + ' @ ' + $stateParams.realm + ' (' + $stateParams.region.toUpperCase() + ')');
        //Reset error message
        $scope.$parent.error = null;

        //Initialize $scope variables
        $scope.guild_ad = null;
        $scope.$parent.loading = true;
        $scope.current_url = window.encodeURIComponent($location.absUrl());

        $scope.bosses = ["Hellfire Assault", "Iron Reaver", "Kormrok", "Hellfire High Council", "Kilrogg Deadeye", "Gorefiend", "Shadow-Lord Iskar", "Socrethar the Eternal", "Tyrant Velhari", "Fel Lord Zakuun", "Xhul'horac", "Mannoroth", "Archimonde"];

        guilds.get({
                "guildRegion": $stateParams.region,
                "guildRealm": $stateParams.realm,
                "guildName": $stateParams.name
            }, function (guild) {
                $scope.guild = guild;

                $scope.recruit = {'tank': 0, 'heal': 0, 'melee_dps': 0, 'ranged_dps': 0};
                angular.forEach(guild.ad.recruitment, function (value, key) {
                    angular.forEach(value, function (status, test) {
                        if (status === true) {
                            $scope.recruit[key] += 1;
                        }
                    });
                });
                $scope.$parent.loading = false;
                if (guild.bnet && $scope.$parent.user && $scope.$parent.user.id) {
                    $scope.$parent.loading = true;
                    user.get({
                        param: "guildRank",
                        region: $stateParams.region,
                        realm: $stateParams.realm,
                        name: $stateParams.name
                    }, function (data) {

                        if (guild && !guild.perms) {
                            //No perms set everyone can edit.
                            $scope.userCanEdit = true;
                        }
                        if (data && guild && guild.perms && guild.perms.ad && guild.perms.ad.edit) {
                            if (guild.perms.ad.edit.indexOf(data.rank) >= 0) {
                                $scope.userCanEdit = true;
                            }
                        }

                        $scope.$parent.loading = false;
                    });
                }
            },
            function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            }
        );


        $scope.updateGuild = function () {
            $scope.$parent.loading = true;
            updates.post({
                type: "guild",
                region: $stateParams.region,
                realm: $stateParams.realm,
                name: $stateParams.name
            }, function (queuePosition) {
                $scope.queuePosition = queuePosition;
                $scope.$parent.loading = false;

            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        };
    }

    GuildUpdate.$inject = ["$scope", "socket", "$state", "$stateParams", "LANGUAGES", "TIMEZONES", "guilds", "user", "moment"];
    function GuildUpdate($scope, socket, $state, $stateParams, LANGUAGES, TIMEZONES, guilds, user, moment) {
        //Reset error message
        $scope.$parent.error = null;

        $scope.timezones = TIMEZONES;

        $scope.activeTabs = {'lfg': false, 'parser': false};
        if ($scope.host == "parser") {
            $scope.activeTabs.parser = true;
        } else {
            $scope.activeTabs.lfg = true;
        }

        //Redirect not logged_in users to home
        $scope.$watch("$parent.user", function () {
            if ($scope.$parent.user && $scope.$parent.user.logged_in === false) {
                $state.go('dashboard');
            }
        });


        //Initialize $scope variables
        $scope.languages = LANGUAGES;
        $scope.$parent.loading = true;


        guilds.get({
                "guildRegion": $stateParams.region,
                "guildRealm": $stateParams.realm,
                "guildName": $stateParams.name
            }, function (guild) {

                //If not exit, redirect user to dashboard
                if (guild === null) {
                    $state.go("dashboard");
                }
                $scope.guild = guild;


                $scope.$parent.loading = false;

                if (guild.bnet) {
                    $scope.$parent.loading = true;
                    user.get({
                        param: "guildRank",
                        region: $stateParams.region,
                        realm: $stateParams.realm,
                        name: $stateParams.name
                    }, function (data) {
                        $scope.$parent.loading = false;
                        $scope.guildRank = data.rank;
                        if (data.rank === 0) {
                            // This is the guild leader, put the rank permissions in an easier form for table rendering
                            var perms = $scope.guildRankPerms = [];
                            var isOfRank = function (i) {
                                return function (member) {
                                    return member.rank === i;
                                };
                            };
                            for (var i = 0; i < 10; i++) {
                                var members = $.grep(guild.bnet.members, isOfRank(i));
                                members.sort(function (a, b) {
                                    var c1 = a.character, c2 = b.character;
                                    var ret = ((c1.level > c2.level) ? -1 : ((c1.level < c2.level) ? 1 : 0));
                                    if (ret === 0) {
                                        ret = ((c1.name < c2.name) ? -1 : ((c1.name > c2.name) ? 1 : 0));
                                    }
                                    return ret;
                                });
                                var tooltip = '<div>' + $.map(members.slice(0, 5), function (member) {
                                        return '<div class="class-' + member.character.class + '">' + member.character.name + '-' + member.character.realm + '</div>';
                                    }).join('') + (members.length > 5 ? '<div>...</div>' : '') + '</div>';
                                perms.push({
                                    id: i,
                                    size: members.length,
                                    tooltip: tooltip,
                                    ad: {
                                        del: $.inArray(i, guild.perms.ad.del) !== -1,
                                        edit: $.inArray(i, guild.perms.ad.edit) !== -1
                                    }
                                });
                            }
                        }
                    });
                }
            },
            function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });


        $scope.tagAdded = function (tag) {
            // Normalize tag values so that searching for them is easier
            tag.value = tag.text.toLowerCase().replace(/[ -_'"]/g, '');
        };


        $scope.saveAd = function () {
            $scope.$parent.loading = true;

            guilds.upsert({
                guildRegion: $scope.guild.region,
                guildRealm: $scope.guild.realm,
                guildName: $scope.guild.name,
                part: "ad"
            }, $scope.guild.ad, function () {
                $scope.$parent.loading = false;
                $state.go("account");
            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });
        };

        $scope.savePerms = function () {
            var perms = $scope.guildRankPerms;
            if (!perms) {
                return;
            }

            // Put permissions back into array-of-rank-ids format
            $scope.guild.perms.ad.del = $.grep($.map(perms, function (rank) {
                return rank.ad.del ? rank.id : null;
            }), function (id) {
                return id !== null;
            });
            $scope.guild.perms.ad.edit = $.grep($.map(perms, function (rank) {
                return rank.ad.edit ? rank.id : null;
            }), function (id) {
                return id !== null;
            });

            $scope.$parent.loading = true;

            guilds.upsert({
                guildRegion: $scope.guild.region,
                guildRealm: $scope.guild.realm,
                guildName: $scope.guild.name,
                part: "perms"
            }, $scope.guild.perms, function () {
                $scope.$parent.loading = false;
                $state.go("account");
            }, function (error) {
                $scope.$parent.error = error.data;
                $scope.$parent.loading = false;
            });

            $scope.$parent.loading = true;
        };

    }

    GuildList.$inject = ['$scope', '$state', "wlfgAppTitle", "guilds"];
    function GuildList($scope, $state, wlfgAppTitle, guilds) {
        wlfgAppTitle.setTitle('Guilds LFM');

        $scope.$parent.error = null;
        $scope.$parent.loading = true;
        $scope.guilds = [];
        $scope.last = {};
        $scope.filters = {};
        $scope.filters.states = {};

        $scope.$watch('filters', function () {
            if ($scope.filters.states.classes && $scope.filters.states.faction && $scope.filters.states.days && $scope.filters.states.rpw && $scope.filters.states.languages && $scope.filters.states.realm && $scope.filters.states.realmZones && $scope.filters.states.sort && $scope.filters.states.progress) {
                // && $scope.filters.states.timezone
                //socket.emit('get:guildAds', $scope.filters);
                $scope.guilds = [];
                getGuildAds();
            }
        }, true);

        $scope.resetFilters = function () {
            $state.go($state.current, null, {reload: true, inherit: false});
        };

        $scope.getMoreGuilds = function () {
            if (($scope.$parent && $scope.$parent.loading) || $scope.loading) {
                return;
            }

            getGuildAds();
        };

        function getGuildAds() {
            $scope.loading = true;

            var params = {lfg: true, view: "detailed", number: 7};

            if ($scope.guilds.length > 0) {

                if ($scope.filters.sort == "ranking") {
                    if ($scope.guilds[$scope.guilds.length - 1].rank) {
                        params.last = $scope.guilds[$scope.guilds.length - 1]._id + "." + $scope.guilds[$scope.guilds.length - 1].rank.world;
                    } else {
                        params.last = $scope.guilds[$scope.guilds.length - 1]._id + ".0";
                    }
                } else {
                    params.last = $scope.guilds[$scope.guilds.length - 1]._id + "." + $scope.guilds[$scope.guilds.length - 1].ad.updated;
                }
            }

            angular.extend(params, $scope.filters);
            delete params.states;

            guilds.query(params, function (guilds) {
                    $scope.$parent.loading = false;
                    $scope.loading = false;
                    $scope.guilds = $scope.guilds.concat(guilds);
                },
                function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                });
        }
    }
})();