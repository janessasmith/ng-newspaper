/**
 * create by xiao.wenhao 2016.12.5
 */
angular.module('util.trsDownloadOriginalPicModule', [])
    .directive('trsDownloadOriginalPic', function() {
        return {
            restrict: 'A',
            scope: {
                originPic: '='
            },
            compile: function(iElm, iAttrs, transclude){
                var btn = angular.element('<a class="btn btn-sm btn-default">下载原图</a>');
                iElm.parent('div').css({
                    position: "relative"
                });

                iElm.parent('div').append(btn);
                iElm.siblings('a').css({
                    position: 'absolute',
                    bottom: '10px',
                    right: '50%',
                    marginRight: '-35px',
                    display: 'none'
                });
                return function(scope, iElm, iAttrs, controller) {
                    iElm.on('mouseenter', function(event) {
                        iElm.siblings('a').css('display', 'block');
                    }).on('mouseleave',function(event){
                        var timer = setTimeout(function(){
                            iElm.siblings('a').css('display', 'none');
                        },2000);
                        iElm.siblings('a').on('mouseenter',function(event){
                            clearTimeout(timer);
                            iElm.siblings('a').css('display', 'block');
                        }).on('mouseleave',function(event){
                            iElm.siblings('a').css('display', 'none');
                        });
                    });

                    iElm.siblings('a').attr({
                        href: scope.originPic.SRCPICURL,
                        download: scope.originPic.APPFILE
                    });
                }
            }
        };
    });