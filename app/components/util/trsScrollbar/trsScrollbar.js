(function() {
    "use strict";
    /**
     * trsScrollbar Module
     *
     * Description
     */
    angular.module('trsScrollbar', []).directive('trsScrollbarNavi', ['$window', '$parse', '$timeout', function($window, $parse, $timeout) {

        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                scope.$on('recaculatewidth', function() {
                    $timeout(function() {
                        var uiWidth = 1;
                        $(iElement).find("li").each(function() {
                            var liWidth = $(this).context.offsetWidth;
                            uiWidth += liWidth;
                        });
                        LazyLoad.css("./lib/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css");
                        $(iElement).find('ul').each(function() {
                            $(this).css('width', uiWidth + "px");
                        });
                        iElement.css({
                            /*width: "277px",*/
                            /* maxHeight:"550px"*/
                        });
                        require(['mCustomScrollbar'], function() {
                            $(iElement).mCustomScrollbar("destroy");
                            $(iElement).mCustomScrollbar({
                                theme: "minimal-dark",
                                axis: "yx",
                                setWidth: uiWidth,
                                scrollInertia: 550,
                                scrollButtons: {
                                    enable: true
                                }
                            });

                        });
                    }, 100);
                });
            }
        };
    }]).directive('onFinishRender', [function() {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                if (scope.$last === true) {
                    scope.$emit('recaculatewidth', true);
                }

            }
        };
    }]);
}());
