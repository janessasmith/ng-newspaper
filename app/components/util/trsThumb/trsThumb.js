"use strict";

angular.module('util.trsthumb', []).directive('trsThumbContainer', [function() {
    return {
        restrict: 'EA',
        scope: {

        },
        controller: ['$scope', function($scope) {

            var ctrl = this;

            ctrl.setSelectedThumb = function(thumb) {
                $scope.selectedThumb = thumb;
            };

            ctrl.getSelectedThumb = function() {
                return $scope.selectedThumb;
            };

        }]
    };
}])


.directive('trsThumb', ['$sce', '$timeout', 'thumbTransform',

        function($sce, $timeout, thumbTransform) {

            return {
                restrict: 'EA',
                require: '^trsThumbContainer',
                templateUrl: './components/util/trsThumb/trsThumb.tpl.html',
                scope: {
                    item: "=",
                    delay: "="
                },

                link: function($scope, $element, $attrs, $ctrl) {
                    angular.isDefined($scope.delay) ? $timeout(function() {
                        makeThumb();
                    }, 1000) : makeThumb();

                    function makeThumb() {

                        var transformType = $attrs.transform;
                        var transform = thumbTransform.get(transformType);
                        $scope.thumb = transform($scope.item);

                        $scope.$watch('item.ALLIMG', function() {
                            $scope.thumb = transform($scope.item);
                        });

                        //解决图集稿图片编辑和替换的问题
                        $scope.$watch('item.PERPICURL', function() {
                            $scope.thumb = transform($scope.item);
                        });

                        if (!$scope.thumb || !$scope.thumb.type) {
                            return false;
                        }

                        $scope.isSelected = function() {
                            return $ctrl.getSelectedThumb() == $scope.thumb;
                        };

                        $scope.toggleStatus = function() {
                            $scope.showimgFocus = true;
                            $ctrl.setSelectedThumb($scope.thumb);

                            $timeout(function() {
                                var $bigThumb = $element.find('.bigPreview');
                                var bounding = $bigThumb[0].getBoundingClientRect();
                                var topOffset = Math.max(bounding.top + $bigThumb.height() - $(window).height(), 0);
                                if (topOffset > 0) {
                                    topOffset += 30;
                                }

                                var originalTop = parseInt($bigThumb.css('top'), 10);
                                $bigThumb.css({
                                    top: (originalTop - topOffset) + 'px'
                                });
                            });
                        };
                    }

                    $scope.close = function(force) {
                        $scope.showimgFocus = false;
                    };
                }
            };
        }
    ])
    .directive('autofitsize', [function() {
        return {
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                var target = $element.closest($attrs.autofitsize);
                var dstW = target.width();
                var dstH = target.height();
                var dstRate = dstW / dstH;

                $element.load(function() {
                    var img = new Image();
                    img.src = $element.attr("src");
                    var imgW = img.width;
                    var imgH = img.height;
                    var imgRate = imgW / imgH;

                    if (img.width < dstW && img.height < dstH) {
                        $element.css({
                            marginLeft: (dstW - imgW) / 2 + 'px',
                            marginRight: (dstW - imgW) / 2 + 'px',
                            marginTop: (dstH - imgH) / 2 + 'px',
                            marginBottom: (dstH - imgH) / 2 + 'px',
                            width: 'auto',
                            height: 'auto'
                        });
                        return;
                    }

                    if (dstRate > imgRate) { //比較高
                        $element.css({
                            marginLeft: (dstW - imgRate * dstH) / 2 + 'px',
                            marginRight: (dstW - imgRate * dstH) / 2 + 'px',
                            width: 'auto',
                            height: dstH + 'px'
                        });
                    } else {
                        $element.css({
                            marginTop: (dstH - dstW / imgRate) / 2 + 'px',
                            marginBottom: (dstH - dstW / imgRate) / 2 + 'px',
                            width: dstW + 'px',
                            height: 'auto'
                        });
                    }
                });
            }
        };
    }])



/**
 * {
        type: 'video',
        imgUrl: '',//小的缩略图
        videoUrl : ''
    };
 * {
        type: 'audio',
        imgUrl: '',//小的缩略图
        audioUrl : ''
    };  
 * {
        type: 'image',
        imgUrl: '',//小的缩略图
        data: [{//多张图片
                url: ''
            }
        ]
    };  
 */



.factory('thumbTransform', function() {
    var cache = {};
    return {

        register: function(type, transform) {
            cache[type] = transform;
        },

        get: function(type) {
            return cache[type];
        }
    }
})

.run(['$sce', 'thumbTransform', function($sce, thumbTransform) {
    thumbTransform.register('editingCenterThumb', function(input) {

        var item;

        if (input.METALOGOURL && input.METALOGOURL.VIDEOLOGO) {
            item = {
                type: 'video',
                imgUrl: input.METALOGOURL.VIDEOLOGO2,
                videoUrl: $sce.trustAsResourceUrl(input.METALOGOURL.VIDEOLOGO)
            };
        } else if (input.METALOGOURL && input.METALOGOURL.AUDIOLOGO) {
            item = {
                type: 'audio',
                imgUrl: input.METALOGOURL.AUDIOLOGO2,
                audioUrl: $sce.trustAsResourceUrl(input.METALOGOURL.AUDIOLOGO)
            };
        } else if (input.METALOGOURL && input.METALOGOURL.PICSLOGO) {
            item = {
                type: 'image',
                imgUrl: input.METALOGOURL.PICSLOGO2,
                data: [{
                    url: input.METALOGOURL.PICSLOGO
                }]
            };
        } else if (input.PERPICURL) {
            item = {
                type: 'image',
                imgUrl: input.PERPICURL,
                data: [{
                    url: input.PERPICURL
                }]
            };
        }

        return item;
    });
}])
.run(['$sce', 'thumbTransform', function($sce, thumbTransform) {
        thumbTransform.register('editingCenterAllThumb', function(input) {

            var item;
            var list = input.ALLIMG;
            if (input.METALOGOURL && input.METALOGOURL.VIDEOLOGO) {
                item = {
                    type: 'video',
                    imgUrl: input.METALOGOURL.VIDEOLOGO2,
                    videoUrl: $sce.trustAsResourceUrl(input.METALOGOURL.VIDEOLOGO)
                };
            } else if (input.METALOGOURL && input.METALOGOURL.AUDIOLOGO) {
                item = {
                    type: 'audio',
                    imgUrl: input.METALOGOURL.AUDIOLOGO2,
                    audioUrl: $sce.trustAsResourceUrl(input.METALOGOURL.AUDIOLOGO)
                };
            } else if (input.METALOGOURL && input.METALOGOURL.PICSLOGO) {
                item = {
                    type: 'image',
                    imgUrl: input.METALOGOURL.PICSLOGO2,
                    data: []
                };

                if (list && list.length > 0) {
                    angular.forEach(list, function(value, key) {
                        item.data.push({
                            url: value.PICSLOGO
                        })
                    });
                } else {
                    item.data = [{
                        url: input.METALOGOURL.PICSLOGO
                    }];
                }
            } else if (input.PERPICURL) {
                item = {
                    type: 'image',
                    imgUrl: input.PERPICURL,
                    data: [{
                        url: input.PERPICURL,
                    }]
                };
            }

            return item;
        });
    }])
.run(['thumbTransform', function(thumbTransform) {
    thumbTransform.register('resourceCenterThumb', function(input) {
        var item = {};
        var list = input.imgurl;
        item.type = list ? 'image' : ''
        item.data = [];

        if (angular.isArray(list)) {
            angular.forEach(list, function(value, key) {
                item.data.push({
                    url: value.urlM
                });
            });
        } else if (angular.isObject(list) && !angular.isArray(list)) {
            for (var name in list) {
                var imgs = list[name] && list[name].split(",");
                angular.forEach(imgs, function(value, key) {
                    if (value.urlM) {
                        arr.push({
                            url: value.urlM
                        });
                    }
                });
            }
        }

        item.imgUrl = (item.data[0] || {}).url || "";
        return item;
    })
}]);
