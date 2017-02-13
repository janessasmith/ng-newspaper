/*
    Create by li.pengyang 2016-01-25
*/
'use strict';
angular.module("trsPrintModule", ['util.httpService'])
    .factory("trsPrintService", ["$modal", function($modal) {
        return {
            trsPrintDocument: function(params) {
                var picUrl = [];

                for (var i = 0; i < params.length; i++) {
                    if (params[i].METALOGOURL && params[i].PICSLOGO == 1) {
                        if (params[i].METALOGOURL != undefined) {
                            picUrl = params[i].METALOGOURL.PICSLOGO.split(',');
                            params[i].PICURLTEMP = picUrl;
                        }
                    }
                }
                var modalInstance = $modal.open({
                    template: "<div><trs_print></trs_print></div>",
                    windowClass: 'printCtrl',
                    backdrop: false,
                    controller: "trsPrintCtrl",
                    resolve: {
                        params: function() {
                            return params;
                        }
                    }
                });
            },
            trsIwoPrintDocument: function(params) {
                var modalInstance = $modal.open({
                    template: "<div><trs_iwo_print></trs_iwo_print></div>",
                    windowClass: 'printCtrl',
                    backdrop: false,
                    controller: "trsIwoPrintCtrl",
                    resolve: {
                        params: function() {
                            return params;
                        }
                    }
                });
            },
            trsWebPrintDocument: function(params) {
                var modalInstance = $modal.open({
                    template: "<div><trs_web_print></trs_web_print></div>",
                    windowClass: 'printCtrl',
                    backdrop: false,
                    controller: "trsWebPrintCtrl",
                    resolve: {
                        params: function() {
                            return params;
                        }
                    }
                });
            },
            trsPrintShare: function(resultArray) {
                var modalInstance = $modal.open({
                    template: "<div><trs-print-share></trs-print-share></div>",
                    windowClass: 'printCtrl',
                    backdrop: false,
                    controller: "trsPrintShareCtrl",
                    resolve: {
                        arr: function() {
                            return resultArray;
                        }
                    }
                });
            },
            trsPrintBigData: function(params) {
                var modalInstance = $modal.open({
                    template: "<div><trs-print-big-data></trs-print-big-data></div>",
                    windowClass: 'printCtrl',
                    backdrop: false,
                    controller: "trsBigDataPrintCtrl",
                    resolve: {
                        params: function() {
                            return params;
                        }
                    }
                });
            },
            trsPrintDateList: function(params) {
                var modalInstance = $modal.open({
                    template: '<div class="trsPrintDateOuter"><trs_print_date params="params"></trs_print_date></div>',
                    windowClass: 'print-date-window',
                    backdrop: false,
                    controller: "trsPrintDateCtrl",
                    resolve: {
                        params: function() {
                            return params;
                        }
                    }
                });
            }
        };
    }])
    .directive('trsPrintShare', ["$compile", "$timeout", "trsHttpService", function($compile, $timeout, trsHttpService) {
        return {
            restrict: 'E',
            templateUrl: "./components/service/print/template/printShare_tpl.html",
            link: function(scope, iElement, iAttrs) {
                // LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                //     $(iElement[0]).jqprint();
                // });
            }
        };
    }])
    .directive('trsPrintBigData', ["$compile", "trsHttpService", function($compile, trsHttpService) {
        return {
            restrict: 'E',
            templateUrl: "./components/service/print/template/printBigData_tpl.html",
            link: function(scope, iElement, iAttrs) {
                // LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                //     $(iElement[0]).jqprint();
                // });
            }
        };
    }])
    .directive('trsPrint', ["$compile", "trsHttpService", function($compile, trsHttpService) {
        return {
            restrict: 'E',
            templateUrl: "./components/service/print/template/print_tpl.html",
            link: function(scope, iElement, iAttrs) {
                // LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                //     $(iElement[0]).jqprint();
                // });
            }
        };
    }])
    .directive('trsIwoPrint', ["$compile", "trsHttpService", function($compile, trsHttpService) {
        return {
            restrict: 'E',
            templateUrl: "./components/service/print/template/iwoPrint_tpl.html",
            link: function(scope, iElement, iAttrs) {
                // LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                //     $(iElement[0]).jqprint();
                // });
            }
        };
    }])
    .directive('trsWebPrint', ["$compile", "trsHttpService", function($compile, trsHttpService) {
        return {
            restrict: 'E',
            templateUrl: "./components/service/print/template/websitePrint_tpl.html",
            link: function(scope, iElement, iAttrs) {
                // LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                //     $(iElement[0]).jqprint();
                // });
            }
        };
    }])
    .directive('trsPrintDate', ["$compile", "$timeout", "trsHttpService", function($compile, $timeout, trsHttpService) {
        return {
            restrict: "E",
            scope: {
                params: "="
            },
            templateUrl: "./components/service/print/template/printDate_tpl.html",
            link: function(scope, iElement, iAttrs) {
                LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                    var nPageHeight = 1230;
                    var trs = $(iElement).find('tr');
                    // $('.print-date-window').eq(0).find(".modal-dialog").width(window.screen.width * (925 / 1920))
                    var height = 0;
                    var beforeHTML = [
                        '<div class="trsPrintDate_container"><div class="trsPrintDate_header">',
                        '<div>' + scope.params.sourceName + '目录打印</div><div>日期：' + scope.params.date,
                        '</div><div class="clear"></div></div>',
                        '<div class="trsPrintDate_main"><table class="table">',
                        '<thead>',
                        '<th class="trsPrintDate-table-num">序号</th>',
                        '<th class="trsPrintDate-table-title">标题</th>',
                        '<th class="trsPrintDate-table-count">字数</th>',
                        '<th class="trsPrintDate-table-time">入库时间</th>',
                        '<th class="trsPrintDate-table-info">稿件信息</th>',
                        '</thead>',
                        '<tbody>'
                    ].join("");
                    var afterHTML = [
                        '</tbody></table><hr/><div style="page-break-before:always;"></div></div></div>'
                    ].join("");

                    var aHtml;
                    var index;
                    for (index = 1; index < trs.size(); index++) {
                        if (height == 0) {
                            aHtml = [beforeHTML];
                        }
                        height += trs.eq(index).height();
                        if (height >= nPageHeight) {
                            aHtml.push(afterHTML);

                            //append to document
                            var sHtml = aHtml.join("");
                            iElement.before(sHtml);
                            height = 0;
                            index--;
                            continue;
                        }

                        aHtml.push(
                            '<tr>', trs.eq(index).html(), '</tr>'
                        );
                    }

                    aHtml.push(afterHTML);
                    var sHtml = aHtml.join("");
                    iElement.before(sHtml);
                    iElement.hide();
                    iElement.parent().jqprint();
                });
            }
        };
    }])
    .controller("trsPrintCtrl", ["$scope", "$modalInstance", "$timeout", "params", "$filter",
        function($scope, $modalInstance, $timeout, params, $filter) {
            initStatus();
            // $timeout(function() {
            //     print();
            // }, 1000);
            $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                print();
            });

            function initStatus() {
                $scope.printItems = params;
                var date = new Date();
                $scope.date = $filter('date')(date, "yyyy-MM-dd HH:mm:ss").toString();
                // $scope.printItems = params[0];
                // $scope.version = params[1];
                $timeout(function() {
                    $modalInstance.close("success");
                }, 1000);
            }
            $scope.parseHang = function(doccount) {
                return Math.ceil(doccount / 27);
            };

            function print() {
                LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                    if ($scope.printItems.length > 10) {
                        for (var i = 0; i < $scope.printItems.length; i++) {
                            $('#printPage' + i).jqprint();
                        }
                    } else {
                        $('printcontainer').eq(0).jqprint();
                    }
                });
            }
        }
    ])
    .controller("trsBigDataPrintCtrl", ["$scope", "$modalInstance", "$timeout", "params", "$filter",
        function($scope, $modalInstance, $timeout, params, $filter) {
            initStatus();
            // $timeout(function() {
            //     print();
            // }, 1000);
            $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                print();
            });

            function initStatus() {
                $scope.printItems = params;
                var date = new Date();
                $scope.date = $filter('date')(date, "yyyy-MM-dd HH:mm:ss").toString();
                $timeout(function() {
                    $modalInstance.close("success");
                }, 1000);
            }
            $scope.parseHang = function(doccount) {
                return Math.ceil(doccount / 27);
            };

            function print() {
                LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                    if ($scope.printItems.content.length > 10) {
                        for (var i = 0; i < $scope.printItems.content.length; i++) {
                            $('#printPage' + i).jqprint();
                        }
                    } else {
                        $('printcontainer').eq(0).jqprint();
                    }
                });

            }
        }
    ])
    .controller("trsIwoPrintCtrl", ["$scope", "$modalInstance", "$timeout", "params", "$filter",
        function($scope, $modalInstance, $timeout, params, $filter) {
            initStatus();
            // $timeout(function() {
            //     print();
            // }, 1000);

            $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                print();
            });

            function initStatus() {
                $scope.printItems = params;
                var date = new Date();
                $scope.date = $filter('date')(date, "yyyy-MM-dd HH:mm:ss").toString();
                $timeout(function() {
                    $modalInstance.close("success");
                }, 1500);
            }
            $scope.parseHang = function(doccount) {
                return Math.ceil(doccount / 27);
            };

            function print() {
                LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                    if ($scope.printItems.length > 10) {
                        for (var i = 0; i < $scope.printItems.length; i++) {
                            $('#printPage' + i).jqprint();
                        }
                    } else {
                        $('printcontainer').eq(0).jqprint();
                    }
                });
            }
        }
    ])
    .controller("trsWebPrintCtrl", ["$scope", "$modalInstance", "$timeout", "params", "$filter",
        function($scope, $modalInstance, $timeout, params, $filter) {
            initStatus();
            // $timeout(function() {
            //     print();
            // }, 1000);
            $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                print();
            });

            function initStatus() {
                $scope.printItems = params;
                var date = new Date();
                $scope.date = $filter('date')(date, "yyyy-MM-dd HH:mm:ss").toString();
                $timeout(function() {
                    $modalInstance.close("success");
                }, 1000);
            }
            $scope.parseHang = function(doccount) {
                return Math.ceil(doccount / 27);
            };

            function print() {
                LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                    if ($scope.printItems.length > 10) {
                        for (var i = 0; i < $scope.printItems.length; i++) {
                            $('#printPage' + i).jqprint();
                        }
                    } else {
                        $('printcontainer').eq(0).jqprint();
                    }
                });
            }
        }
    ])
    .controller("trsPrintShareCtrl", ["$scope", '$q', "$modalInstance", "$timeout", "trsHttpService", "arr", "trsspliceString", "$filter",
        function($scope, $q, $modalInstance, $timeout, trsHttpService, arr, trsspliceString, $filter) {
            initStatus();
            // $timeout(function() {
            //     print();
            // }, 1000);
            $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                print();
            });

            function initStatus() {
                var date = new Date();
                $scope.date = $filter('date')(date, "yyyy-MM-dd HH:mm:ss").toString();
                $scope.resultArray = arr;
                $timeout(function() {
                    $modalInstance.close("success");
                }, 1000);
            }

            function print() {
                LazyLoad.js(["./lib/jquery-migrate/jquery-migrate.min.js", "./lib/jquery.jqprint/jquery.jqprint-0.3.js"], function() {
                    if ($scope.resultArray.length > 10) {
                        for (var i = 0; i < $scope.resultArray.length; i++) {
                            $('#printPage' + i).jqprint();
                        }
                    } else {
                        $('printcontainer').eq(0).jqprint();
                    }
                });
            }
        }
    ])
    .controller("trsPrintDateCtrl", ["$scope", "$modalInstance", "$timeout", "params",
        function($scope, $modalInstance, $timeout, params) {
            initStatus();

            function initStatus() {
                $scope.params = params;
                $timeout(function() {
                    $modalInstance.close("success");
                }, 1000);
            }

        }
    ]);
