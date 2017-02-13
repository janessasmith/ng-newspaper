"use strict";
angular.module("util.waterflow", []).directive("imgflow", function($timeout) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template: "<div ng-transclude class='img-flow clearfix'></div>",
        scope: {
            rowSize: "@",
            datas: "="
        },
        link: function(scope, element, attrs, controller) {
        	// 川报修改
            $timeout(function() {
                var rowSize = Number(scope.rowSize);
                var wt = element.width() - 1 * rowSize,
                    sumWt = 0,
                    tag = false;
                scope.$watchCollection("datas", function(nV, oV) {
                    var index;
                    if (!tag) {
                        index = 0;
                        tag = true;
                    } else {
                        index = oV.length;
                    }
                    setImgBoxWidth(nV, index);
                    // $timeout(setImgBoxWidth(nV, index),1000);
                });

                function setImgBoxWidth(dataJson, index) {
                    for (var i = index; i < dataJson.length; i++) {
                        if ((i + 1) % rowSize == 0) {
                            dataJson[i].width = wt - sumWt - 10;
                            sumWt = 0;
                        } else {
                            var randomNum = random();
                            sumWt += randomNum;
                            dataJson[i].width = randomNum - 10;
                        }
                    }
                }

                function random() {
                    var per = Number(wt / rowSize);
                    var n = Math.random() * 100 + per - 50;
                    return n;
                }
            });
        }
    };
}).directive("loaded", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs, controller) {
            angular.element(element).load(function() { //在图片加载成功后，设置图片高宽
                var pEl = angular.element(this).parent().parent().eq(0);
                var pWt = pEl.width(),
                    pHt = pEl.height();

                if ((pWt * 0.1 / pHt) > (this.width * 0.1 / this.height)) {
                    angular.element(this).css({
                        width: pEl.width() + "px",
                        height: "auto"
                    });
                    if (this.height > pHt) {

                        angular.element(this).css("margin-top", -(this.height - pHt) * 1.0 / 2 + "px");
                    }
                } else {
                    angular.element(this).css({
                        width: "auto",
                        height: "180px"
                    });
                    if (this.width > pWt) {

                        angular.element(this).css("margin-left", -(this.width - pWt) * 1.0 / 2 + "px");
                    }
                }
            });
        }
    }
});
