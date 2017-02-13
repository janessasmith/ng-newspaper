/*
  Create by BaiZhiming 2016-3-8
*/
'use strict';
var ueditor_closeMas; //跨域通知；
angular.module("util.ueditorServiceModule", [])
    .factory("ueditorService", ["$modal", "localStorageService", function($modal, localStorageService) {
        function replaceHtmlBlank(htmlContent) {
            htmlContent = htmlContent.replace(/(<[^>]+>)([^<>]+)(<[^>]+>)/g, function($0, $1, $2, $3) {
                var innerContent = $2.replace(/ /g, "\u3000");
                return $1 + innerContent + $3;
            });
            return htmlContent;
        }
        return {
            insertVideo: function(success) {
                var modalInstance = $modal.open({
                    templateUrl: "./components/util/ueditor/service/template/insertVideo_tpl.html?myvideoclose=" + window.location.href,
                    windowClass: 'ueditor-insertVideo-window',
                    backdrop: false,
                    controller: "insertVideoCtrl",
                    /*resolve: {
                        shareParams: function() {
                            return {
                                "serviceid": shareServiceid,
                                "methodname": shareMethodname
                            };
                        }
                    }*/
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            saveContent: function(list) {
                var ue = UE.getEditor('ueditor');
                list.HTMLCONTENT = ue.getContent();
                var content = list.HTMLCONTENT.replace(/\n/g, "");
                var dom = document.createElement("div");
                dom.innerHTML = content;
                content = dom.innerText.replace(/\u00a0/g, ' ');
                /*
                content = content.replace(/\n/g, "").replace(/<\/(div|p|h\d)>/ig, "\n")
                    .replace(/<br[^>]*>/ig, "\n").replace(/<[^>]+>/g, "")
                    .replace(/&nbsp;/g, "");
                    */
                list.CONTENT = content;
                list.DOCWORDSCOUNT = content.replace(/\n/g, "").replace(/\u0020/g, "").replace(/\u3000/g, "").length;
            },
            bindContent: function() {
                var ue = UE.getEditor('ueditor');
                var HTMLCONTENT = ue.getContent();
                var content = HTMLCONTENT.replace(/\n/g, "");
                var dom = document.createElement("div");
                dom.innerHTML = content;
                content = dom.innerText.replace(/\u00a0/g, ' ');
                return content;
            },
            contentTranscoding: function(list) {
                var htmlcontent = list.HTMLCONTENT;
                var content = htmlcontent.replace(/\n/g, "");
                var dom = document.createElement("div");
                dom.innerHTML = content;
                content = dom.innerText.replace(/\u00a0/g, ' ');
                /*
                content = content.replace(/\n/g, "").replace(/<\/(div|p|h\d)>/ig, "\n")
                    .replace(/<br[^>]*>/ig, "\n").replace(/<[^>]+>/g, "")
                    .replace(/&nbsp;/g, "");
                    */
                return content;
            },
            replaceHtmlBlank: function(htmlContent, versionid) {
                return replaceHtmlBlank(htmlContent);
            },
            saveToLocal: function(docId, versionid) {
                versionid = angular.isDefined(versionid) && versionid !== "" ? versionid : '0';
                var ue = UE.getEditor('ueditor');
                var content = ue.getContent();
                if (content !== "") {
                    var storage = localStorageService.get("ueLocalVersion");
                    if (storage !== null) {
                        var flag = true;
                        for (var i = 0; i < storage.length; i++) {
                            if (storage[i].ID === (docId + "")) {
                                storage[i].CONTENT = replaceHtmlBlank(content);
                                storage[i].VERSIONID = versionid;
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            storage.unshift({
                                ID: (docId + ""),
                                CONTENT: replaceHtmlBlank(content),
                                VERSIONID: versionid
                            });
                            if (storage.length > 10) {
                                storage.length = 10;
                            }
                        }
                        /*ue.trigger('showmessage', {
                            content: ue.getLang('autosave.saving'),
                            timeout: 2000
                        });*/
                        localStorageService.set("ueLocalVersion", storage);
                    } else {
                        var ueLocalVersion = [];
                        var version = {};
                        version.ID = (docId + "");
                        version.CONTENT = replaceHtmlBlank(content);
                        version.VERSIONID = versionid;
                        ueLocalVersion.push(version);
                        /*ue.trigger('showmessage', {
                            content: ue.getLang('autosave.saving'),
                            timeout: 2000
                        });*/
                        localStorageService.set("ueLocalVersion", ueLocalVersion);
                    }
                    /*setTimeout(function() {
                        ue.trigger('showmessage', {
                            content: ue.getLang('autosave.success'),
                            timeout: 2000
                        });
                    }, 2000);*/
                }
            },
            /**
             * [handlingSensitiveInf description]处理敏感信息
             * @param  {[type]} SensitiveWordresults [description]敏感词结果
             * @param  {[type]} htmlcontent [description]html正文
             * @return {[type]}      [description]
             */
            handlingSensitiveInf: function(SensitiveWordresults, htmlcontent) {
                var resultInfo = SensitiveWordresults.content[0].resultInfo;
                for (var i = 0; i < resultInfo.length; i++) {
                    htmlcontent = htmlcontent.replace(new RegExp(resultInfo[i].errorWord, "g"), "<span style='background-color:#F89F9F' title='" + resultInfo[i].errorInfo + "'>" + resultInfo[i].errorWord + "</span>");
                }
                return htmlcontent;
            }
        };
    }])
    .controller("insertVideoCtrl", ["$scope", "trsHttpService", "$modalInstance", "$window", "localStorageService", "globleParamsSet", "$sce", function($scope, trsHttpService, $modalInstance, $window, localStorageService, globleParamsSet, $sce) {
        initStatus();
        $scope.close = function() {
            $modalInstance.dismiss();
        };
        $window.addEventListener("storage", function(e) {
            if (angular.isDefined(localStorageService.get("ue.video"))) {
                $modalInstance.close(localStorageService.get("ue.video"));
            }
        });

        function initStatus() {
            localStorageService.remove("ue.video");
            $scope.data = {
                iframeUrl: $sce.trustAsResourceUrl(globleParamsSet.getMasUrl() + "/mas/openapi/pages.do?method=list&appKey=" + globleParamsSet.getMasConfig())
            };
        }
        ueditor_closeMas = function() {
            $modalInstance.dismiss();
        };
    }]);
