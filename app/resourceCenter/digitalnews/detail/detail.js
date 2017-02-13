angular.module('resCenDigitalPreviewDetailModule', [])
    .controller('resCenDigitalPreviewDetailCtrl', ['$scope', '$state', '$stateParams', "$q", "$filter", "$timeout", '$interval', 'trsHttpService', 'initComDataService', 'resourceCenterService', 'leftService', 'resCtrModalService', 'trsconfirm', 'trsspliceString', 'dateFilter', 'globleParamsSet', '$window', 'storageListenerService', 'trsPrintService',
        function($scope, $state, $stateParams, $q, $filter, $timeout, $interval, trsHttpService, initComDataService, resourceCenterService, leftService, resCtrModalService, trsconfirm, trsspliceString, dateFilter, globleParamsSet, $window, storageListenerService, trsPrintService) {
            initStatus();
            initData();
            /**
             * [initStatus description]初始化状态函数开始
             * @return {[type]} [description] null
             */
            function initStatus() {
                $scope.page = {
                    CURRPAGE: '1',
                    PAGESIZE: 12,
                    ITEMCOUNT: 0,
                    PAGECOUNT: 1,
                };
                $scope.params = {
                    bc: $stateParams.bc,
                    docpubtime: unescape($stateParams.docpubtime),
                    nodeId: $stateParams.nodeid,
                    typeid: 'zyzx',
                    modelid: 'getBmDetail',
                    serviceid: $stateParams.serviceid,
                };
                $scope.status = {
                    currModule: "szb",
                    batchOperateBtn: {
                        "hoverStatus": "",
                        "clickStatus": ""
                    },
                    iwoEdit: {
                        1: "iwonews",
                        2: "iwoatlas",

                    },
                    newspaperEdit: {
                        1: "newspapertext",
                        2: "newspaperpic",

                    },
                    websiteEdit: {
                        1: "websitenews",
                        2: "websiteatlas",

                    },
                    isShowDetail: false,
                    docPubtime: $filter('date')($scope.params.docpubtime, "yyyy-MM-dd").toString(),
                    hasData: true,
                };
                $scope.data = {
                    items: [],
                    imgUrl: '',
                    space: '',
                    headers: [],
                    selectedArray: [],
                    operFlags: [],
                    detail: "",
                    currItem: '',
                    currIndex: '',
                    pdfPath: '',
                    dropDown: {
                        banciList: [],
                        selectedBanmian: {},
                    }
                };
                $scope.basicParams = {
                    channelName: $scope.status.currModule,
                    nodeId: $stateParams.nodeid
                };
                //初始化canvas
                initCanvas();
                //监听日期变化
                listenDate();
            };
            /**
             * [initStatus description]初始化请求数据函数开始
             * @return {[type]} [description] null
             */
            function initData() {
                requestData();
                initDropDown();
            };
            /**
             * [requestData description]请求数据函数开始
             * @return {[type]} [description] null
             */
            function requestData() {
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, 'post').then(function(data) {
                    $scope.data.selectedArray = [];
                    if (data.content.length < 1) {
                        $scope.status.hasData = false;
                        $scope.data.banmianName = '所选日期没有报纸';
                        return;
                    } else {
                        $scope.status.hasData = true;
                    }
                    $scope.data.items = data.content;
                    $scope.data.imgUrl = trueBanmianImg(data.content);
                    $scope.data.banmianName = data.content[0].BM;
                    $scope.data.pdfPath = data.content[0].PDPATH;
                    $scope.basicParams.indexName = data.summary_info.indexName;
                    $scope.status.isShowDetail = false;
                    $scope.data.detail = '';
                    $scope.data.currItem = "";
                    $("<img/>").attr("src", $scope.data.imgUrl).load(function() {
                        var realWidth = this.width;
                        var realHeight = this.height;
                        $("#Img_a_image").css({ 'width': realWidth, 'height': realHeight });
                        $("#Img_a_canvas").css({ 'width': realWidth, 'height': realHeight });
                        $("#Img_a").css({ 'width': realWidth, 'height': realHeight });
                        $("#Img_a_canvas").attr({ 'width': realWidth, 'height': realHeight });

                        init_area();
                    });
                    initOperFlag();
                })
            }
            /**
             * [trueBanmianImg description] 辨认出真正的版面图片
             */
            // function trueBanmianImg(list) {
            //     var picCount = 0,
            //         picObj = {};
            //     for (var i = 0; i < list.length; i++) {
            //         if (!angular.isDefined(picObj[list[i].JPPATH])) {
            //             picObj[list[i].JPPATH] = 0;
            //             picCount++;
            //         } else {
            //             picObj[list[i].JPPATH]++;
            //         }
            //     }
            //     if (picCount < 2) return list[0].JPPATH;
            //     var picUrl,
            //         lastNum;
            //     for (var j in picObj) {
            //         if (!angular.isDefined(lastNum)) {
            //             picUrl = j;
            //             lastNum = picObj[j];
            //             continue;
            //         }
            //         if (picObj[j] > lastNum) {
            //             picUrl = j;
            //             lastNum = picObj[j];
            //         }
            //     }
            //     return picUrl;
            // }
            function trueBanmianImg(list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].JPPATH) return list[i].JPPATH;
                }
            }
            /**
             * [initDropDown description] 初始化下拉框
             */
            function initDropDown() {
                //版次选择
                requestBanciDropDown(unescape($stateParams.docpubtime));
            };
            /**
             * [requestBanciDropDown description] 请求版次下拉框
             */
            function requestBanciDropDown(date) {
                var defer = $q.defer();
                var banciParams = {
                    'serviceid': $scope.params.serviceid,
                    'nodeId': $scope.basicParams.nodeId,
                    'modelid': 'findBmMenu',
                    'typeId': 'zyzx',
                    'docpubtime': date,
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), banciParams, 'post').then(function(data) {
                    if (data.result === "fail") {
                        $scope.status.hasData = false;
                        return;
                    }
                    var banciList = data.content[0],
                        index;
                    angular.forEach(banciList, function(value, key) {
                        value.name = value.BC + " --- " + value.BM;
                        if (value.BC == $stateParams.bc) index = key;
                    });
                    $scope.data.dropDown.banciList = banciList;
                    $scope.data.dropDown.selectedBanmian = banciList[index];
                    //自动将滚动条移到顶部
                    $('trs-single-select').one('click', function() {
                        $timeout(function() {
                            $('.dropdown-menu').eq(0).scrollTop(0);
                        })
                    })
                    defer.resolve(data);
                })
                return defer.promise;
            }
            /**
             * [searchWithKeyword description]条件过滤
             */
            $scope.searchWithKeyword = function(key, value) {
                if (value === $scope.params[key]) return;
                $scope.params[key] = value;
                requestData();
            };
            /**
             * [listenDate description]监听时间变化请求不同日期的报纸
             */
            function listenDate() {
                $scope.$watch('status.docPubtime', function(newValue, oldValue, scope) {
                    if (newValue != oldValue) {
                        var newDate = $filter('date')(newValue, "yyyy/MM/dd").toString() + ' 00:00:00';
                        $scope.params.docpubtime = newDate;
                        requestBanciDropDown(newDate).then(function(data) {
                            $scope.params.bc = data.content[0][0].BC;
                            requestData();
                        });

                    }
                });
            }
            /**
             * [initOperFlag description] 初始化取签见撤重
             */
            function initOperFlag() {
                var docIds = trsspliceString.spliceString($scope.data.items, "ZB_GUID", ",");
                if (docIds) {
                    var params = {
                        methodname: "queryFlag",
                        serviceid: "mlf_bigdataexchange",
                        guids: docIds
                    };
                    params = angular.extend(params, $scope.basicParams);
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        var temp = data;
                        for (var i in temp) {
                            if (angular.isDefined(data[i]) && data[i].OPERFLAG.indexOf("1") > -1) {
                                $scope.data.operFlags = $scope.data.operFlags.concat(data[i]);
                            }
                        }
                    });
                }
            }
            /**
             * [showOperFlag description] 显示取签见撤重标志
             * @param  {[type]} guid      [description]
             * @param  {[type]} flagIndex [description]
             * @return {[type]}           [description]
             */
            $scope.showOperFlag = function(guid, flagIndex) {
                var temp = queryItemBYGUID(guid);
                if (!!temp) {
                    return queryItemBYGUID(guid).OPERFLAG.substr(flagIndex, 1) == "1" ? true : false;
                } else {
                    return false;
                }
            };
            /**
             * [queryItemBYGUID description] 根据guid获取在WCM内的取签见撤重的二进制数
             * @param  {[type]} guid [description]
             * @return {[type]}      [description]
             */
            function queryItemBYGUID(guid) {
                for (var i in $scope.data.operFlags) {
                    if (guid == $scope.data.operFlags[i].GUID) {
                        return $scope.data.operFlags[i];
                    }
                }
            }
            // 取签见撤重 点击弹出

            $scope.viewBigDataInfo = function(ChnlDocId, showRepeat) {
                var infoModal = resCtrModalService.bigDataInfoModal(ChnlDocId, showRepeat);
            };
            /**
             * [selectAll description:全选]
             */
            $scope.selectAll = function() {
                $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
            };
            /**
             * [selectDoc 单选]
             * @param  {[type]} item [description：单个对象] 
             */
            $scope.selectDoc = function(item) {
                var index = $scope.data.selectedArray.indexOf(item);
                if (index < 0) {
                    $scope.data.selectedArray.push(item);
                } else {
                    $scope.data.selectedArray.splice(index, 1);
                }
            };
            /**
             * [openTakeDraftModal description]取稿
             * @return {[type]} [description]
             */
            $scope.openTakeDraftModal = function() {
                var params = {
                    serviceid: "mlf_bigdataexchange",
                    methodname: "fetch",
                    guid: $scope.status.isShowDetail ? $scope.data.currItem.ZB_GUID : trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                };
                params = angular.extend(params, $scope.basicParams);
                var isOnlyOne = $scope.data.selectedArray.length > 1 ? false : true;
                var modalInstance = resCtrModalService.fullTakeDraft(params, isOnlyOne);
                modalInstance.result.then(function() {
                    initOperFlag();
                    $scope.data.selectedArray = [];
                }, function() {
                    initOperFlag();
                    $scope.data.selectedArray = [];
                });
            };
            /**
             * [getDirectEditParams description] 组装直接编辑参数
             * @param  {[type]} data   [description]    保存成功稿件后返回的数据
             * @param  {[type]} result [description]    由弹窗返回的数据
             * @return {[type]}        [description]
             */
            function getDirectEditParams(data, result) {
                $scope.data.directiveEditParams.chnldocid = data.REPORTS[0].CHNLDOCID;
                $scope.data.directiveEditParams.metadataid = data.REPORTS[0].METADATAID;
                var params = {
                    serviceid: "mlf_paperset",
                    methodname: "findPaperById",
                    SiteId: result.siteid
                };
                var deferred = $q.defer();
                if (!!result.siteid) {
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function() {
                        $scope.data.directiveEditParams.siteid = result.siteid;
                        $scope.data.directiveEditParams.paperid = result.siteid;
                        $scope.data.directiveEditParams.channelid = result.Web;
                        $scope.data.directiveEditParams.metadata = data.REPORTS[0].METADATAID;
                        $scope.data.directiveEditParams.newspapertype = data.ISDUOJISHEN == '0' ? 2 : 1;
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            }
            /**
             * [getDirectEditRouter description]组装取稿时直接编辑的路由
             * @param  {[type]} result [description] 弹窗返回数据
             */
            function getDirectEditRouter(result) {
                if (Boolean(result.ToMy)) {
                    $scope.data.directiveEditParams.belongedType = "iwoEdit";
                    return $scope.status.iwoEdit[result.items[0].doctype];
                } else if (Boolean(result.Paper)) {
                    $scope.data.directiveEditParams.belongedType = "newspaperEdit";
                    return $scope.status.newspaperEdit[result.items[0].doctype];
                } else if (Boolean(result.Web)) {
                    $scope.data.directiveEditParams.belongedType = "websiteEdit";
                    return $scope.status.websiteEdit[result.items[0].doctype];
                }
            }

            /**
             * [CreationAxis description]加入创作轴
             */
            $scope.CreationAxis = function() {
                var params = angular.copy($scope.basicParams);
                params.guid = $scope.status.isShowDetail ? $scope.data.currItem.ZB_GUID : trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ",");
                resourceCenterService.setBigDataCreation(params).then(function(data) {
                    trsconfirm.alertType("该稿件已成功加入创作轴!", "", "success", false);
                    $scope.data.selectedArray = [];
                });
            };
            /**
             * [printbtn description]打印
             */
            $scope.printbtn = function() {
                var params = {
                    "serviceid": $scope.status.currModule,
                    "modelid": "detailData",
                    "guid": $scope.status.isShowDetail ? $scope.data.currItem.ZB_GUID : trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                    "channelName": $scope.basicParams.channelName,
                    "typeid": "zyzx",
                    "indexName": $scope.basicParams.indexName,
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                    trsPrintService.trsPrintBigData(data);
                });
            };
            // 预留
            $scope.openReserveDraftModal = function() {
                var selectedArray = $scope.status.isShowDetail ? [$scope.data.currItem] : $scope.data.selectedArray;
                var resCtrModalServiceModal = resCtrModalService.reserveDraft(selectedArray);
                resCtrModalServiceModal.result.then(function(result) {
                    delete result.items;
                    var params = {
                        serviceid: "mlf_bigdataexchange",
                        methodname: "delay",
                        guid: $scope.status.isShowDetail ? $scope.data.currItem.ZB_GUID : trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                    };
                    params = angular.extend(params, $scope.basicParams);
                    params = angular.extend(params, result);
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        trsconfirm.alertType("预留成功!", "", "success", false, function() {
                            initOperFlag();
                            $scope.data.selectedArray = [];
                        });
                    }, function() {
                        initOperFlag();
                        $scope.data.selectedArray = [];
                    });
                });
            };

            // 收藏
            $scope.collect = function() {
                var params = {
                    serviceid: "mlf_bigdataexchange",
                    methodname: "collect",
                    guid: $scope.status.isShowDetail ? $scope.data.currItem.ZB_GUID : trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                };
                params = angular.extend(params, $scope.basicParams);
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("收藏成功!", "", "success", false, "");
                });
            };
            /** 导出 */
            $scope.export = function() {
                var params = {
                    serviceid: 'mlf_exportword',
                    methodname: 'exportBigDataDocs',
                    GUIDS: $scope.status.isShowDetail ? $scope.data.currItem.ZB_GUID : trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                    CHANNELNAMES: $scope.basicParams.channelName,
                    indexName: $scope.basicParams.indexName
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
                })
            };
            /**********************************canvas开始**************************************/
            var canvascheck = document.createElement('canvas');
            var isIE = window.navigator.systemLanguage ? 1 : 0;
            var isVM = document.namespaces ? 1 : 0;
            var isJG = 0;
            var isCV = canvascheck.getContext ? 1 : 0;
            var jg = [];

            if (isVM) {
                if (document.namespaces['v'] == null) {
                    var stl = document.createStyleSheet();
                    //stl.addRule("v\\:*", "behavior: url(#default#VML); antialias: true;");

                    document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
                }
            }

            function fadeCanvas(id, opac) {
                var obj = document.getElementById(id);
                if (opac <= 100) {
                    obj.style.opacity = opac / 100;
                    opac += 10;
                    window.setTimeout(fadeCanvas(id, opac), 10);
                }
            }

            function CoordMax(coord, w, h) {
                //新宽度
                if (!w)
                    w = 300;
                //新高度
                if (!h)
                    h = 477;
                var arrays = coord.split(',');
                var cd;
                var newCoord = arrays.map(function(v, k) {
                    if ((k % 2) == 0) {
                        cd = v / 100 * w;
                    } else {
                        cd = v / 100 * h;
                    }
                    return parseInt(cd);
                }, this).toString();
                return newCoord;
            }

            function setAreaOver(obj, id, b, c, o, n, f, z) {
                var i, j, x, y, context, p = '',
                    canvas = document.getElementById(id);
                var v = obj.coords.split(",");
                if (isVM) {
                    if (obj.shape.toLowerCase() == 'rect') {
                        canvas.innerHTML = '<v:rect strokeweight="1" filled="t" stroked="' + (n < 1 ? "t" : "f") + '" strokecolor="#' + b + '" style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:' + parseInt(v[0]) + 'px;top:' + parseInt(v[1]) + 'px;width:' + parseInt(v[2] - v[0]) + 'px;height:' + parseInt(v[3] - v[1]) + 'px;"><v:fill color="#' + c + '" opacity="' + o + '" /></v:rect>';
                    } else if (obj.shape.toLowerCase() == 'circle') {
                        canvas.innerHTML = '<v:oval strokeweight="1" filled="t" stroked="' + (n < 1 ? "t" : "f") + '" strokecolor="#' + b + '" style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:' + parseInt(v[0] - v[2]) + 'px;top:' + parseInt(v[1] - v[2]) + 'px;width:' + (parseInt(v[2]) * 2) + 'px;height:' + (parseInt(v[2]) * 2) + 'px;"><v:fill color="#' + c + '" opacity="' + o + '" /></v:oval>';
                    } else {
                        for (j = 2; j < v.length; j += 2) { p += parseInt(v[j]) + ',' + parseInt(v[j + 1]) + ','; }
                        canvas.innerHTML = '<v:shape strokeweight="1" filled="t" stroked="' + (n < 1 ? "t" : "f") + '" strokecolor="#' + b + '" coordorigin="0,0" coordsize="' + canvas.width + ',' + canvas.height + '" path="m ' + parseInt(v[0]) + ',' + parseInt(v[1]) + ' l ' + p + ' x e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:' + canvas.width + 'px;height:' + canvas.height + 'px;"><v:fill color="#' + c + '" opacity="' + o + '" /></v:shape>';
                    }
                } else if (isCV) {
                    if (f < 1) { canvas.style.opacity = 0; }
                    context = canvas.getContext("2d");
                    context.beginPath();
                    context.lineWidth = "1";
                    if (obj.shape.toLowerCase() == 'rect') {
                        context.rect(0.5 + parseInt(v[0]), 0.5 + parseInt(v[1]), parseInt(v[2] - v[0]), parseInt(v[3] - v[1]));
                        context.closePath();
                    } else if (obj.shape.toLowerCase() == 'circle') {
                        context.arc(0.5 + parseInt(v[0]), 0.5 + parseInt(v[1]), parseInt(v[2]), 0, (Math.PI / 180) * 360, false);
                    } else {
                        context.moveTo(parseInt(v[0]), parseInt(v[1]));
                        for (j = 2; j < v.length; j += 2) { context.lineTo(parseInt(v[j]), parseInt(v[j + 1])); }
                        context.closePath();
                    }
                    context.fillStyle = 'rgba(' + c + ',' + o + ')';
                    context.strokeStyle = 'rgba(' + b + ',0)'; //边框线暂时为透明
                    context.fill();
                    if (n < 1) { context.stroke(); }
                    if (f < 1) {
                        fadeCanvas(id, 0);
                    }
                } else {
                    jg[z].setColor("#" + c);
                    if (obj.shape.toLowerCase() == 'rect') {
                        jg[z].fillRect(parseInt(v[0]), parseInt(v[1]), parseInt(v[2] - v[0]) + 1, parseInt(v[3] - v[1]) + 1);
                    } else if (obj.shape.toLowerCase() == 'circle') {
                        jg[z].fillEllipse(parseInt(v[0] - v[2]), parseInt(v[1] - v[2]), parseInt(v[2]) * 2 + 1, parseInt(v[2]) * 2 + 1);
                    } else {
                        x = new Array();
                        y = new Array();
                        i = 0;
                        for (j = 0; j < v.length; j += 2) {
                            x[i] = parseInt(v[j]);
                            y[i] = parseInt(v[j + 1]);
                            i++;
                        }
                        jg[z].fillPolygon(x, y);
                    }
                    jg[z].paint();
                }
            }

            function setAreaOut(obj, id, f, z) {
                var canvas = document.getElementById(id);
                if (isVM) { canvas.innerHTML = ''; } else
                if (isJG) { jg[z].clear(); } else if (isCV) {
                    var context = canvas.getContext("2d");
                    context.clearRect(0, 0, canvas.width, canvas.height);
                }
            }

            function init_area() {
                var canvans_width = $("#Img_a_canvas").attr("width");
                var canvans_height = $("#Img_a_canvas").attr("height");
                $("#js_tbody").find("a").each(function() {
                    $(this).attr("coords", CoordMax($(this).attr("coords"), canvans_width, canvans_height));
                });
                $(".forArchives").find("area").each(function() {
                    var $this = $(this);
                    $this.attr("coords", CoordMax($this.attr("coords"), canvans_width, canvans_height)); //转变坐标为map区域 坐标 
                    var $x = -70;
                    var $y = -80;
                    $this.mouseover(function(e) {
                        if ($(".mapDiv").length > 0) return;
                        var name = $(this).attr("alt");
                        var index_num = $(this).index();
                        var dom = "<div class='mapDiv'><span class='name'></span></div>";
                        $(".resouCen-digitalDetail").append(dom);
                        $(".name").text(name);
                        $(".mapDiv").css({
                            top: (e.pageY + $y) + "px",
                            left: (e.pageX + $x) + "px",
                        }).show("fast");
                    }).mouseout(function() {
                        $(".mapDiv").remove();
                    }).mousemove(function(e) {
                        $(".mapDiv").css({
                            top: (e.pageY + $y) + "px",
                            left: (e.pageX + $x) + "px"
                        });
                    });
                });
            }
            //初始化canvas
            function initCanvas() {
                $(".forArchives").delegate(".newsPaper", "mouseover mouseout", function(event) {
                    if (event.type == "mouseover") {
                        setAreaOver(this, 'Img_a_canvas', '39,84,128', '254,255,96', '0.4', 0, 0, 0);
                    } else if (event.type == "mouseout") {
                        setAreaOut(this, 'Img_a_canvas', 0, 0);
                    }
                });
            };
            /**********************************canvas结束**************************************/
            /**
             * [checkDetail description]查看稿件详情
             */
            $scope.checkDetail = function(item, index) {
                var params = {
                    'serviceid': $scope.basicParams.channelName,
                    'modelid': 'detailData',
                    'guid': item.ZB_GUID,
                    'channelName': $scope.basicParams.channelName,
                    'typeid': 'zyzx',
                    'indexName': $scope.basicParams.indexName,
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, 'post').then(function(data) {
                    $scope.data.detail = data.content[0];
                    $scope.status.isShowDetail = true;
                    $scope.data.currItem = item;
                    $scope.data.currIndex = index;
                });
            };
            /**
             * [returnToList description]返回稿件列表页
             */
            $scope.returnToList = function() {
                $scope.status.isShowDetail = false;
                $scope.data.detail = '';
            };
            /**
             * [jumpToDraft description]上一篇/下一篇
             */
            $scope.jumpToDraft = function(isNext) {
                if ((!isNext && $scope.data.currIndex == 0) || (isNext && $scope.data.currIndex == $scope.data.items.length - 1)) return;
                var index = isNext ? $scope.data.currIndex + 1 : $scope.data.currIndex - 1;
                var params = {
                    'serviceid': $scope.basicParams.channelName,
                    'modelid': 'detailData',
                    'guid': $scope.data.items[index].ZB_GUID,
                    'channelName': $scope.basicParams.channelName,
                    'typeid': 'zyzx',
                    'indexName': $scope.basicParams.indexName,
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, 'post').then(function(data) {
                    $scope.data.detail = data.content[0];
                    $scope.status.isShowDetail = true;
                    $scope.data.currItem = $scope.data.items[index];
                    $scope.data.currIndex = index;
                });
            };
            /**
             * [jumpToBanmian description]上一篇/下一篇
             */
            $scope.jumpToBanmian = function(isNext) {
                var originalIndex = $scope.data.dropDown.banciList.indexOf($scope.data.dropDown.selectedBanmian),
                    index = isNext ? originalIndex + 1 : originalIndex - 1;
                if ((!isNext && originalIndex == 0) || (isNext && originalIndex == $scope.data.dropDown.banciList.length - 1)) return;
                $scope.data.dropDown.selectedBanmian = $scope.data.dropDown.banciList[index];
                $scope.params.bc = $scope.data.dropDown.banciList[index].BC;
                requestData();
            };
            /**
             * [jumpToBanmian description]上一篇/下一篇
             */
            $scope.download = function() {
                window.open($scope.data.pdfPath);
            };
        }
    ])
