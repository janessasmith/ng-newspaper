/**
 * Created by bzm on 2015/9/23.
 */
'use strict';
var editCallback = null; //图片裁剪全局变量
var editPhotoCallback = null; //图片裁剪全局变量
angular.module("pieceMgr.visualEditingApp", [
        'ui.router',
        'ui.bootstrap',
        'ngLocale',
        'util.httpService',
        'pieceMgr.multiDoc',
        'pieceMgr.multiImgs',
        'ngSweetAlert',
        'validation',
        'validation.rule',
        'treeControl',
        'mgcrea.ngStrap.datepicker',
        'mgcrea.ngStrap.timepicker',
        'trsSelectDocumentModule',
        'pieceMgr.singleDoc',
        'pieceMgr.singleImage',
        'pieceMgr.multiDocList',
        'util.checkbox',
        'dndLists',
        'trsLimitToModule',
        'trsngsweetalert',
        'angular.filter',
        'fragmentServiceModule',
        'loginModule',
        'trsspliceStringModule',
        'initSingleSelectionModule',
        'cgBusy',
        'util.trsSingleSelection'
        // 'pieceMgr.uploadService',
        //'pieceMgr.datapickerService'
    ]).config(['$validationProvider', function($validationProvider) {
        $validationProvider.setSuccessHTML(function(msg) {
            return "";
        });
        $validationProvider.setErrorHTML(function(msg) {
            // remember to return your HTML
            return '<p class="validation-invalid">' + msg + '</p><i></i>';
        });

    }])
    .config(['$validationProvider', function($validationProvider) {
        var expression = {
            ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        };
        var validMsg = {
            ip: {
                error: 'IP格式不正确',
                success: ''
            }
        };
        $validationProvider.setExpression(expression) // set expression
            .setDefaultMsg(validMsg); // set valid message
    }]) //将http的提交参数调整成form的方式
    .config(['$httpProvider', function($httpProvider) {

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        function toFormData(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name; //name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += toFormData(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += toFormData(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        }
        // 浏览器缓存设置
        // if (!$httpProvider.defaults.headers.get) {
        //     $httpProvider.defaults.headers.get = {};
        // }
        // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? toFormData(data) : data;
        }];
    }])
    .controller('visualEditingCtrl', ["$compile", "$q", "$element", "$scope", "$validation", "$http", "trsHttpService", "$timeout", "trsconfirm", function($compile, $q, element, $scope, $validation, $http, trsHttpService, $timeout, trsconfirm) {
        var location = window.location.href;
        /*var widgetParams = location.substr(location.indexOf("widgetId") + 9);
        var siteid = widgetParams.substring(widgetParams.indexOf("siteid") + 7, widgetParams.indexOf("?"));
        var widgetId = widgetParams.substring(0, widgetParams.indexOf("&"));*/
        var toWidgetId = location.substr(location.indexOf("widgetId") + 9);
        var widgetId = toWidgetId.substring(0, toWidgetId.indexOf("&"));
        var toSiteid = toWidgetId.substr(toWidgetId.indexOf("siteid") + 7);
        var siteid = toSiteid.substring(0, toSiteid.indexOf("&"));
        var toTempid = toSiteid.substr(toSiteid.indexOf("tempid") + 7);
        var tempid = toTempid.substring(0, toTempid.indexOf("&"));
        var toObjectid = toTempid.substr(toTempid.indexOf("objectid") + 9);
        var objectid = toObjectid.substring(0, toObjectid.indexOf("&"));
        var toObjecttype = toObjectid.substr(toObjectid.indexOf("objecttype") + 11);
        var objecttype = toObjecttype.substring(0, toObjecttype.indexOf("&"));
        var toChannelid = toObjecttype.substr(toObjecttype.indexOf("channelid") + 10);
        var channelid = toChannelid.substring(0, toChannelid.indexOf("?"));
        // 分配数据
        var params = {
            'serviceid': 'mlf_widget',
            'methodname': 'findById',
            'ObjectId': widgetId
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(
            function(data) {
                $scope.widgetParams = {
                    siteid: siteid,
                    channelid: channelid
                };
                $scope.WidgetId = data.TEMPID;
                $scope.objText = data.DATAJSON;
                $scope.objText = eval($scope.objText);
                $scope.pubtime = data.PUBLISHTIME;
                var targetDiv = element.find('all');
                var targetAppend = '';
                for (var i = 0; i < $scope.objText.length; i++) {
                    var objType = $scope.objText[i].type;
                    switch (objType) {
                        case "image":
                            if (!angular.isDefined($scope.objText[i].content[0])) {
                                $scope.objText[i].content[0] = {};
                            }
                            $scope['singleImgData' + i] = $scope.objText[i].content[0];
                            var tarSingleImg = '<trs-single-img index="' + i + '" required="' + $scope.objText[i].required + '" widget-params="widgetParams" json-obj="singleImgData' + i + '"></trs-single-img>';
                            targetAppend += tarSingleImg;
                            break;
                        case "images":
                            if (!angular.isDefined($scope.objText[i].content[0])) {
                                $scope.objText[i].content[0] = {};
                            }
                            $scope['multiImgsData' + i] = $scope.objText[i].content;
                            var tarMultiImgs = '<trs-frag-imgs index="' + i + '" required="' + $scope.objText[i].required + '" widget-params="widgetParams" json-obj="multiImgsData' + i + '"></trs-frag-imgs>';
                            targetAppend += tarMultiImgs;
                            break;
                        case "docs":
                            var tarManyDocs = '<trs-frag-docs widget-params="widgetParams" required="' + $scope.objText[i].required + '" json-obj="multiDocsData' + i + '"></trs-frag-docs>';
                            targetAppend += tarManyDocs;
                            $scope['multiDocsData' + i] = $scope.objText[i].content;
                            break;
                        case "doc":
                            if (!angular.isDefined($scope.objText[i].content[0])) {
                                $scope.objText[i].content[0] = {};
                            }
                            $scope['singleDocData' + i] = $scope.objText[i].content[0];
                            var tarManyDoc = '<trs-frag-single-doc required="' + $scope.objText[i].required + '" index="' + i + '" widget-params="widgetParams" json-obj="singleDocData' + i + '"></trs-frag-single-doc>';
                            targetAppend += tarManyDoc;
                            break;
                    }
                }
                targetAppend = $compile(targetAppend)($scope);
                $(targetDiv).empty();
                $(targetDiv).html(targetAppend);
            },
            function(data) {

            });
        $scope.datapkerClk = function() {
            $scope.datepickerToggle = !$scope.datepickerToggle;
        };
        $scope.preview = function() {
            /*var parentLocation = parent.location.href;
            var newLocation = "";
            if (parentLocation.indexOf("#") > 0) {
                parentLocation = parentLocation.substring(0, parentLocation.indexOf("#"));
            }
            newLocation = parentLocation + "#widget" + widgetId;
            //newLocation = "http://www.baidu.com";
            console.log("asdfa" + parentLocation);
            console.log("adfaf" + newLocation);
            //  window.parent.location.href = parentLocation;*/
            var DataJson = $scope.objText;
            DataJson = JSON.stringify(DataJson);
            var previewParams = {
                "serviceid": "mlf_widget",
                "methodname": "templatePreview",
                "ObjectId": objectid,
                "TemplateId": tempid,
                "ObjectType": objecttype,
                "WidgetId": widgetId,
                "datajson": DataJson
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), previewParams, "get")
                .then(function(data) {
                    window.open(data + "&siteid=" + siteid + "&tempid=" + tempid + "&objectid=" + objectid + "&objecttype=" + objecttype + "&channelid=" + channelid + "&isfragment=" + true + "#widget" + widgetId);
                });
        };
        $scope.cancel = function() {
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index);
        };
        $scope.save = function(type) {
            validateForm().then(function() {
                save(type);
            });
        };

        function validateForm() {//兼容拖拽或者导入时，表单校验$invalid失效问题
            var deffer = $q.defer(); 
            $validation.validate($scope.fragementForm).success(function() {
                    deffer.resolve();
                })
                .error(function() {
                    $timeout(function() {
                        var errorNum = 0;
                        for (var i in $scope.fragementForm.$error) {
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
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            $http.defaults.headers.post['Content-Type'] = 'aaa';
            $http.defaults.headers.put['Content-Type'] = 'aaa';
            var DataJson = $scope.objText;
            DataJson = JSON.stringify(DataJson);
            var PublishTime = $scope.pubtime;
            var WidgetId = $scope.WidgetId;
            var isPub = true;
            if (type == 1) {
                isPub = false;
            } else {
                isPub = true;
            }
            var saveParams = {
                serviceid: "mlf_widget",
                methodname: "saveWidgetData",
                WidgetId: WidgetId,
                DocIds: "1",
                IsPub: isPub,
                DataJson: DataJson,
                PublishTime: PublishTime
            };

            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), saveParams, "post").then(
                function(data) {
                    trsconfirm.alertType("保存成功", "", "success", false, function() {
                        parent.location.reload();
                        /*$timeout(function(){
                            parent.layer.close(index);
                        },1000) */
                    });
                });
        }
    }]).controller("trsPhotoCropCtrl", ["$scope", "$compile", "$timeout", "params", "$modalInstance", function($scope, $compile, $timeout, params, $modalInstance) {
        editPhotoCallback = function() {
            $scope.$close();
        };
    }]);
