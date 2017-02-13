"use strict";
/* ************* name ***************
// Readme: <trs-big-face></trs-big-face>
// Example usage:li.pengyang
// Data: 2016/1/14 14:36:25 
*******************************************/
angular.module('util.trsBigFaceModule', [])
    .directive('trsBigFace', ["trsHttpService", "$compile", "$timeout", "localStorageService", "globleParamsSet", function(trsHttpService, $compile, $timeout, localStorageService, globleParamsSet) {
        return {
            restrict: 'E',
            scope: false,
            template: "<div ng-bind-html='faceHTML'></div>",
            link: function($scope, iElement, iAttrs) {
                $scope.cacheFaceContent = null;
                $scope.cacheFaceHTML = null;
                $scope.bigFace = function(item) {
                    var bigParent = iElement.closest('.bigFaceDetail');
                    if (angular.isUndefined(item.METADATAID)) return;
                    if (!$scope.cacheFaceHTML) {
                        $scope.cacheFaceHTML = item.HTMLCONTENT;
                        $scope.cacheFaceContent = globleParamsSet.getBigFaceContent(item.HTMLCONTENT); //item.CONTENT
                    }
                    if ($scope.status.bitFaceTit == "查看痕迹") {

                        var relEl = iAttrs['relEl'];
                        if (relEl) {
                            iElement.closest('.bigFaceBorder').css('height', $(relEl).height() + 'px');
                        }
                        bigParent.show();
                        bigParent.siblings('.bigFaceDetailLeft').addClass("col-md-6 col-sm-6").removeClass("col-md-9 col-sm-8");
                        bigParent.siblings('.bigFaceDetailRigth').hide();
                        $scope.status.bitFaceTit = "关闭痕迹";
                        var params = {
                            serviceid: "mlf_extversion",
                            methodname: "getMetaViewDataVersions",
                            MetaDataId: item.METADATAID
                        };
                        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                            /*var params = {
                                data: data,
                                metadataid: item.METADATAID
                            };*/
                            //data = textConversion(data);
                            // require(["./lib/bigface/trsbigface.js"], function() {
                            LazyLoad.js(["./lib/bigface/bigface.js?v9.0"], function() {
                                LazyLoad.css(["./lib/bigface/bigface.css?v9.0"], function() {
                                    /*var result = trsBigFace.Compare(data);
                                result = $compile(result)($scope);
                                result.each(function(index, element) {
                                    $(this).html($(this).html().replace(/&amp;/g, ""));
                                    $(this).html($(this).html().replace(/nbsp;/g, "\u3000"));
                                });
                                iElement.html(result);
                                $timeout(function() {
                                    if (bigParent.length == 0) {
                                        item.HTMLCONTENT = "";
                                        item.CONTENT = "";
                                    }
                                });*/
                                    var myData = textConversion(data);
                                    var bigface = new trs.BigFace("CONTENT");
                                    var result = bigface.execute(myData);
                                    result = bindUserColor(result);
                                    var html = [];
                                    var userHtmlObj = {};
                                    html.push("<div class='bigface'>");
                                    if (result !== undefined) {
                                        for (var i = 0; i < result.length; i++) {
                                            var range = result[i];
                                            //var operVersion = range.type == '-' ? range.lv : range.VERSIONNUM;
                                            var userNum = range.USERNUM;
                                            var opertype = range.type == '+' ? 'add' : (range.type == '-' ? 'sub' : 'org');
                                            var titleWithoutOperType = range.TRUENAME + "，" + range.CRTIME;
                                            var title = titleWithoutOperType + (opertype === 'add' ? '新增' : '删除');
                                            if (range.type !== "=") {
                                                html.push('<span ',
                                                    'title="' + title + '"',
                                                    /*' version="' + operVersion + '"',
                                                    ' user = "' + range.TRUENAME + '"',
                                                    ' versionnum = "' + operVersion + '"',
                                                    ' method="' + opertype + '"',
                                                    ' crtime="' + range.CRTIME + '"',*/
                                                    ' opertype="' + opertype + '"',
                                                    //' class="v' + range.VERSIONNUM + '"',
                                                    ' class="v' + userNum + '"',
                                                    '>',
                                                    range.fragment.replace(/\n/g, "<br/>").replace(/\u3000/g, "<span title='" + title + "' opertype='" + opertype + "' class='v" + userNum + " space-bg" + userNum + "'>\u3000</span>"),
                                                    '</span>');
                                            } else {
                                                html.push('<span',
                                                    '>',
                                                    range.fragment.replace(/\n/g, "<br/>"),
                                                    '</span>');
                                            }
                                            if (userHtmlObj[userNum] === undefined) {
                                                if (i > 0 && range.type === "=") continue;
                                                userHtmlObj[userNum] = "<li>" +
                                                    "<span class='uservT userv" + userNum + "'></span>" +
                                                    "<label>" + range.TRUENAME + "</label>" +
                                                    "</li>";
                                            }
                                        }
                                    } else {
                                        html.push(myData[0].CONTENT.replace(/\n/g, "<br/>"));
                                        userHtmlObj["1"] = "<li>" +
                                            "<span class='uservT userv" + 1 + "'></span>" +
                                            "<label>" + myData[0].TRUENAME + "</label>" +
                                            "</li>";
                                    }
                                    html.push("</div>");
                                    var userHtml = "<div class='bigFaceUser bigFace'><ul>";
                                    for (var j in userHtmlObj) {
                                        userHtml += userHtmlObj[j];
                                    }
                                    userHtml += "</ul></div>";
                                    var htmlComplied = $compile(html.join(""))($scope);
                                    var userHtmlComplied = $compile(userHtml)($scope);
                                    iElement.html(userHtmlComplied);
                                    iElement.append(htmlComplied);
                                });
                            });
                            // });

                        });
                    } else {
                        $scope.status.bitFaceTit = "查看痕迹";
                        iElement.html("");
                        item.HTMLCONTENT = $scope.cacheFaceHTML;
                        item.CONTENT = globleParamsSet.getBigFaceContent(angular.copy($scope.cacheFaceHTML)); //cacheFaceContent;
                        bigParent.hide();
                        bigParent.siblings('.bigFaceDetailLeft').removeClass("col-md-6 col-sm-6").addClass("col-md-9 col-sm-8");
                        bigParent.siblings('.bigFaceDetailRigth').show();

                    }
                };

                function textConversion(data) {
                    for (var i = 0; i < data.length; i++) {
                        /*var htmlcontent = data[i].HTMLCONTENT;
                        var content = htmlcontent.replace(/\n/g, "");
                        var dom = document.createElement("div");
                        dom.innerHTML = content;
                        content = dom.innerText.replace(/\u00a0/g, ' ');*/
                        //data[i].HTMLCONTENT = data[i].HTMLCONTENT.replace(/\u0020/g,"");
                        var centerSpace = titleCenter();
                        var content = globleParamsSet.getBigFaceContent("<p>" + centerSpace + data[i].TITLE + "</p><p>　</p>" + data[i].HTMLCONTENT);
                        data[i].CONTENT = content;
                    }
                    return data;
                }
                //绑定用户颜色
                function bindUserColor(data) {
                    if (angular.isUndefined(data)) return;
                    var userNum = 2;
                    var colorUserMap = {};
                    colorUserMap[data[0].TRUENAME + "org"] = "1";
                    data[0].USERNUM = "1";
                    for (var i = 1; i < data.length; i++) {
                        if (data[i].type === "=") continue;
                        if (colorUserMap[data[i].TRUENAME] === undefined) {
                            colorUserMap[data[i].TRUENAME] = userNum;
                            data[i].USERNUM = userNum + "";
                            userNum++;
                        } else {
                            data[i].USERNUM = colorUserMap[data[i].TRUENAME] + "";
                        }
                    }
                    return data;
                }

                function titleCenter() {
                    var space = "　";
                    for (var i = 0; i < 5; i++) {
                        space += "　";
                    }
                    return space;
                }
            }
        };
    }]).directive('version', ["trsHttpService", "$compile", function(trsHttpService, $compile) {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                iElement.popover({
                    html: true,
                    "tooltip-trigger": "mouseenter",
                    "trigger": "hover",
                    "placement": "top",
                    content: function() {
                        var tempArr = [];
                        tempArr.push("<table class='table bigFace table-bordered'>");
                        tempArr.push("    <tr>");
                        tempArr.push("        <td>用户</td>");
                        tempArr.push("        <td><font color='red'>" + iAttrs.user + "</font></td>");
                        tempArr.push("    </tr>");
                        tempArr.push("    <tr>");
                        tempArr.push("        <td>版本号</td>");
                        tempArr.push("        <td>" + iAttrs.versionnum + "</td>");
                        tempArr.push("    </tr>");
                        tempArr.push("    <tr>");
                        tempArr.push("        <td>操作</td>");
                        if (iAttrs.method == "add") {
                            tempArr.push("        <td><font color='red'>新增</font></td>");
                        } else if (iAttrs.method == "sub") {
                            tempArr.push("        <td><font color='red'>删除</font></td>");
                        } else {
                            tempArr.push("        <td><font color='red'>原版</font></td>");
                        }
                        tempArr.push("    </tr>");

                        tempArr.push("    <tr>");
                        tempArr.push("        <td>时间</td>");
                        tempArr.push("        <td>" + iAttrs.crtime + "</td>");
                        tempArr.push("    </tr>");
                        tempArr.push("</table>");
                        return tempArr.join("");
                    }
                });
            }
        }
    }]);
