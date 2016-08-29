(function () {
    'use strict';

    angular
        .module('app.guild')
        .controller('GuildReadController', GuildRead)
        .controller('GuildUpdateController', GuildUpdate)
        .controller('GuildListController', GuildList)
    ;

    GuildRead.$inject = ["$scope", "socket", "$state", "$stateParams", "$location", "wlfgAppTitle", "guilds", "updates", "user", "ranking", "progress", "__env"];
    function GuildRead($scope, socket, $state, $stateParams, $location, wlfgAppTitle, guilds, updates, user, ranking, progress, __env) {
        wlfgAppTitle.setTitle($stateParams.name + ' @ ' + $stateParams.realm + ' (' + $stateParams.region.toUpperCase() + ')');
        //Reset error message
        $scope.$parent.error = null;

        //Initialize $scope variables
        $scope.guild_ad = null;
        $scope.$parent.loading = true;
        $scope.current_url = window.encodeURIComponent($location.absUrl());

        $scope.raid =  __env.tiers[__env.tiers.current];
        $scope.progressAdvanced = false;

        ranking.get({
            "tier": __env.tiers.current,
            "region": $stateParams.region,
            "realm": $stateParams.realm,
            "name": $stateParams.name
        }, function (rank) {
            $scope.rank = rank;
        });

        progress.get({
            "tier": __env.tiers.current,
            "region": $stateParams.region,
            "realm": $stateParams.realm,
            "name": $stateParams.name
        }, function (progress) {
            $scope.progress = progress;
        });

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
                if (guild && !guild.perms) {
                    //No perms set everyone can edit.
                    $scope.userCanEdit = true;
                } else {
                    if (guild.bnet && $scope.$parent.user && $scope.$parent.user.id) {
                        $scope.$parent.loading = true;
                        user.get({
                            param: "guildRank",
                            region: $stateParams.region,
                            realm: $stateParams.realm,
                            name: $stateParams.name
                        }, function (data) {
                            if (data && guild && guild.perms && guild.perms.ad && guild.perms.ad.edit) {
                                $scope.userCanEdit = $.inArray(data.rank, guild.perms.ad.edit) !== -1;
                            }

                            $scope.$parent.loading = false;
                        });
                    }
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
        if ($scope.host == "parser" || $stateParams.parser) {
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

                $scope.tooltips = [];


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
                                    return '<div class="class-' + member.character.class + '">' + member.character.name + '</div>';
                                }).join('') + (members.length > 5 ? '<div>...</div>' : '') + '</div>';
                            perms.push({
                                id: i,
                                size: members.length,
                                tooltip : tooltip,
                                ad: {
                                    del: $.inArray(i, guild.perms.ad.del) !== -1,
                                    edit: $.inArray(i, guild.perms.ad.edit) !== -1
                                }
                            });
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

        $scope.numberOfRank = function() {
            var data = true;
            if ($scope.guild && $scope.guild.parser && $scope.guild.parser.ranks) {
                angular.forEach($scope.guild.parser.ranks, function(rank, key) {
                    if (rank) {
                        data = false;
                    }
                });
            }

            return data;
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

        $scope.saveParser = function () {
            if ($scope.guild && $scope.guild.parser && $scope.guild.parser.active) {
                if ($scope.numberOfRank()) {
                    return;
                }
            }

            $scope.$parent.loading = true;

            guilds.upsert({
                guildRegion: $scope.guild.region,
                guildRealm: $scope.guild.realm,
                guildName: $scope.guild.name,
                part: "parser"
            }, $scope.guild.parser, function () {
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

    GuildList.$inject = ['$scope', '$state', '$stateParams', "wlfgAppTitle", "guilds"];
    function GuildList($scope, $state, $stateParams, wlfgAppTitle, guilds) {
        wlfgAppTitle.setTitle('Guilds LFM');

        $scope.$parent.error = null;
        $scope.$parent.loading = true;
        $scope.guilds = [];
        $scope.last = {};
        $scope.filters = {};
        $scope.filters.states = {};
        var initialLoading = false;
        var paginate = {since: false, max: false, guild: null};

        $scope.page = (parseInt($stateParams.page) > 0) ? parseInt($stateParams.page) : 1;

        $scope.$watch('filters', function () {
            if ($scope.filters.states.classes && $scope.filters.states.faction && $scope.filters.states.days && $scope.filters.states.rpw && $scope.filters.states.languages && $scope.filters.states.realm && $scope.filters.states.realmZones && $scope.filters.states.sort && $scope.filters.states.progress && $scope.filters.states.roles) {
                if (initialLoading) {
                    $scope.page = 1;
                    paginate = {since: false, max: false, character: null};
                }

                $scope.guilds = [];
                getGuildAds();

                initialLoading = true;
            }
        }, true);

        $scope.resetFilters = function () {
            $state.go($state.current, null, {reload: true, inherit: false});
        };

        $scope.changePage = function (page) {
            if (page > $scope.page) {
                paginate.guild = $scope.guilds[$scope.guilds.length - 1];
                paginate.since = true;
                paginate.max = false;
            } else {
                paginate.since = false;
                paginate.max = true;
                paginate.guild = $scope.guilds[0];
            }

            if (page <= 1) {
                paginate = {since: false, max: false, guild: null};
            }

            $scope.page = page;

            $scope.guilds = [];
            getGuildAds();
        };

        function getGuildAds() {
            $scope.loading = true;

            var params = {lfg: true, view: "detailed", number: 20, page: ($scope.page - 1)};

            if ((paginate.max || paginate.since) && paginate.guild) {
                var type = (paginate.max) ? 'max' : 'since';
                if ($scope.filters.sort == "ranking") {
                    if (paginate.guild.rank) {
                        params.last = type+'.'+paginate.guild._id + "." + paginate.guild.rank.world;
                    } else {
                        params.last = type+'.'+paginate.guild._id + ".0";
                    }
                } else {
                    params.last = type+'.'+paginate.guild._id + "." + paginate.guild.ad.updated;
                }
            }

            angular.extend(params, $scope.filters);
            delete params.states;

            guilds.query(params, function (guilds) {
                    $scope.$parent.loading = false;
                    $scope.loading = false;
                    if (params.last && params.last.indexOf('max') >= 0) {
                         $scope.guilds = $scope.guilds.concat(guilds.reverse());
                    } else {
                        $scope.guilds = $scope.guilds.concat(guilds);
                    }

                    if ($scope.guilds.length <= 0) {
                        $scope.noResult = true;
                    } else {
                        $scope.noResult = false;
                    }
                },
                function (error) {
                    $scope.$parent.error = error.data;
                    $scope.$parent.loading = false;
                });
        }
    }
})();