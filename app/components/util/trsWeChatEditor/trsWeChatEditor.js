/**
 Created by fanglijuan on 2016/08/01.  135微信编辑器
 html:
 description: 

**/
"use strict";
angular.module("util.trsWeChatEditorModule", ["trsWetchatTemplateServiceModule"]).directive("trsWeChatEditor", ["$compile", "trsWetchatTemplateService", function($compile, trsWetchatTemplateService) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "./components/util/trsWeChatEditor/trsWeChatEditor.html",
        scope: {
            wechatTemplate: "=",
            getSection: "&"
        },
        link: function(scope, element, attrs, controller) {
            init();

            function init() {
                scope.status = {
                    tabLists: {
                        title: "标题",
                        content: "正文",
                        picture: "图片",
                        imageText: "图文",
                        layout: "布局",
                        colorScheme: "配色方案"
                    },
                    html: {
                        content: [],
                        title: [],
                        layout: [],
                        imageText: [],
                        picture: []
                    }
                };
                scope.isSelectedTab = scope.status.tabLists.title;
                showSelectedCon("title");
            }
            /**
             * [showTab description  点击tab切换当前模块]
             * @param  {[type]} name [description]
             * @return {[type]}      [description]
             */
            scope.showTab = function(name) {
                showSelectedCon(name);
            };
            /**
             * [showSelectedCon description显示当前模块]
             * @param  {[type]} name [description]
             * @return {[type]}      [description]
             */
            function showSelectedCon(name) {
                scope.isSelectedTab = scope.status.tabLists[name];
                if ($(element).find("ul[id$='" + name + "']").html() === "") {
                    trsWetchatTemplateService.getTemplate(name).then(function(data) {
                        $(element).find("ul[id$='" + name + "']").html($compile(data)(scope));
                    });
                }
            }
            /**
             * [getHtmlToUEditor description点击选取标签到右侧编辑器中]
             * @param  {[type]} event [description]
             * @return {[type]}       [description]
             */
            scope.getHtmlToUEditor = function(event) {
                scope.wechatTemplate = event.currentTarget.outerHTML;
                scope.getSection();
            };
        }
    };
}]);
