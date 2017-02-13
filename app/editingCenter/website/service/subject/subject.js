angular.module('editWebsteSubjectViewModule', [])
    .controller('editWebsteSubjectViewCtrl', ['$scope', "$modalInstance", "trsHttpService", "trsconfirm", "params", function($scope, $modalInstance, trsHttpService, trsconfirm, params) {
        initStatus();
        initData();
        /*初始化状态*/
        function initStatus() {
            $scope.params = {
                serviceid: "mlf_tag",
                methodname: "queryUserFocusSpecial",
                channelId: params.channelid,
            };
            $scope.currDraftParams = {
                serviceid: "mlf_tag",
                methodname: "queryTagsFromViewData",
                metadataid: params.metadataId,
            }
            $scope.status = {};
            $scope.data = {
                items: "",
                selectedArray: [],
                metadataId: params.metadataId,
                originalTag: [],
            };
        }
        /*初始化请求数据*/
        function initData() {
            requestData();
            if (angular.isDefined(params.metadataId)) getCurrDraftTag();
        }
        /*请求所有关注的专题及其标签*/
        function requestData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
                $scope.data.items = data.DATA;
            })
        }
        /*请求当前稿件的标签*/
        function getCurrDraftTag() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.currDraftParams, 'post').then(function(data) {
                angular.forEach(data, function(value, key) {
                    $scope.data.selectedArray.push(value.TAGID);
                    $scope.data.originalTag.push(value.TAGID);
                });
            })
        }
        /*取消关闭弹窗*/
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        /*取消关注*/
        $scope.cancelFollow = function(item) {
            trsconfirm.confirmModel("取消关注", "确认取消关注所选专题", function() {
                var params = {
                    serviceid: "mlf_tag",
                    methodname: "quXiaoFocusSpecial",
                    metadataids: item.METADATAID
                }
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function() {
                    requestData();
                    $scope.data.selectedArray = [];
                })
            })
        };
        /*单选*/
        $scope.singleSelect = function(tag) {
            var index = $scope.data.selectedArray.indexOf(tag.SPECAILTAGID);
            if (index < 0) {
                $scope.data.selectedArray.push(tag.SPECAILTAGID);
            } else {
                $scope.data.selectedArray.splice(index, 1);
            }
        };
        /*确定*/
        $scope.confirm = function() {
            var result = {
                selectedArray: $scope.data.selectedArray,
                originalTag: $scope.data.originalTag,
            }
            $modalInstance.close(result);
        };
    }])
