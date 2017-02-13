/* author:XCL
 * time:2016-9-1
 * description:图片预加载
 */

"use strict";
angular.module('imgPreloadDireciveModule', [])
    .directive('imgPreload', function() {
        return {
            restrict: 'A',
            scope: {
                "preload": "="
            },
            template: '<img src="./editingCenter/newspaper/images/loading2.gif" style="max-width:500px;display:block; margin:20px auto;" data="{{preload}}" alt="">',
            link: function(scope, iElm, iAttrs, controller) {
                var loadImg = iElm.find("img");
                loadImg.load(function() {
                    var __this__ = $(this);
                    var url = __this__.attr('data');
                    var src = __this__.attr('src');
                    if (url === '' || url === src) //这里判断如果图片实际地址不存在或者已经加载不处理
                    {
                        return;
                    }
                    var img = new Image(); //实例化一个图片的对象
                    img.src = url; //将要显示的图片加载进来
                    if (img.complete) //如果图片已经加载存在浏览器缓存中直接处理
                    {
                        __this__.attr('src', url); //将要显示的图片替换过来
                        return;
                    }
                    img.onload = function() { //要显示的图片加载完成后做处理
                        __this__.attr('src', url);
                    };
                });
            }
        };
    });
