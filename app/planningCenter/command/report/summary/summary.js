"use strict";
angular.module('reportsummaryModule', [])
    .controller('reportsummaryCtrl', function($scope, $state, dateFilter, $location, trsspliceString, plancenterService, planCtrModalService, localStorageService, trsSelectItemByTreeService, trsconfirm, trsHttpService) {
        var vm = $scope.vm = {};
        var format = 'yyyy-MM-dd';
        var yesterday = '昨天';
        var today = '今天';
        var tomorrow = '明天';
        var status = ['searchTopic', 'searchReport'];

        var init = function() {
            vm.time = [];
            vm.status = 'searchTopic';
            vm.search = {
                date: new Date(),
                datestr: dateFilter(new Date(), format)
            };
            vm.searchkeys = [{ name: '帖子', value: 1 }, { name: '报题', value: 2 }];
            vm.searchkey = vm.searchkeys[0];
            for (var i = -3; i <= 3; i++) {
                var d = new Date();
                d.setDate(d.getDate() + i)
                var text = i == -1 ? yesterday : i == 0 ? today : i == 1 ? tomorrow : dateFilter(d, format);
                vm.time.push({ text: text, date: d, dftStr: dateFilter(d, format) });
            };
            vm.username = localStorageService.get("currLoginUser")
            $scope.$watch("$parent.initStatus.btxt.bthz", function(newV, oldV) {
                getSummaryRights();
            });
        };

        var getTopicList = function() {
            plancenterService.getTopicList({ Time: dateFilter(vm.search.date, format) }).then(function(data) {
                vm.status = status[0];
                if (data.DATA && data.DATA.length > 0) {
                    var arr = [];
                    angular.forEach(data.DATA, function(item, idx) {
                        item.isexpanded = false;
                        arr.push(item);
                    });
                    vm.topics = arr;
                    $scope.getReportList(vm.topics[0]);
                } else {
                    vm.topics = [];
                }
            });
        };
        $scope.choosekey = function(key) {
            vm.searchkey = key;
        }
        $scope.searchbyKey = function() {
            if ($scope.keyword == null || $scope.keyword.trim().length == 0) {
                return trsconfirm.alertType('关键词不能为空!', '', "warning", false);
            }
            plancenterService.getTopicList({ Key: $scope.keyword, Flag: vm.searchkey.value }).then(function(data) {
                if (vm.searchkey.value == 1) {
                    vm.status = status[0];
                    if (data.DATA && data.DATA.length >= 0) {
                        var arr = [];
                        angular.forEach(data.DATA, function(item, idx) {
                            item.isexpanded = false;
                            arr.push(item);
                        });
                        vm.topics = arr;
                        $scope.getReportList(vm.topics[0]);
                    } else {
                        vm.topics = []
                    }
                } else {
                    vm.status = status[1];
                    if (data.DATA && data.DATA) {
                        var arr = [];
                        angular.forEach(data.DATA, function(item, idx) {
                            item.isexpanded = false;
                            arr.push(item);
                        });
                        vm.searchreports = arr;
                    } else {
                        vm.searchreports = [];
                    }
                }

            });
        }
        var refreshReportList = function(topic, isloadmore) {
            if (!topic.pageParams) {
                topic.pageParams = {
                    PageId: 1
                }
            }
            if (!topic.loadingBusy) {
                topic.loadingBusy = true;
                plancenterService.getReportList(topic.TOPICID, topic.pageParams).then(function(data) {
                    topic.isloaded = true;
                    topic.loadingBusy = false;
                    topic.reports = isloadmore ? topic.reports.concat(data.PLANREPORTS.DATA) : data.PLANREPORTS.DATA;
                    angular.forEach(topic.reports, function(report, idx) {
                        report.isexpanded = typeof report.isexpanded == 'undefined' || report.isexpanded == null ? false : report.isexpanded;
                    });
                    topic.pager = data.PLANREPORTS.PAGER;
                    topic.size = data.RESIDUALSIZE;
                    topic.remarkable = data.CANREMARKED;
                });
            }
        };

        $scope.loadMore = function(topic) {
            if (!topic.loadingBusy) {
                topic.pageParams.PageId++;
                refreshReportList(topic, true);
            }
        };
        init();
        $scope.listSearchTime = function(time) {
            vm.search.date = time.date;
        }
        $scope.$watch('vm.search.date', function(newval, oldval) {
            vm.search.datestr = dateFilter(vm.search.date, format);
            getTopicList();
        })
        $scope.createNewTopic = function() {
            var d = new Date();
            var crtime;
            if (vm.search.date.getFullYear() < d.getFullYear() || vm.search.date.getMonth() < d.getMonth() || vm.search.date.getDate() < d.getDate()) {
                return trsconfirm.alertType('不能在过去的日期创建帖子！', '', "warning", false);
            }
            if (vm.search.date.getFullYear() > d.getFullYear() || vm.search.date.getMonth() > d.getMonth() || vm.search.date.getDate() > d.getDate()) {
                crtime = dateFilter(vm.search.date, 'yyyy-MM-dd ');
            }

            var createModal = trsSelectItemByTreeService.getDept(vm.search.date, function(result) {
                var content = result.content;
                var items = result.items;
                var DepartId = localStorageService.get("mlfCachedUser").GroupId;
                if (!DepartId) {
                    return trsconfirm.alertType('当前用户组织存疑，请尝试重新登陆！', '', "warning", false);
                }
                var UserIds = [];
                angular.forEach(items, function(item, idx) {
                    var isdeptexistd = false;
                    UserIds.push(item.ID);
                });
                var params = { DepartId: DepartId, Flag: result.flag ? 1 : 0, UserIds: UserIds.join(','), TopicId: 0, Content: content, CrTime: crtime };
                if (result.flag === true) {
                    params.StartTime = dateFilter(result.startTime, format);
                    params.EndTime = dateFilter(result.endTime, format);
                }
                plancenterService.invoke('savePlanTopic', params).then(function(data) {
                    getTopicList();
                });
            });
        };



        $scope.getReportList = function(topic) {
            var flag = topic.isexpanded;
            angular.forEach(vm.topics, function(item, idx) {
                if (item.isexpanded == true) item.isexpanded = false;
            });
            topic.isexpanded = !flag;
            if (topic.isloaded) return;
            refreshReportList(topic);
        };


        $scope.createReport = function() {
            var topic = getselectTopic();
            if (!topic) {
                return;
            }
            var reportModal = planCtrModalService.createReport(topic);
            reportModal.result.then(function(result) {
                refreshReportList(topic);
            });
        };
        $scope.addremark = function(topic) {
            var remarkModal = planCtrModalService.addRemark(topic);
            remarkModal.result.then(function(result) {
                getTopicList();
            });
        };

        var getselectTopic = function() {
            var topic = null;
            angular.forEach(vm.topics, function(item, idx) {
                if (item.isexpanded == true) topic = item;
            });
            if (!topic) {
                trsconfirm.alertType('请展开一个帖子！', '', "warning", false);
                return false;
            }
            return topic
        }

        $scope.editReport = function(report, topic, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            var reportModal = planCtrModalService.editReport(report, topic.CONTENT);
            reportModal.result.then(function(result) {
                refreshReportList(topic);
            });
        };

        $scope.delete = function(report, topic, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            plancenterService.invoke('removePlanReplies', { RepliesIds: report.REPORTID }).then(function(data) {
                refreshReportList(topic);
            });
        };
        $scope.toggleReport = function(report, topic) {
            if (report.REPORTTYPE == 1) {
                return;
            }
            if (!report.ischecked && checkTopic(topic)) {
                return trsconfirm.alertType('单个帖子的精选报题数不能超过五个！', '', "warning", false);
            }
            report.ischecked = !report.ischecked;
        };
        var checkTopic = $scope.checkTopic = function(topic) {
            var size = topic.size;
            angular.forEach(topic.reports, function(report, idx) {
                if (report.ischecked) size--;
            });
            return size <= 0;

        }
        $scope.selectBestReports = function() {
            var topic = getselectTopic();
            if (!topic) {
                return;
            }
            var bestReports = trsspliceString.filterArr(topic.reports, '', 'ischecked', true);
            if (bestReports.length == 0) {
                trsconfirm.alertType('没有选中的报题，点击楼层序号选中！', '', "warning", false);
                return false;
            }
            var reportModal = planCtrModalService.selectBestReports(topic, bestReports);
            reportModal.result.then(function(data) {
                if (data.ISSUCCESS === 'true') {
                    refreshReportList(topic);
                }
            })
        };
        //删除帖子
        $scope.deleteTopic = function() {
            var topic = getselectTopic();
            if (!topic) {
                return;
            }
            trsconfirm.alertType("确定要删除该报题?", "", "info", true, function() {
                plancenterService.invoke('delPlanTopic', { TopicId: topic.TOPICID }).then(function(data) {
                    if (data.ISSUCCESS === 'true') {
                        refreshReportList(topic);
                    }
                });
            });
        };
        //删除报题
        $scope.deleteReport = function(report, topic) {
            trsconfirm.alertType("确定要删除该报题?", "", "info", true, function() {
                plancenterService.invoke('delPlanReport', { ReportIds: report.REPORTID }).then(function(data) {
                    if (data.ISSUCCESS === 'true') {
                        refreshReportList(topic);
                    }
                });
            });
        };

        //删除回帖
        $scope.deleteReply = function(reply, report) {
            trsconfirm.alertType("确定要删除该补充?", "", "info", true, function() {
                plancenterService.invoke('removePlanReplies', { RepliesId: reply.REPLIESID }).then(function(data) {
                    if (data.ISSUCCESS === 'true') {
                        $scope.getReplyList(report);
                    }
                });
            });
        };

        //设置帖子
        $scope.topicSetting = function() {
            var topic = getselectTopic();
            if (!topic) {
                return;
            }
            var createModal = trsSelectItemByTreeService.setTopic(topic).result.then(function(result) {
                var content = result.content;
                var remark = result.remark;
                var items = result.items;
                var DepartId = localStorageService.get("mlfCachedUser").GroupId;
                if (!DepartId) {
                    return trsconfirm.alertType('当前用户组织存疑，请尝试重新登陆！', '', "warning", false);
                }
                var UserIds = [];
                angular.forEach(items, function(item, idx) {
                    var isdeptexistd = false;
                    UserIds.push(item.ID);
                });
                plancenterService.invoke('saveTimingPlanTopic', { DepartId: DepartId, UserIds: UserIds.join(','), TOPICID: topic.TOPICID, TimingTopicId: 0, Content: content, StartTime: dateFilter(result.startTime, format), EndTime: dateFilter(result.endTime, format) }).then(function(data) {
                    getTopicList();
                });
            });
        };

        $scope.viewReport = function(report) {
            var reportModal = planCtrModalService.reportDetails(report);
        }
        $scope.replyReport = function(report) {
            var replyModal = planCtrModalService.replyReport(report);
            replyModal.result.then(function(data) {
                if (data.ISSUCCESS === 'true') {
                    $scope.getReplyList(report);
                }
            })
        }
        $scope.pageChanged = function(topic) {
            topic.pageParams.PageId = topic.pager.CURRPAGE;
            refreshReportList(topic);
        };
        $scope.jumptoPage = function(topic) {
            refreshReportList(topic);
        }
        $scope.openSearchDate = function() {
            vm.search.dateopen = true;
        };

        $scope.toggleReplyList = function(report) {
            report.isexpanded = !report.isexpanded;
            if (report.isexpanded) {
                $scope.getReplyList(report);
            }
        };
        $scope.getReplyList = function(report) {
            plancenterService.invoke('getPlanReplieChilds', { ReportId: report.REPORTID }).then(function(data) {
                report.replies = data.REPORT_REPLIESINFO;
            });
        };
        //获取报题汇总权限
        function getSummaryRights() {
            $scope.rights = angular.isDefined($scope.$parent.initStatus.btxt) ? $scope.$parent.initStatus.btxt.bthz : {};
        }
    }).controller('settingTopicCtrl', function($scope, $state, dateFilter, $location, trsspliceString, plancenterService, planCtrModalService, localStorageService, trsSelectItemByTreeService, trsconfirm, trsHttpService) {
        var vm = $scope.vm = {};
        var format = 'yyyy-MM-dd';

        var init = function() {
            getTopicList();
        }

        function getTopicList() {
            plancenterService.invoke('queryTimingPlanToipics').then(function(data) {
                vm.pasttopics = data;
            });
        }
        $scope.settingTopic = function(topic) {
            var createModal = trsSelectItemByTreeService.setTopic(topic).result.then(function(result) {
                var content = result.content;
                var remark = result.remark;
                var items = result.items;
                var DepartId = localStorageService.get("mlfCachedUser").GroupId;
                if (!DepartId) {
                    return trsconfirm.alertType('当前用户组织存疑，请尝试重新登陆！', '', "warning", false);
                }
                var UserIds = [];
                angular.forEach(items, function(item, idx) {
                    var isdeptexistd = false;
                    UserIds.push(item.USERID);
                });
                plancenterService.invoke('savePlanTopic', { Flag:1,DepartId: DepartId, UserIds: UserIds.join(','), TOPICID: topic.TOPICID, TimingTopicId: 0, Content: content, StartTime: dateFilter(result.startTime, format), EndTime: dateFilter(result.endTime, format) }).then(function(data) {
                    getTopicList();
                });
            });
        };


        init();

    })
