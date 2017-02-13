"use strict";

/**
 * @author huxiejin
 * @description 将一个元素转换成浮层，可以在页面滚动时，浮动在指定位置。
 * @attribute enable-fix（可选）:如果指定，表示该元素启动浮层处理，否则浮层特性默认不启动。
 * @attribute fix-top（可选）:表示该元素在浮动时，距离窗口顶部的距离，在顶部有其他元素，
 * 同时又不想该浮层紧挨窗口顶部时非常有效，默认值为0。
 * @attribute fix-box-element(可选)：当前浮层的高度的计算元素，考虑到有些元素的高度为0，
 * 而子元素却有高度，如果单纯使用容器元素，将使高度计算不正确
 * @attribute fix-relative-element（可选）:指定浮动过程中，需要定位的元素，
 * 当该元素滚出屏幕时，当前元素跟着一起滚出屏幕
 */
angular.module('util.trsScrollFixModule', [])


.directive('trsScrollFix', ["$timeout", function($timeout) {

    return {
        restrict: 'EA',
        link: function($scope, $element, $attrs) {

            //if (!$attrs['enableFix']) return;

            var fixTop = parseInt($attrs['fixTop'] || 0, 10);

            var fixIncWidth = parseInt($attrs['fixIncWidth'] || 0, 10);

            $(document).bind('scroll', scrollHandler);

            $scope.$on('$destroy', function() {
                $(document).unbind('scroll', scrollHandler);
            });


            /**
             * 滚动过程中，将absolute和fixed进行转换
             */
            function scrollHandler() {
                initPosition();

                initFixRelativeElement();

                //获取相对元素的坐标，与相对元素进行位置比较
                if (fixRelativeElement && fixRelativeElement.size() > 0) {
                    var fixBounding = fixRelativeElement[0].getBoundingClientRect();
                    if (fixBounding.top < 0) {

                        var visibleHeight = fixRelativeElement.height() + fixBounding.top;

                        initFixBoxElement();
                        var elementHeight = fixBoxElement.height();

                        //相对元素可见区域搞定即将与当前元素高度相等
                        if (visibleHeight <= elementHeight) {
                            $element.css({
                                position: 'fixed',
                                left: initialBounds.left,
                                top: -(elementHeight - visibleHeight) + 'px',
                                margin: 'auto',
                                width: (initialBounds.right - initialBounds.left + fixIncWidth) + 'px',
                                height: (initialBounds.bottom - initialBounds.top) + 'px'
                            });
                            $element.addClass('scroll-fix-active');
                            return;
                        }
                    }
                }

                var scrollTop = document.body.scrollTop - fixTop;

                if (scrollTop >= initialBounds.top) {
                    $element.css({
                        position: 'fixed',
                        left: initialBounds.left,
                        top: fixTop + 'px',
                        margin: 'auto',
                        width: (initialBounds.right - initialBounds.left + fixIncWidth) + 'px',
                        height: (initialBounds.bottom - initialBounds.top) + 'px'
                    });
                    $element.addClass('scroll-fix-active');
                } else {
                    $element.css(initialPositionStyle);
                    $element.removeClass('scroll-fix-active');
                }
            }

            //滚动前距离窗口顶部的位置
            var initialBounds = null;

            //滚动前当前元素的定位
            var initialPositionStyle = null;

            function initPosition() {
                if (!initialPositionStyle) {
                    initialPositionStyle = {
                        position: $element.css('position'),
                        left: $element.css('left'),
                        top: $element.css('top'),
                        width: $element.css('width'),
                        height: $element.css('height'),
                        marginLeft: $element.css('marginLeft'),
                        marginRight: $element.css('marginRight'),
                        marginTop: $element.css('marginTop'),
                        marginBottom: $element.css('marginBottom')
                    };
                }

                if (!initialBounds || (initialBounds.top == initialBounds.bottom)) {
                    var scrollTop = document.body.scrollTop;
                    var scrollLeft = document.body.scrollLeft;

                    initialBounds = $element[0].getBoundingClientRect();
                    initialBounds = {
                        top: initialBounds.top + scrollTop,
                        right: initialBounds.right + scrollLeft,
                        bottom: initialBounds.bottom + scrollTop,
                        left: initialBounds.left - document.documentElement.clientLeft + scrollLeft
                    };
                }
            }

            //初始化固定过程中，需要顶部切片的参考元素
            var fixRelativeElement;

            function initFixRelativeElement() {
                if (fixRelativeElement && fixRelativeElement.length !== 0) {
                    return;
                }

                if (!$attrs['fixRelativeElement']) {
                    return;
                }

                fixRelativeElement = $attrs['fixRelativeElement'];
                fixRelativeElement = $(fixRelativeElement);
            }

            //初始化移动过程中，当前浮动元素的高度计算标准
            var fixBoxElement;

            function initFixBoxElement() {
                if (fixBoxElement) {
                    return;
                }

                if ($attrs['fixBoxElement']) {
                    fixBoxElement = $($attrs['fixBoxElement']);
                }

                fixBoxElement = fixBoxElement || $element;
            }

        }
    };
}]).directive("trsScrollFixForModal", ["$timeout",function($timeout) {

    return {
        restrict: 'EA',
        link: function($scope, $element, $attrs) {

            //if (!$attrs['enableFix']) return;

            var fixTop = parseInt($attrs['fixTop'] || 0, 10);

            var fixIncWidth = parseInt($attrs['fixIncWidth'] || 0, 10);

            $(".modal").bind('scroll', scrollHandler);

            $scope.$on('$destroy', function() {
                $(".modal").unbind('scroll', scrollHandler);
            });


            /**
             * 滚动过程中，将absolute和fixed进行转换
             */
            function scrollHandler() {
                initPosition();

                initFixRelativeElement();

                //获取相对元素的坐标，与相对元素进行位置比较
                if (fixRelativeElement && fixRelativeElement.size() > 0) {
                    var fixBounding = fixRelativeElement[0].getBoundingClientRect();
                    if (fixBounding.top < 0) {

                        var visibleHeight = fixRelativeElement.height() + fixBounding.top;

                        initFixBoxElement();
                        var elementHeight = fixBoxElement.height();

                        //相对元素可见区域搞定即将与当前元素高度相等
                        if (visibleHeight <= elementHeight) {
                            $element.css({
                                position: 'fixed',
                                left: initialBounds.left,
                                top: -(elementHeight - visibleHeight) + 'px',
                                margin: 'auto',
                                width: (initialBounds.right - initialBounds.left + fixIncWidth) + 'px',
                                height: (initialBounds.bottom - initialBounds.top) + 'px'
                            });
                            $element.addClass('scroll-fix-active');
                            return;
                        }
                    }
                }

                var scrollTop = $(".modal")[0].scrollTop - fixTop;

                if (scrollTop >= initialBounds.top) {
                    $element.css({
                        position: 'fixed',
                        left: initialBounds.left,
                        top: scrollTop - 30 + 'px',
                        margin: 'auto',
                        height: (initialBounds.bottom - initialBounds.top) + 'px'
                    });
                    $element.addClass('scroll-fix-active');
                } else {
                    $element.css(initialPositionStyle);
                    $element.removeClass('scroll-fix-active');
                }
            }

            //滚动前距离窗口顶部的位置
            var initialBounds = null;

            //滚动前当前元素的定位
            var initialPositionStyle = null;

            function initPosition() {
                if (!initialPositionStyle) {
                    initialPositionStyle = {
                        position: $element.css('position'),
                        left: $element.css('left'),
                        top: $element.css('top'),
                        width: $element.css('width'),
                        height: $element.css('height'),
                        marginLeft: $element.css('marginLeft'),
                        marginRight: $element.css('marginRight'),
                        marginTop: $element.css('marginTop'),
                        marginBottom: $element.css('marginBottom')
                    };
                }

                if (!initialBounds || (initialBounds.top == initialBounds.bottom)) {
                    var scrollTop = $(".modal")[0].scrollTop;
                    var scrollLeft = $(".modal")[0].scrollLeft;

                    initialBounds = $element[0].getBoundingClientRect();
                    initialBounds = {
                        top: initialBounds.top + scrollTop,
                        right: initialBounds.right + scrollLeft,
                        bottom: initialBounds.bottom + scrollTop,
                        left: 0
                    };
                }
            }

            //初始化固定过程中，需要顶部切片的参考元素
            var fixRelativeElement;

            function initFixRelativeElement() {
                if (fixRelativeElement && fixRelativeElement.length !== 0) {
                    return;
                }

                if (!$attrs['fixRelativeElement']) {
                    return;
                }

                fixRelativeElement = $attrs['fixRelativeElement'];
                fixRelativeElement = $(fixRelativeElement);
            }

            //初始化移动过程中，当前浮动元素的高度计算标准
            var fixBoxElement;

            function initFixBoxElement() {
                if (fixBoxElement) {
                    return;
                }

                if ($attrs['fixBoxElement']) {
                    fixBoxElement = $($attrs['fixBoxElement']);
                }

                fixBoxElement = fixBoxElement || $element;
            }

        }
    };
}]);
