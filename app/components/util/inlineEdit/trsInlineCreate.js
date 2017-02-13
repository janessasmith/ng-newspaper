"use strict";
/**
 *  Module
 *
 * Description
 */
angular.module('components.directive').directive('trsAddToCreate', ['$window', '$stateParams', 'trsHttpService', "$timeout", "trsconfirm", function($window, $stateParams, trsHttpService, $timeout, trsconfirm) {

    /**
     * [addToCreationFromWCM description] 从WCM加入到创作轴
     * @param {[type]} imgname    [description] 图片路径
     * @param {[type]} imgauthor  [description] 图片作者
     * @param {[type]} content    [description] 正文
     */
    function addToCreationFromWCM(imgname, imgauthor, content, metadataid) {
        var params = {
            serviceid: "mlf_releasesource",
            methodname: "setCreation",
            metadataid: metadataid || $stateParams.metadata,
            imgname: imgname,
            imgauthor: imgauthor,
            content: content
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("加入创作轴成功", "", "success", false);
            $window.document.getSelection().collapse($window.document, 1);
            //console.log("加入WCM创作轴成功");
        });
    }

    /**
     * [addToCreationFromCB description] 从川报加入到创作轴
     * @param {[type]} imgname    [description] 图片路径
     * @param {[type]} imgauthor  [description] 图片作者
     * @param {[type]} content    [description] 正文
     */
     //川报修改
    function addToCreationFromCB(imgname, imgauthor, content) {
        var params = {
            serviceid: "mlf_xhsgoper",
            methodname: "creation",
            XHSGId: $stateParams.xhsgsourceid,
            ImgName: imgname,
            imgauthor: imgauthor,
            Content: content
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("加入创作轴成功", "", "success", false);
            $window.document.getSelection().collapse($window.document, 1);
        });
    }

    /**
     * [addToCreationFromCB description] 从川报自定义稿源加入到创作轴
     * @param {[type]} imgname    [description] 图片路径
     * @param {[type]} imgauthor  [description] 图片作者
     * @param {[type]} content    [description] 正文
     */
     //川报修改{}
    function addToCreationFromCBCustom(imgname, imgauthor, content) {
        var params = {
            serviceid: "mlf_cusmodaldocoper",
            methodname: "creation",
            CusModalDocId: $stateParams.customid,
            ImgName: imgname,
            imgauthor: imgauthor,
            Content: content
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("加入创作轴成功", "", "success", false);
            $window.document.getSelection().collapse($window.document, 1);
        });
    }

    /**
     * [addToCreationFromBD description]从大数据加入到创作轴
     * @param {[type]} imgname [description]图片路径
     * @param {[type]} content [description]正文
     */
    function addToCreationFromBD(imgname, content, guid, channelName, indexName) {
        var params = {
            serviceid: "mlf_bigdataexchange",
            methodname: "creation",
            guid: guid || $stateParams.metadata || $stateParams.guid,
            channelName: channelName || $stateParams.channel || "iwo",
            indexName: indexName || $stateParams.indexname || "",
            imgname: imgname,
            content: content,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("加入创作轴成功", "", "success", false);
            $window.document.getSelection().collapse($window.document, 1);
            //console.log("加入BD创作轴成功");
        });
    }

    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope: {
            author: "@",
            data: "="
        }, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        //
        //templateUrl: './components/util/inlineEdit/main_tpl.html',
        // replace: true,
        //transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, $element, iAttrs, controller) {
            var paddingLeft = parseInt(iAttrs['trsCreatePaddingLeft'] || 0, 10);
            var paddingTop = parseInt(iAttrs['trsCreatePaddingTop'] || 0, 10);

            var imgIdentity = iAttrs['imgIdentity'];

            function hideShare() {
                $('#imgSinaShare').hide();
            }

            function documentMousedownHandler(event) {
                if (event.target.id == 'imgSinaShare') {
                    return;
                }
                hideShare();
            }

            $(document).bind('mousedown', documentMousedownHandler);

            $scope.$on('$destroy', function() {
                $(document).unbind('mousedown', documentMousedownHandler);
            });

            $timeout(function() {
                if ($('#imgSinaShare').size() <= 0) {
                    $(document.body).append('<img title="加入到创作轴" class="trsInlineCreate" id="imgSinaShare" src="./components/util/inlineEdit/images/createLine.png" />');
                }

                $scope.$on('$destroy', function() {
                    $('#imgSinaShare').remove();
                });

                var $sinaMiniBlogShare = function(eleShare) {
                    var eleTitle = $window.document.getElementsByTagName("title")[0];

                    var funGetSelectTxt = function() {
                        var txt = "";
                        if ($window.document.selection) {
                            txt = $window.document.selection.createRange().text; // IE
                        } else {
                            txt = $window.document.getSelection();
                        }
                        return txt;
                    };

                    var showShare = function(position) {
                        eleShare.style.display = "inline";
                        eleShare.style.left = position.left + "px";
                        eleShare.style.top = position.top + "px";
                    };

                    $element.bind('mouseup', function(event) {
                        var target = event.target;

                        if (target == eleShare) {
                            return;
                        }

                        var txt = funGetSelectTxt();
                        if (txt != '') {
                            var position = {};
                            var e = event;
                            var sh = $window.pageYOffset || $window.document.documentElement.scrollTop || $window.document.body.scrollTop || 0;
                            position.left = (e.clientX - 40 < 0) ? e.clientX + 20 : e.clientX - 40;
                            position.top = (e.clientY - 40 < 0) ? e.clientY + sh + 20 : e.clientY + sh - 40;
                            showShare(position);
                        } else {
                            hideShare();
                        }
                    });

                    var currImg;
                    //$element.find('img').bind('mouseenter', function(event) {
                    $element.delegate('img', 'mouseenter', function(event) {
                        var target = event.target;

                        if (target == eleShare) {
                            return;
                        }

                        var $target = $(target);
                        if (imgIdentity) {
                            $target = $target.closest(imgIdentity);
                        }

                        var tPosition = $target.offset();
                        var position = {};
                        position.left = tPosition.left + paddingLeft + 10;
                        position.top = tPosition.top + paddingTop + 10;
                        currImg = $target[0];
                        showShare(position);
                    });

                    $element.bind('mousemove', function(event) {
                        if (!currImg) {
                            return;
                        }

                        var bounding = currImg.getBoundingClientRect();
                        if (event.clientX < bounding.left || event.clientX > bounding.right || event.clientY < bounding.top || event.clientY > bounding.bottom) {
                            currImg = null;
                            hideShare();
                        }
                    });

                    $(eleShare).bind('click', function(event) {
                        hideShare();
                        var txt = funGetSelectTxt(),
                            title = (eleTitle && eleTitle.innerHTML) ? eleTitle.innerHTML : "未命名页面";
                        var content, imgname, imgauthor;
                        var guid, channelName, indexName, metadataid;
                        metadataid = $stateParams.metadataid;

                        if (currImg) {
                            imgname = currImg.src || currImg.getAttribute('trs-src');
                            content = "";
                            imgauthor = currImg.getAttribute("IMGAUTHOR") || "";
                            guid = currImg.getAttribute("trs-guid");
                            channelName = currImg.getAttribute("trs-channelName");
                            indexName = currImg.getAttribute("trs-indexName");
                        } else if (txt) {
                            imgname = "";
                            content = txt.toString();
                            imgauthor = "";
                        }
                        if (angular.isDefined($stateParams.metadataid) || angular.isDefined($stateParams.metadata)) {
                            //WCM
                            if (angular.isDefined($scope.data) && angular.isDefined($scope.data.items) && $scope.data.items.MLFTYPE === '1') {
                                addToCreationFromBD(imgname, content, metadataid, $scope.data.item.INDEXNAME);
                            } else { //稿件收藏虽然在采编中心，但是仍然要调资源中心的加入创作轴方法
                                addToCreationFromWCM(imgname, imgauthor, content, metadataid);
                            }
                        }
                        //川报修改
                        else if (angular.isDefined($stateParams.xhsgsourceid)) {
                            addToCreationFromCB(imgname, imgauthor, content);
                        }
                        //川报修改{} 
                        else if (angular.isDefined($stateParams.customid)) {
                            addToCreationFromCBCustom(imgname, imgauthor, content);
                        }
                        else {
                            //大数据
                            addToCreationFromBD(imgname, content, guid, channelName, indexName);
                        }
                    });
                };
                $sinaMiniBlogShare($window.document.getElementById("imgSinaShare"));
            }, 500);
        }
    };
}]);
