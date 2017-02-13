"use strict";
angular.module('planningCenterEventAnalyseEventTrackModule', [])
    .controller('planningCenterEventAnalyseEventTrackCtrl', ["$scope", "$filter", "$timeout", "$anchorScroll", "$location", "trsHttpService", "initCueMonitorMoreService", "trsconfirm", function($scope, $filter, $timeout, $anchorScroll, $location, trsHttpService, initCueMonitorMoreService, trsconfirm) {
        initstatus();
        $scope.myDataFormat = function(time) {
            time = time.substring(time.indexOf(" "));
            time = time.split(":")[0] + ":" + time.split(":")[1];
            return time;
        };
        //初始化状态
        function initstatus() {
            eventHotWord();
            eventInfo();
            eveFocRed();
            initdata();
            getTimeInfo();
            eveFocRedList();
            //事件相关图片
            eveCorPic();
        }
        //初始化数据
        function initdata(callback) {
            $scope.params = {
                typeid: "event",
                eventid: "11",
                serviceid: "mediavolumecount",
                modelid: "mediavolumecount",
            };
            trsHttpService.httpServer('/wcm/bigdata.do', $scope.params, 'get').then(function(data) {
                $scope.volumeSums = data;
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {

                }
                $scope.selectedArray = [];
            }, function(data) {
                // trsconfirm.alertType('数据请求错误', '数据请求错误', "error", false, function() {});
            });
            //初始化时间轴位置
            $scope.eventAxisUl = {
                position: "relative",
                left: "0px"
            };
        }

        //事件相关热词
        function eventHotWord() {
            var params = {
                typeid: "event",
                eventid: "11",
                serviceid: "eventrelatedhotwords",
                modelid: "hotwords",
            };
            trsHttpService.httpServer('/wcm/bigdata.do', params, "get").then(function(data) {
                $scope.headLine = data;
                var generArray = initCueMonitorMoreService.generArray();
                var newArrary = [];

                for (var i = 0; i < 8; i++) {
                    var random = Math.floor(Math.random() * generArray.length);
                    newArrary.push(generArray[random]); //.splice(generArray[random], 1));
                    generArray.splice(random, 1);
                }
                var initNum = 0;
                angular.forEach(newArrary, function(data, index, array) {
                    angular.forEach(data, function(_data, _index, _array) {
                        if (initNum <= $scope.headLine.length - 1) {
                            newArrary[index][_index].STRVALUE = $scope.headLine[initNum].STRVALUE;
                            initNum++;
                        }

                    });
                });
                $scope.hotNums = newArrary;
            });
        }
        //事件相关信息
        function eventInfo(callback) {
            $scope.eventinfo = {
                "typeid": "event",
                "eventid": 11,
                "serviceid": "eventrelatedinformation",
                "modelid": "eventrelatedinformation",

            };
            trsHttpService.httpServer('/wcm/bigdata.do', $scope.eventinfo, 'get').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.NAMELISTS = data.NAME_LIST;
                    $scope.ORGLISTS = data.ORG_LIST;
                    $scope.PLACELISTS = data.PLACE_LIST;


                }
                $scope.selectedArray = [];
            }, function(data) {
                // trsconfirm.alertType('数据请求错误', '数据请求错误', "error", false, function() {});
            });
        }
        //事件焦点还原
        function eveFocRed() {
            var eveFocRedParams = {
                typeid: "event",
                eventid: 11,
                serviceid: "eventfocusreduction",
                modelid: "eventreduction",
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), eveFocRedParams, "get").then(
                function(data) {
                    $scope.eveFocRedInfo = data;
                });
        }
        //事件焦点还原列表
        function eveFocRedList() {
            var eveFocRedParams = {
                typeid: "event",
                serviceid: "eventfocusreduction",
                eventid: 11,
                modelid: "eventlist",
                datetime: $scope.eventReCurDate
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), eveFocRedParams, "get").then(
                function(data) {
                    $scope.eveFocRedListInfo = data.PAGEITEMS;
                });
        }

        //切换时间轴方法，未重构
        $scope.chooseCurDate = function(index, item) {
            if (index - 3 < 0) {
                $scope.eventAxia = getPrevDays($scope.eventAxia[0], 3 - index).concat($scope.eventAxia);
                $scope.eventAxia.splice(8);
            } else if (index - 3 > 0) {
                $scope.eventAxia = $scope.eventAxia.concat(getNextDays($scope.eventAxia[$scope.eventAxia.length - 1], index - 3));
                $scope.eventAxia.splice(0, index - 3);
            }
            $(angular.element(document)).find('div.eventAxisUl').css("left", -133 * (3 - index) + "px");
            $(angular.element(document)).find('div.eventAxisUl').stop().animate({
                left: "0px"
            }, 1000);
            getEventViewList(item);
            getEvetPicList(item);
        };
        //事件还原第二排左侧事件的观点列表Edit
        function getEventViewList(curDate) {
            var eveFocRedParams = {
                typeid: "event",
                modelid: "viewpointlist",
                eventid: 11,
                serviceid: "eventfocusreduction",
                datetime: curDate
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), eveFocRedParams, "get").then(
                function(data) {
                    var colorAndAnimate = getColorAndAnimate();
                    angular.forEach(data, function(data, index, array) {
                        var myRadom = Math.floor(Math.random() * (10 - index));
                        data.style = {
                            "background-color": colorAndAnimate[myRadom].color
                        };
                        data.animate = colorAndAnimate[myRadom].animate;
                        colorAndAnimate.splice(myRadom, 1);
                    });
                    $scope.eventViewList = data;
                });
        }
        //动画颜色库
        function getColorAndAnimate() {
            var colorAndAnimateLib = [{
                "color": "#00BD9D",
                "animate": "toggle",
            }, {
                "color": "#0098CF",
                "animate": "spin-toggle",
            }, {
                "color": "#F76064",
                "animate": "scale-fade",
            }, {
                "color": "#FF8837",
                "animate": "scale-fade-in",
            }, {
                "color": "#A88BC1",
                "animate": "bouncy-scale-in",
            }, {
                "color": "#3D6392",
                "animate": "flip-in",
            }, {
                "color": "#03C9FC",
                "animate": "slide-left",
            }, {
                "color": "#08090C",
                "animate": "slide-right",
            }, {
                "color": "#F7B604",
                "animate": "slide-top",
            }, {
                "color": "#FEE8B0",
                "animate": "slide-down",
            }];
            return colorAndAnimateLib;
        }
        //点击观点id切换事件列表Edit
        $scope.changeEventList = function(id, locationId) {
            var eveFocRedParams = {
                typeid: "event",
                serviceid: "eventfocusreduction",
                modelid: "eventlistbyid",
                eventid: 11,
                viewpointid: id
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), eveFocRedParams, "get").then(
                function(data) {
                    $scope.eveFocRedListInfo = data.PAGEITEMS;
                    $location.hash(locationId);
                    $anchorScroll();
                });
        };
        //获得第二排右侧图片新闻列表Edit
        function getEvetPicList(curDate) {
            var eveFocRedParams = {
                typeid: "event",
                modelid: "imgeventlist",
                serviceid: "eventfocusreduction",
                eventid: 11,
                datetime: curDate
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), eveFocRedParams, "get").then(
                function(data) {
                    var colorAndAnimate = getColorAndAnimate();
                    angular.forEach(data, function(data, index, array) {
                        var myRadom = Math.floor(Math.random() * (10 - index));
                        data.animate = colorAndAnimate[myRadom].animate;
                        colorAndAnimate.splice(myRadom, 1);
                    });
                    $scope.eventPicList = data;

                });
        }

        function getTimeInfo() {
            //获取时间信息
            var params = {
                typeid: "event",
                serviceid: 11,
                modelid: ""
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get")
                .then(function(data) {
                    $scope.eventStartDate = $filter('date')(data.STARTTIME, "yyyy-MM-dd").toString();
                    $scope.eventEndDate = $filter('date')(data.ENDTIME, "yyyy-MM-dd").toString();
                    var today = $filter('date')(new Date(), "yyyy-MM-dd");
                    $scope.eventReCurDate = today > $scope.eventEndDate ? angular.copy($scope.eventEndDate) : today;
                    getEventAxia($scope.eventReCurDate);
                    getEventViewList($scope.eventReCurDate);
                    getEvetPicList($scope.eventReCurDate);
                });

        }

        //获取时间轴数据列表
        function getEventAxia(curDate) {
            var curD = new Date(curDate);
            var axiaData = [];
            var b;
            for (var i = 0; i < 8; i++) {
                b = 3 - i;
                if (b !== 0) {
                    axiaData.push($filter('date')(new Date(curD.getFullYear(), curD.getMonth(), curD.getDate() - b), "yyyy-MM-dd"));
                } else {
                    axiaData.push($filter('date')(curD, "yyyy-MM-dd"));
                }
            }
            $scope.eventAxia = axiaData;
        }

        //向前获取时间轴之外的数据
        function getPrevDays(date, numOfDays) {
            var curD = new Date(date);
            var axiaData = [];
            var b;
            for (var i = 0; i < numOfDays; i++) {
                b = numOfDays - i;
                axiaData.push($filter('date')(new Date(curD.getFullYear(), curD.getMonth(), curD.getDate() - b), "yyyy-MM-dd"));
            }
            return axiaData;
        }
        //向后获取时间轴之外的数据
        function getNextDays(date, numOfDays) {
            var curD = new Date(date);
            var axiaData = [];
            var b;
            for (var i = numOfDays - 1; i >= 0; i--) {
                b = i - numOfDays;
                axiaData.push($filter('date')(new Date(curD.getFullYear(), curD.getMonth(), curD.getDate() - b), "yyyy-MM-dd"));
            }
            return axiaData;
        }
        //事件相关图片
        function eveCorPic() {
            var params = {
                typeid: "event",
                serviceid: "eventrelatedpictures",
                eventid: 11,
                modelid: "pictures",
                datetime: $scope.eventReCurDate,
                page_no: "0",
                page_size: "8"
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(
                function(data) {
                    $scope.eveCorPics = data.PAGEDLIST;
                }); 
        }
    }]);
