"use strict";
/**
 * Created by MRQ on 2016/1/8.
 */
angular.module("mangeProColumnCtrlModule", [])
    .controller('columnDeleteCtrl', ['$scope', '$stateParams', "$modalInstance", "item", "successFn", "productMangageMentWebsiteService", function($scope, $stateParams, $modalInstance, item, successFn, productMangageMentWebsiteService) {
        init();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $modalInstance.close({});
        };
        $scope.deleteToggle = function() {
            $scope.isDeleteFirst = true;
        };

        function init() {
            $scope.viewName = item;
            $scope.isDeleteFirst = false;
        }
    }])
    .controller("columnModifyCtrl", ["$scope", "$validation", "$modalInstance", "$stateParams", "$modal", "initManageConSelectedService", "column", "productMangageMentWebsiteService", "websiteChannel", "trsHttpService", "trsconfirm", function($scope, $validation, $modalInstance, $stateParams, $modal, initManageConSelectedService, column, productMangageMentWebsiteService, websiteChannel, trsHttpService, trsconfirm) {
        initStatus();
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.confirm = function() {
            $validation.validate($scope.createChlForm).success(function() {
                $scope.channel.CHNLORDER = $scope.selectedWebChannel.value;
                $modalInstance.close($scope.channel);
            }).error(function() {
                $scope.showAllTips = true;
                trsconfirm.alertType("提交失败", "请检查表单", "info", false, function() {});
            });
        };
        //检测存放位置
        $scope.examinePos = function() {
            $scope.isShowTipsSiteName = false;
            var posParams = {
                serviceid: "mlf_websiteconfig",
                methodname: "checkChannelPath",
                Siteid: $stateParams.site,
                ChannelId: $scope.channel.OBJECTID,
                DataPath: $scope.channel.DATAPATH
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), posParams, "get").then(function(data) {
                $scope.savePos = data;
            });
        };

        function initStatus() {
            $scope.channel = {
                OBJECTID: 0,
                SITEID: $stateParams.site,
                CHNLNAME: "",
                CHNLDESC: "",
                PARENTID: $stateParams.channel,
                CHNLORDER: -1,
                DATAPATH: "",
                ISCLUSTER: 0,
                TEMPID: {
                    CHNLTEMPID: 0,
                    OTHERTEMPID: 0,
                    DOCTEMPID: 0
                }
            };
            $scope.tempName = {
                channelTempName: "",
                otherTempName: "",
                articleTempName: ""
            };
            $scope.selectedWebChannel = {
                value: "",
                name: ""
            };
            $scope.column = column;
            initAllChannels();
        }

        function initEditData() {
            $scope.params = {
                serviceid: "mlf_websiteconfig",
                methodname: "findChannelById",
                ChannelId: websiteChannel.CHANNELID,
                TopChannelId: $stateParams.parentchnl
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.channel = {
                    OBJECTID: data.CHANNELID,
                    SITEID: $stateParams.site,
                    CHNLNAME: data.CHNLNAME,
                    CHNLDESC: data.CHNLDESC,
                    PARENTID: data.PARENTID,
                    ROOTDOMAIN: data.ROOTDOMAIN,
                    CHNLORDER: -1,
                    DATAPATH: data.DATAPATH,
                    ISCLUSTER: data.ISCLUSTER,
                    TEMPID: {
                        CHNLTEMPID: 0,
                        OTHERTEMPID: 0,
                        DOCTEMPID: 0
                    }
                };
                //初始化模板绑定
                $scope.channel.TEMPID.CHNLTEMPID = angular.isDefined(data.GAILANTEMP[0]) ? data.GAILANTEMP[0].TEMPID : "0";
                $scope.channel.TEMPID.OTHERTEMPID = angular.isDefined(data.OTHERTEMP[0]) ? data.OTHERTEMP[0].TEMPID : "0";
                $scope.channel.TEMPID.DOCTEMPID = angular.isDefined(data.DOCTEMP[0]) ? data.DOCTEMP[0].TEMPID : "0";
                $scope.tempName.channelTempName = angular.isDefined(data.GAILANTEMP[0]) ? data.GAILANTEMP[0].TEMPNAME : "";
                $scope.tempName.otherTempName = angular.isDefined(data.OTHERTEMP[0]) ? data.OTHERTEMP[0].TEMPNAME : "";
                $scope.tempName.articleTempName = angular.isDefined(data.DOCTEMP[0]) ? data.DOCTEMP[0].TEMPNAME : "";
                var i = 0;
                while (i < $scope.websiteChannelsJson.length) {
                    if ($scope.websiteChannelsJson[i].value === data.CHNLORDER) {
                        $scope.websiteChannelsJson.splice(i, 1);
                        $scope.selectedWebChannel = angular.copy($scope.websiteChannelsJson[i - 1]);
                    } else {
                        i++;
                    }
                }
            });
        }

        function initAllChannels() {
            initManageConSelectedService.getWebsiteAllColumn($stateParams.channel).then(function(data) {
                $scope.websiteChannelsJson = data;
                $scope.websiteChannelsJson.unshift({
                    name: "最前面",
                    value: -1
                });
                $scope.selectedWebChannel = angular.copy($scope.websiteChannelsJson[0]);
                websiteChannel !== "" ? initEditData() : "";
            });
        }
        /**
         * [queryTemplate description]模板弹窗打开
         * @param  {[type]} TEMPLATETYPE [description]
         * @return {[type]}              [description]
         */
        function queryTemplate(TEMPLATETYPE, ID, Name) {
            var params = {
                ObjectType: "101",
                ObjectId: $scope.channel.OBJECTID > 0 ? $scope.channel.OBJECTID : $scope.channel.PARENTID,
                TEMPLATETYPE: TEMPLATETYPE,
                TempName: "",
            };
            productMangageMentWebsiteService.bindTemplate(params, function(result) {
                $scope.channel.TEMPID[ID] = result.TEMPID;
                $scope.tempName[Name] = result.TEMPNAME;
            });
        }
        /**
         * [chnlOtherTemplate description]栏目其他模板点击
         * @return {[type]} [description]
         */
        $scope.chnlOtherTemplate = function() {
            queryTemplate(1, 'OTHERTEMPID', 'otherTempName');
        };
        /**
         * [chnlTemplate description]栏目模板点击
         * @return {[type]} [description]
         */
        $scope.chnlTemplate = function() {
            queryTemplate(1, 'CHNLTEMPID', 'channelTempName');
        };
        /**
         * [defaultArticleTemplate description]默认文章模板
         * @return {[type]} [description]
         */
        $scope.defaultArticleTemplate = function() {
            queryTemplate(2, 'DOCTEMPID', 'articleTempName');
        };
        //获取前一级栏目
        $scope.querySelectChl = function() {
            $scope.channel.CHNLORDER = $scope.selectedWebChannel.value;
        };
        //选择栏目类型
        $scope.selectChlType = function() {
            $scope.channel.ISCLUSTER === 0 ? $scope.channel.ISCLUSTER = 1 : $scope.channel.ISCLUSTER = 0;
        };
    }]);
