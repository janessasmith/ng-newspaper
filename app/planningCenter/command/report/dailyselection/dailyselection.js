angular.module('reportdailyselectModule', [])
    .controller('reportdailyselectCtrl', function($scope, $state, dateFilter, $location, trsspliceString, plancenterService, planCtrModalService, trsconfirm) {
        var vm = $scope.vm = {
            depts: [],
            dept: null
        };
        var format = 'yyyy-MM-dd';
        var yesterday = '昨天';
        var today = '今天';
        var tomorrow = '明天';
        vm.arr = [1, 2, 3, 4, 6];
        var init = function() {
            vm.time = [];
            vm.search = {
                date: new Date(),
                datestr: dateFilter(new Date(), format),
                deptId: null
            }
            vm.keywords = '';
            for (var i = -3; i <= 3; i++) {
                var d = new Date();
                d.setDate(d.getDate() + i)
                var text = i == -1 ? yesterday : i == 0 ? today : i == 1 ? tomorrow : dateFilter(d, format);
                vm.time.push({ text: text, date: d, dftStr: dateFilter(d, format) });
            };
        };
        var getTopicList = function() {
            var params = {
                Time: dateFilter(vm.search.date, format),
                DepartId: vm.search.deptId ? vm.search.deptId : null
            }
            plancenterService.getDailyscribe(params).then(function(res) {
                if (res.DATA && res.DATA.length > 0) {
                    var arr = [];
                    angular.forEach(res.DATA, function(item, idx) {
                        item.isexpanded = false;
                        arr.push(item);
                    });
                    vm.topics = arr;
                    if (vm.depts.length == 0) {
                        angular.forEach(res.DEPART, function(item, idx) {
                            vm.depts.push({ name: item.DEPARTNAME, value: item.DEPARTID });
                        })
                        if (vm.depts.length > 0) {
                            vm.dept = vm.depts[0];
                        }
                    }
                    $scope.getReportList(vm.topics[0]);
                } else {
                    vm.topics = [];
                    vm.depts = [];
                }
            });
        };

        var refreshReportList = function(topic) {
            if (!topic.pageParams) {
                topic.pageParams = {
                    PageId: 1
                }
            }
            topic.loadingBusy = true;
            plancenterService.getDailyBestReport(topic.TOPICID, topic.pageParams).then(function(res) {
                topic.isloaded = true;
                topic.loadingBusy = false;
                topic.reports = res.DATA;
            });
        };
        $scope.selectKeywords=function(report){
            var keywordArr=[];
            angular.forEach(report.KEYWORDS, function(item, idx) {
                keywordArr.push(item.name);
            });
            vm.keywords =keywordArr.join(',')+',,,,,,,,,,,,,,,,,,,,,,,,,,,,,';
        }
        $scope.searchWithDept = function() {
            vm.search.deptId = vm.dept.value;
            getTopicList();
        }

        $scope.toRemarkReport = function(report) {
            report.remark = report.REMARK;
            report.editing = true;
        }
        $scope.remarkReport = function(report) {

            plancenterService.invoke('savePlanReport', { TopicId: report.TOPICID, ReportId: report.REPORTID, Remark: report.remark }).then(function(data) {
                report.REMARK = report.remark;
                report.editing = false;
            });
        }

        $scope.toggleReport = function(report, topic) { 
            report.ischecked = !report.ischecked;
        };
        $scope.getReportList = function(topic) {
            topic.isexpanded = !topic.isexpanded;
            if (topic.isloaded) return;
            refreshReportList(topic);
        };
        $scope.deleteSelectedTopic = function() {
            var topic = getselectTopic();
            if (!topic) {
                return;
            }
            trsconfirm.alertType("确定要撤回该帖?", "", "info", true, function() {
                plancenterService.invoke('delSelectedPlanTopic', { TopicId: topic.TOPICID }).then(function(data) {
                    if (data.ISSUCCESS === 'true') {
                        getTopicList();
                    }
                });
            });
        };
        
        $scope.deleteSelectedReports = function(topic) {
            var topic = getselectTopic();
            if (!topic) {
                return;
            }
            var bestReports = trsspliceString.filter(topic.reports, 'REPORTID', 'ischecked', true);
            if (bestReports.length == 0) {
                trsconfirm.alertType('没有选中的报题，点击楼层序号选中！', '', "warning", false);
                return false;
            }
            trsconfirm.alertType("确定要撤回这些精选报题?", "", "info", true, function() {
                plancenterService.invoke('delSelectedPlanReport', { ReportIds: bestReports.join(',') }).then(function(data) {
                    if (data.ISSUCCESS === 'true') {
                        getTopicList();
                    }
                });
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

        $scope.listSearchTime = function(time) {
            vm.search.date = time.date;
        }
        $scope.$watch('vm.search.date', function(newval, oldval) {
            vm.search.datestr = dateFilter(vm.search.date, format);
            vm.depts = [];
            getTopicList();
        });
        $scope.preFix = function(text) {
            var t = text ? text.replace(/\n/g, '<br>') : null;
            return t;
        }

        init();
    })
