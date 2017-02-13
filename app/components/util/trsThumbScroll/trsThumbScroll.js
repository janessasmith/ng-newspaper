/* author:XCL
 * time:2016-8-13
 */

"use strict";
angular.module('trsThumbScrollModule', [])
    .directive('trsThumbScroll', function($window, $timeout) {
        return {
            restrict: "EA",
            templateUrl: "./components/util/trsThumbScroll/trsThumbScroll_tpl.html",
            scope: {
                sources: "=",
                callback: "&",
                visibleSize: "@",
                selectedItem: "="
            },
            controller: function($scope) {},
            link: function(scope, ele, attr) {
                $timeout(function() {
                    // PS:使用arr.eq(index)方法代替arr[index],因为前者返回的是一个jquery对象，可以使用jquery的方法，如css()、text()等;
                    // 而后者返回的是一个DOM原生对象，不能使用jquery的方法。
                    // 如果想要使用，可以通过angular.element(arr[index])方法将DOM原生对象封装成jquery对象。

                    var curIndex = 0;

                    //缩略图显示数目
                    var visibleSize = scope.visibleSize;
                    //缩略图可显示区域容器
                    var thumbContainer = ele.find("div.thumb-container");
                    //所有缩略图装载容器
                    var imagesContainer = ele.find("div.thumb-wrap");
                    //所有缩略图
                    var allImages = ele.find("div.thumb-wrap img");
                    //一张缩略图的宽度(allImages.eq(0).width() + 10)
                    var oneWidth = 190;
                    //缩略图可显示区域宽度
                    var visibleWidth = visibleSize * oneWidth + "px";
                    //所有缩略图的总宽度
                    var totalWidth = allImages.length * oneWidth + "px";
                    //装载容器可视容器左边的距离
                    var offsetX = imagesContainer.css('left');
                    //设置可视容器的宽度
                    thumbContainer.width(visibleWidth);
                    //设置所有缩略图装载容器的宽度
                    imagesContainer.width(totalWidth);

                    /**
                     * [prev description] 向左点击切换
                     * @return {[type]} [description]
                     */
                    scope.prev = function() {
                        curIndex--;
                        if(curIndex<0){
                            curIndex = 0;
                        }
                        var disX = -oneWidth * curIndex;
                        imagesContainer.stop().animate({left:disX});
                    };

                    /**
                     * [next description] 向右点击切换
                     * @return {Function} [description]
                     */
                    scope.next = function() {
                        curIndex++;
                        if (curIndex > allImages.length - 5) {
                            curIndex = allImages.length - 5;
                        }
                        var disX = -oneWidth * curIndex;
                        imagesContainer.stop().animate({left:disX});
                    };

                    initStatus();

                    /**
                     * [initStatus description] 初始化状态
                     * @return {[type]} [description]
                     */
                    function initStatus() {
                        scope.selectedItem = scope.sources[0];
                    }
                }, 1000);

                scope.selectSource = function(item) {
                    scope.selectedItem = item;
                    $timeout(function() {
                        scope.callback();
                    });
                };
            }
        };
    });
