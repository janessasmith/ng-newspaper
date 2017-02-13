"use strict";
angular.module('calendarTplModule', []).controller('calendarCtrl', ['$scope', '$modalInstance', '$filter', "$validation", "$location", "trsHttpService", "trsspliceString", "event", "initSingleSelecet", "trsconfirm", function($scope, $modalInstance, $filter, $validation, $location, trsHttpService, trsspliceString, selectedEvent, initSingleSelecet, trsconfirm) {
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
    initStatus();
    if (angular.isDefined(selectedEvent.time)) {
        initData();
    }


    function initStatus() {
        $scope.params = {
            serviceid: 'customremind',
            modelid: "content",
            calendar_date: selectedEvent.time
        };
        $scope.status = {
            currentItem: "",
            operation: "create",
            btnName: "保存",
            stickStartTime: selectedEvent.createTime,
            stickEndTime: selectedEvent.createTime,
            isList: selectedEvent.isList,
        };
        $scope.data = {
            title: "",
            content: "",
            items: []
        };
    }
    /**
     * [initData description]初始化状态
     * @return {[type]} [description]
     */
    function initData() {
        $scope.params.modelid = "calendar";
        //修改弹窗 显示的是选择时间内的所有事件 适用于点击日历上的还有n项和事件块
        if ($scope.status.isList === true) {
            $scope.data.title = selectedEvent.data.title || selectedEvent.data.TITLE;
            $scope.data.content = selectedEvent.data.content || selectedEvent.data.CONTENT;
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $scope.data.items = data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == selectedEvent.data.ID) {
                        $scope.status.btnName = "修改";
                        $scope.data.selectedArray = data[i];
                        $scope.status.stickStartTime = data[i].BEFOREDATE;
                        $scope.status.stickEndTime = data[i].ENDDATE;
                        return;
                    }
                }
            });
        }
        //修改日历列表页弹窗 适用于近期日程列表和概览页面
        else {
            $scope.status.btnName = "修改";
            $scope.data.selectedArray = selectedEvent.data;
            $scope.data.items = [selectedEvent.data];
            $scope.status.stickStartTime = selectedEvent.data.BEFOREDATE;
            $scope.status.stickEndTime = selectedEvent.data.ENDDATE;
            $scope.data.title = selectedEvent.data.TITLE;
            $scope.data.content = selectedEvent.data.CONTENT;
        }
    }
    /**
     * [getFuncion description]区分点保存时应该做的操作
     * @return {[type]} [description]
     */
    function getFuncion() {
        $scope.status.stickStartTime = $filter('date')($scope.status.stickStartTime, "yyyy-MM-dd").toString();
        $scope.status.stickEndTime = $filter('date')($scope.status.stickEndTime, "yyyy-MM-dd").toString();
        if (angular.isDefined($scope.data.selectedArray)) {
            $scope.status.operation = "modify";
        } else {
            if ($scope.data.title !== "") {
                $scope.status.operation = "create";
            }
        }
    }
    /**
     * [toDate description]时间比较大小函数
     * @param  {[str]} str [description]传入的时间
     * @return {[type]}     [description]null
     */
    function toDate(str) {
        var sd = str.split("-");
        return new Date(sd[0], sd[1], sd[2]);
    }
    //保存弹窗信息
    $scope.save = function() {
        getFuncion();
        if ($scope.status.operation != "delete") {
            $validation.validate($scope.calendarForm).success(function() {
                if (toDate($scope.status.stickEndTime) < toDate($scope.status.stickStartTime)) {
                    trsconfirm.alertType("创建失败", "结束时间不能小于开始时间", "error", false, function() {});
                } else {
                    if ($scope.status.operation === "modify") {
                        modifyCalendadr();
                    } else if ($scope.status.operation === "create") {
                        createCalendar();
                    }
                }
            }).error(function() {
                trsconfirm.alertType("创建失败", "请检查填写项", "error", false, function() {});
            });
        } else {
            $modalInstance.close();
        }
    };
    /**
     * [createCalendar description]创建自定义事件
     * @return {[type]} [description]null
     */
    function createCalendar() {
        var params = {
            serviceid: "customremind",
            modelid: "save",
            title: $scope.data.title,
            content: $scope.data.content,
            before_date: $scope.status.stickStartTime,
            end_date: $scope.status.stickEndTime
        };
        trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "POST").then(function(data) {
            trsconfirm.alertType("日程创建成功", "", "success", false, function() {
                $modalInstance.close();
            });
        });
    }
    /**
     * [create description]点击新建
     * @return {[type]} [description]
     */
    $scope.create = function() {
        delete $scope.data.selectedArray;
        $scope.data.title = "";
        $scope.data.content = "";
        $scope.status.btnName = "保存";
        $scope.status.operation = "新建";
    };
    /**
     * [modifyCalendadr description]修改自定义事件
     * @return {[type]} [description]
     */
    function modifyCalendadr() {
        var params = {
            serviceid: "customremind",
            modelid: "update",
            title: $scope.data.title,
            content: $scope.data.content,
            before_date: $scope.status.stickStartTime,
            end_date: $scope.status.stickEndTime,
            ID: $scope.data.selectedArray.ID
        };
        trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "POST").then(function(data) {
            trsconfirm.alertType("日程修改成功", "", "success", false, function() {
                $modalInstance.close();
            });
        });
    }
    /**
     * [selectItem description]选中状态
     * @param  {[obj]} item [description]列表中的自定义事件
     * @return {[type]}      [description]null
     */
    $scope.selectItem = function(item) {
        if ($scope.data.selectedArray === item) {
            delete $scope.data.selectedArray;
            $scope.data.title = "";
            $scope.data.content = "";
            $scope.status.btnName = "保存";
            $scope.status.operation = "create";
        } else {
            $scope.data.selectedArray = item;
            $scope.data.title = item.TITLE;
            $scope.data.content = item.CONTENT;
            $scope.status.stickStartTime = $scope.data.selectedArray.BEFOREDATE;
            $scope.status.stickEndTime = $scope.data.selectedArray.ENDDATE;
            $scope.status.btnName = "修改";
            $scope.status.operation = "modify";
        }
    };
    /**
     * [deleteCalendar description]删除日历
     * @param  {[obj]} item [description]列表信息
     * @return {[type]}      [description]null
     */
    $scope.deleteCalendar = function(item) {
        trsconfirm.confirmModel("删除日程", "确认是否删除此条日程", function() {
            $scope.status.operation = "delete";
            $scope.data.items.splice($scope.data.items.indexOf(item), 1);
            delete $scope.data.selectedArray;
            $scope.data.title = "";
            $scope.data.content = "";
            $scope.status.btnName = "保存";
            $scope.params.modelid = "delete";
            $scope.params.id = item.ID;
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                if (data.ISSUCESS === 'false') {
                    trsconfirm.alertType("日程删除失败", "该日程已经被删除过了", "error", false);
                }
            });
        });
    };
}]);
