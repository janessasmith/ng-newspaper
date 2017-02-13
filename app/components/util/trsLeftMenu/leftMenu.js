"use strict";
/* ************* name ***************
// Readme: <trs-left-menu></trs-left-menu>
// Example usage:li.pengyang
// Data: 2016/1/14 14:36:25 
*******************************************/
angular.module('util.trsLeftMenu', [])
    .directive('trsLeftMenu', ["trsHttpService", "$compile", "$timeout", "localStorageService", "$location", function(trsHttpService, $compile, $timeout, localStorageService, $location) {
        return {
            restrict: 'EA',
            $scope: false,
            templateUrl: './components/util/trsLeftMenu/leftMenu_tpl.html',
            link: function($scope, iElement, iAttrs) {
                //展开扩展导航
                $scope.getNextLevel = function(item, menu,chnl) {
                    $scope.status.isUiSref = $location.path()
                        .split('/')[3];
                    $scope.status.website.websiteSelectChl[menu][chnl] = item;
                    $scope.status.website[menu].selectedChnl = item;
                    var params = {
                        serviceid: "mlf_mediasite",
                        methodname: "queryClassifyByChnl",
                        ChannelId: item.CHANNELID,
                    };
                    //重置
                    if (!item.resetFlag) {
                        resetAll(item, menu,chnl);
                    }
                    item.resetFlag = true;
                    reset(item, menu,chnl);
                    if (item.show === "" || item.show === undefined) {
                        item.arrowBtn = "";
                        item.show = "show";
                    } else {
                        item.arrowBtn = "arrowBtnActive";
                        item.show = "";
                    }


                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        
                        var tempMenu = {
                            CHANNELID: item.CHANNELID,
                            DATA: data.CHILDREN
                        };
                        //if(!$scope.status.website.subLevelMenu[menu]||$scope.status.website.subLevelMenu[menu].CHANNELID != item.CHANNELID){
                        $scope.status.website.subLevelMenu[menu][chnl] = tempMenu;
                        //}
                    });
                };

                $scope.hideNextLevel = function(item, menu, chnl, itemChnl1,event) {
                    $scope.status.website.websiteSelectChl[menu][chnl] = item;
                    for (var i = 0; i < $scope.status.website[menu].channels.length; i++) {
                        var channels = $scope.status.website[menu].channels[i];
                        if (channels.HASCHILDREN === "true") {
                            for (var j = 0; j < channels.CHILDREN.length; j++) {
                                var channel = channels.CHILDREN[j];
                                channel.show = "";
                            }
                        }
                    }
                    itemChnl1.arrowBtn = "arrowBtnActive";
                    if (chnl == "chnl2") {
                        //item.active = "active";
                        delete $scope.status.website.subLevelMenu[menu].chnl2;
                        delete $scope.status.website.subLevelMenu[menu].chnl3;
                    }
                    if (chnl == "chnl3") {
                        //item.active = "active";
                        delete $scope.status.website.subLevelMenu[menu].chnl3;
                    }
                    if (chnl == "chnl4") {
                        //item.active = "active";
                    }
                    event.stopPropagation();
                };

                function resetAll(item, menu,chnl) {
                    if (item.show == "" && chnl == "chnl1") {
                        for (var i = 0; i < $scope.status.website[menu].channels.length; i++) {
                            var channels = $scope.status.website[menu].channels[i];
                            if (channels.HASCHILDREN == "true") {
                                for (var j = 0; j < channels.CHILDREN.length; j++) {
                                    var channel = channels.CHILDREN[j];
                                    if (channel.CHANNELID != item.CHANNELID) {
                                        channel.arrowBtn = "";
                                        channel.show = "";
                                        channel.resetFlag = false;
                                    }
                                }
                            }
                        }

                        delete $scope.status.website.subLevelMenu[menu].chnl2;
                        delete $scope.status.website.subLevelMenu[menu].chnl3;
                        $scope.status.website.websiteSelectChl[menu] = {
                            chnl1: "",
                            chnl2: "",
                            chnl3: "",
                            chnl4: ""
                        };
                    }

                }

                function reset(item, menu,chnl) {
                    if (chnl == "chnl1" && item.show != "") {
                        for (var i = 0; i < $scope.status.website[menu].channels.length; i++) {
                            var channels = $scope.status.website[menu].channels[i];
                            if (channels.HASCHILDREN === "true") {
                                for (var j = 0; j < channels.CHILDREN.length; j++) {
                                    var channel = channels.CHILDREN[j];
                                    if (channel.CHANNELID != item.CHANNELID) {
                                        channel.arrowBtn = "";
                                        channel.show = "";
                                        //channel.active = "";
                                    }
                                }
                            }
                        }
                    }

                    if (chnl == "chnl1" && item.show != "") {
                        delete $scope.status.website.subLevelMenu[menu].chnl2;
                        delete $scope.status.website.subLevelMenu[menu].chnl3;
                    }
                    if (chnl == "chnl2" && item.show != "") {
                        delete $scope.status.website.subLevelMenu[menu].chnl3;
                        $scope.status.website.websiteSelectChl[menu].chnl3 = "";
                        $scope.status.website.websiteSelectChl[menu].chnl4 = "";
                    }
                    if (chnl == "chnl3" && item.show != "") {
                        delete $scope.status.website.subLevelMenu[menu].chnl4;
                        $scope.status.website.websiteSelectChl[menu].chnl4 = "";
                    }

                }
            }
        };
    }]);