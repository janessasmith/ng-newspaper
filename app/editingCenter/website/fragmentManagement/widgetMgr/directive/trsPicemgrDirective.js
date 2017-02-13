"use strict";
/*
    trsPieceMgrtest指令：
    html:<trs-pice-mgrtest></trs-pice-mgrtest>,
    css:处于oneImage.css样式表中，
    js:完成组合测试模块的页面替代
 */
angular.module('pieceMgr.widgetMgrdir', ["util.colorPicker", "pieceMgr.singleDoc", "pieceMgr.singleImage"])
    .directive('trsPieceMgrtest', ["$http", "$q", "$validation", "$compile", "trsHttpService", "$timeout", "trsconfirm", function($http, $q, $validation, $compile, trsHttpService, $timeout, trsconfirm) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                jsonObj: "=",
                widgetParams: "="
            },
            templateUrl: './editingCenter/website/fragmentManagement/widgetMgr/piceMgr.html',
            link: function(scope, element, http, compile) {
                scope.datepickerToggle = false;
                // 分配数据
                var params = {
                    "serviceid": "mlf_widget",
                    "methodname": "findById",
                    "ObjectId": scope.$parent.widgetId
                };
                scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(
                    function(data) {
                        scope.WidgetId = data.TEMPID;
                        scope.objText = data.DATAJSON;
                        scope.objText = eval(scope.objText);
                        scope.pubtime = data.PUBLISHTIME;
                        var targetDiv = element.find('all');
                        var targetAppend = '';
                        for (var i = 0; i < scope.objText.length; i++) {
                            var objType = scope.objText[i].type;
                            switch (objType) {
                                case "image":
                                    if (!angular.isDefined(scope.objText[i].content[0])) {
                                        scope.objText[i].content[0] = {};
                                    }
                                    scope['singleImgData' + i] = scope.objText[i].content[0];
                                    var tarSingleImg = '<trs-single-img index="' + i + '" required="' + scope.objText[i].required + '" widget-params="widgetParams" json-obj="singleImgData' + i + '"></trs-single-img>';
                                    targetAppend += tarSingleImg;
                                    break;
                                case "images":
                                    if (!angular.isDefined(scope.objText[i].content[0])) {
                                        scope.objText[i].content[0] = {};
                                    }
                                    scope['multiImgsData' + i] = scope.objText[i].content;
                                    var tarMultiImgs = '<trs-frag-imgs index="' + i + '" required="' + scope.objText[i].required + '" widget-params="widgetParams" json-obj="multiImgsData' + i + '"></trs-frag-imgs>';
                                    targetAppend += tarMultiImgs;
                                    break;
                                case "docs":
                                    var tarManyDocs = '<trs-frag-docs widget-params="widgetParams" required="' + scope.objText[i].required + '" json-obj="multiDocsData' + i + '"></trs-frag-docs>';
                                    targetAppend += tarManyDocs;
                                    scope['multiDocsData' + i] = scope.objText[i].content;
                                    break;
                                case "doc":
                                    if (!angular.isDefined(scope.objText[i].content[0])) {
                                        scope.objText[i].content[0] = {};
                                    }
                                    scope['singleDocData' + i] = scope.objText[i].content[0];
                                    var tarManyDoc = '<trs-frag-single-doc required="' + scope.objText[i].required + '" index="' + i + '" widget-params="widgetParams" json-obj="singleDocData' + i + '"></trs-frag-single-doc>';
                                    targetAppend += tarManyDoc;
                                    break;
                            }
                        }
                        targetAppend = $compile(targetAppend)(scope);
                        $(targetDiv).empty();
                        $(targetDiv).html(targetAppend);
                    },
                    function(data) {

                    });
                scope.datapkerClk = function() {
                    scope.datepickerToggle = !scope.datepickerToggle;

                };
                //强制绕过表单校验，解决多图拖拽后表单不合法的问题
                /*scope.$on("setFormValid", function(event, data) {
                    $timeout(function() {
                        scope.doNotD0FormValidation = true;
                    });
                });*/
                // 保存
                scope.save = function(type) {
                    validateForm().then(function() {
                        save(type);
                    });
                };

                function validateForm() {//兼容拖拽或者导入时，表单校验$invalid失效问题
                    var deffer = $q.defer();
                    $validation.validate(scope.fragementForm).success(function() {
                            deffer.resolve();
                        })
                        .error(function() {
                            $timeout(function() {
                                var errorNum = 0;
                                for (var i in scope.fragementForm.$error) {
                                    errorNum++;
                                }
                                if (errorNum === 0) {
                                    deffer.resolve();
                                }
                            });
                        });
                    return deffer.promise;
                }

                function save(type) {
                    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                    $http.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                    var DataJson = scope.objText;
                    DataJson = JSON.stringify(DataJson);
                    var PublishTime = scope.pubtime;
                    var WidgetId = scope.WidgetId;
                    var isPub = true;
                    if (type == 1) {
                        isPub = false;
                    } else {
                        isPub = true;
                    }
                    var params = {
                        "serviceid": "mlf_widget",
                        "methodname": "saveWidgetData",
                        "WidgetId": WidgetId,
                        "DocIds": "1",
                        "IsPub": isPub,
                        "DataJson": DataJson,
                        "PublishTime": PublishTime
                    };
                    scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(
                        function(data) {
                            trsconfirm.alertType("操作成功", "", "success", false, function() {
                                scope.$parent.$close();
                            });
                        });
                }
                //预览
                scope.preview = function() {
                    var DataJson = scope.objText;
                    DataJson = JSON.stringify(DataJson);
                    var params = {
                        "serviceid": "mlf_widget",
                        "methodname": "templatePreview",
                        "ObjectId": scope.widgetParams.objectid,
                        "TemplateId": scope.widgetParams.tempid,
                        "ObjectType": scope.widgetParams.objecttype,
                        "WidgetId": scope.$parent.widgetId,
                        "datajson": DataJson
                    };
                    scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                        .then(function(data) {
                            window.open(data + "&siteid=" + scope.widgetParams.siteid + "&tempid=" + scope.widgetParams.tempid + "&objectid=" + scope.widgetParams.objectid + "&objecttype=" + scope.widgetParams.objecttype + "$channelid=" + scope.widgetParams.channelid + "&isfragment=" + true +
                                "#widget" + scope.$parent.widgetId);
                        });
                };
                //取消
                scope.cancel = function() {
                    scope.$parent.$close();
                };
            },
        };
    }]);
