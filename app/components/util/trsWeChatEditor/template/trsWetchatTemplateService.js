/**
 Created by bai.zhiming on 2016/08/02.  微信编辑器模板服务
 html:
 description: 

**/
"use strict";
angular.module("trsWetchatTemplateServiceModule", []).factory("trsWetchatTemplateService", ['$templateRequest', '$q',
    function($templateRequest, $q) {
        var arrayObj = {
            contentTemplateNameArray: ["1.html", "2.html", "3.html", "4.html", "5.html", "6.html", "7.html", "8.html", "9.html", "10.html",
                "10.html", "11.html", "12.html", "13.html", "14.html", "15.html", "16.html", "17.html", "18.html", "19.html",
                "20.html", "21.html", "22.html", "23.html", "24.html", "25.html", "26.html", "27.html", "28.html", "29.html",
                "30.html", "31.html", "32.html", "33.html", "34.html", "35.html", "36.html", "37.html", "38.html", "39.html",
                "40.html", "41.html", "42.html", "43.html", "44.html", "45.html", "46.html", "47.html", "48.html", "49.html",
                "50.html", "51.html", "52.html", "53.html", "54.html", "55.html", "56.html", "57.html", "58.html", "59.html",
                "60.html", "61.html", "62.html", "63.html", "64.html", "65.html", "66.html", "67.html", "68.html", "69.html",
                "70.html", "71.html", "72.html", "73.html", "74.html", "75.html"
            ],
            imageTextTemplateNameArray: ["1.html", "2.html", "3.html", "4.html", "5.html", "6.html", "7.html", "8.html", "9.html", "10.html",
                "10.html", "11.html", "12.html", "13.html", "14.html", "15.html", "16.html", "17.html", "18.html", "19.html",
                "20.html", "21.html", "22.html", "23.html", "24.html", "25.html", "26.html", "27.html", "28.html"
            ],
            layoutTemplateNameArray: ["1.html", "2.html", "3.html", "4.html", "5.html", "6.html", "7.html", "8.html"],
            pictureTemplateNameArray: ["1.html", "2.html", "3.html", "4.html", "5.html", "6.html", "7.html"],
            titleTemplateNameArray: ["1.html", "2.html", "3.html", "4.html", "5.html", "6.html", "7.html", "8.html", "9.html", "10.html",
                "10.html", "11.html", "12.html", "13.html", "14.html", "15.html", "16.html", "17.html", "18.html", "19.html",
                "20.html", "21.html", "22.html", "23.html", "24.html", "25.html", "26.html", "27.html"
            ]
        };
        var urlMap = {
            "content": "./components/util/trsWeChatEditor/template/content/",
            "title": "./components/util/trsWeChatEditor/template/title/",
            "imageText": "./components/util/trsWeChatEditor/template/imageText/",
            "picture": "./components/util/trsWeChatEditor/template/picture/",
            "layout": "./components/util/trsWeChatEditor/template/layout/"
        };
        /**
         * [getTemplate description递归获取当前模块对应的所有标签]
         * @param  {[type]}   url           [description]
         * @param  {[type]}   i             [description]
         * @param  {[type]}   templateHtml  [description]
         * @param  {[type]}   templateArray [description]
         * @param  {Function} callback      [description]
         * @return {[type]}                 [description]
         */
        function getTemplate(url, i, templateHtml, templateArray, callback) {
            $templateRequest(url + templateArray[i]).then(
                function(html) {
                    i++;
                    var dom = document.createElement("div");
                    dom.innerHTML = html;
                    $($(dom).find("section")[0]).attr("ng-click", "getHtmlToUEditor($event)");
                    html = $(dom).html();
                    templateHtml += "<li  style='display: block;'>" + html + "</li>";
                    if (i < templateArray.length) {
                        getTemplate(url, i, templateHtml, templateArray, callback);
                    } else {
                        callback(templateHtml);
                    }
                });
        }
        return {
            //获取正文模板
            getTemplate: function(name) {
                var deffer = $q.defer();
                var i = 0;
                var templateHtml = "";
                getTemplate(urlMap[name], i, templateHtml, arrayObj[name + "TemplateNameArray"], function(data) {
                    deffer.resolve(data);
                });
                return deffer.promise;
            },
        };
    }
]);
