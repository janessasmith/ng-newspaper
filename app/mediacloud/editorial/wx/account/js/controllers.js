define(function(require) {
    var app = require('app');
    require('jquery.form');

    app.controller('unitCtrl', ['$scope', 'utilUnit',
        function($scope, utilUnit) {
            var promise = utilUnit.queryUnit();;
            promise.then(function(data) {
                $scope.units = data.result;
            }, function(data) {
                console.log(data);
            })
        }
    ])

    /**
     * 分类控制器
     * @param  {[type]} $scope     [description]
     * @param  {[type]} commonReq) {	$scope.organizations [description]
     * @return {[type]}            [description]
     */
    app.controller('classCtrl', function($scope, trshttpServer, utilClass, $log) {
        var classList = utilClass.queryClass();
        classList.then(function(data) {
            $scope.classs = data.result;
        }, function(data) {
            console.log(data);
        })
    });
    /**
     * 账号列表查询
     */
    app.controller('listCtrl', ['$rootScope', '$scope', '$stateParams', 'trshttpServer', '$log',
        function($rootScope, $scope, $stateParams, trshttpServer, $log) {

            $rootScope.UnitId = $stateParams.UnitId;
            $rootScope.ClassId = $stateParams.ClassId;
            $scope.Search = $stateParams.Search;
            //组装参数
            var parameters = {};
            if ($rootScope.UnitId) {
                parameters.UnitId = $rootScope.UnitId;
            }
            if ($rootScope.ClassId) {
                parameters.ClassId = $rootScope.ClassId;
            }
            if ($scope.Search) {
                parameters.Search = $scope.Search;
            }

            var options = {};
            options.method = 'get';

            //请求HTTP
            var promise = trshttpServer.
            httpServer('/wcm/rbcenter.do?serviceid=wcm61_wxaccount&methodName=queryAdminAccount', options, parameters);
            promise.then(function(data) {
                $scope.accounts = data.result;
            }, function(data) {
                $log.error(data);
            })

            $scope.gohome = function() {
                window.location.href = '/wcm/app/wx/acount.html';
            }
        }
    ]);

    /**
     * 账号删除
     */
    app.controller('delCtrl', function($scope, $uibModal, $log) {

        $scope.animationsEnabled = true;

        $scope.open = function(size, $event, channelId) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'editorial/wx/account/tpls/AccountDel.html',
                controller: 'delCtrlInstance',
                size: size,
                resolve: {
                    channelId: function() {
                        return channelId;
                    }
                }
            });

            $event.stopPropagation();
        };

        $scope.toggleAnimation = function() {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    });

    //实例化删除页面
    app.controller('delCtrlInstance',
        function($scope, $state, $modalInstance, $log, trshttpServer, channelId) {

            $scope.ok = function() {
                var options = {};
                options.method = 'get';
                //调用删除账号服务
                var promise = trshttpServer.httpServer('/wcm/rbcenter.do', options, {
                    serviceid: "wcm61_wxaccount",
                    methodName: "removeAccount",
                    wxChannelId: channelId
                });
                promise.then(function(data) {
                    console.log(data);
                    $scope.accounts = data.result;
                    $state.go("wxaccount.list", null, {
                        reload: true
                    });
                }, function(data) {
                    console.log(data);
                })
                $modalInstance.close();
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        });

    /**
     * 账号编辑
     * @param  {[type]} $rootScope    [description]
     * @param  {[type]} $scope        [description]
     * @param  {[type]} $uibModal     [description]
     * @param  {[type]} trshttpServer [description]
     * @param  {[type]} $log)         {		$scope.animationsEnabled [description]
     * @return {[type]}               [description]
     */
    app.controller('editCtrl', function($rootScope, $parse, $scope, $uibModal, trshttpServer, $log) {

            $scope.animationsEnabled = true;
            $rootScope.editCtrl = true;
            //2.1 调用open打开弹出窗
            $scope.open = function(size, $event, channelId) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'editorial/wx/account/tpls/AccountEdit.html',
                    controller: 'editCtrlInstance',
                    size: size,
                    resolve: {
                        channelId: function() {
                            return channelId;
                        }
                    }
                });
            };

            $scope.toggleAnimation = function() {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        //实例化页面
    app.controller('editCtrlInstance',
        function($rootScope, $scope, $state, $modalInstance, trshttpServer, utilUnit, utilClass, channelId) {
            var options = {};
            options.method = 'get';
            //下拉列表类型
            var promise = trshttpServer.httpServer('editorial/wx/account/data/Type.json', options);
            promise.then(function(data) {
                $scope.Types = data.result;
            }, function(data) {
                $log.error(data);
            })

            //下拉列表单位
            var promise = utilUnit.queryUnit();
            promise.then(function(data) {
                $scope.Units = data.result;
            }, function(data) {
                $log.error(data);
            })

            //下拉列表类别
            var promise = utilClass.queryClass();
            promise.then(function(data) {
                $scope.Classs = data.result;
            }, function(data) {
                $log.error(data);
            })

            //查询账号信息
            var promise = trshttpServer.httpServer('/wcm/rbcenter.do?serviceid=wcm61_wxaccount&methodName=queryAccountFindById', options, {
                wxChannelId: channelId
            });
            promise.then(function(data) {
                $scope.account = data.result[0];
                //获取默认类型
                for (var i = 0; i < $scope.Types.length; i++) {
                    var Type = $scope.Types[i];
                    if ($scope.account.wxType == Type.typeId) {
                        $scope.Type = $scope.Types[i];
                    }
                }

                //获取默认单位
                for (var i = 0; i < $scope.Units.length; i++) {
                    var Unit = $scope.Units[i];
                    if ($scope.account.unitId == Unit.UnitId) {
                        $scope.Unit = $scope.Units[i];
                    }
                }
                //获取默认分类
                for (var i = 0; i < $scope.Classs.length; i++) {
                    var Class = $scope.Classs[i];
                    if ($scope.account.classId == Class.ClassId) {
                        $scope.Class = $scope.Classs[i];
                    }
                }
            }, function() {

            })

            var vm = $scope.vm = {
                htmlSource: "",
                showErrorType: 1,
                showDynamicElement: true
            };

            vm.ok = function() {
                $scope.imgName;
                $scope.account1 = {
                    wxChannelId: $scope.account.channelId,
                    ObjectId: $scope.account.id,
                    name: $scope.account.name,
                    wxid: $scope.account.wxid,
                    AppId: $scope.account.appId,
                    AppSecret: $scope.account.appSecret,
                    wxheadImg: $("#output").val() || $scope.account.wxHeadImg,
                    wxType: $scope.Type.typeId,
                    // UnitId: $scope.Unit.UnitId,
                    // ClassId: $scope.Class.ClassId
                }

                //2.1 请求HTTP
                var promise = trshttpServer.
                httpServer('/wcm/rbcenter.do?serviceid=wcm61_wxaccount&methodName=updateAccount', options, $scope.account1);
                promise.then(function(data) {
                    $state.go('wxaccount.list', null, {
                        reload: true
                    });
                }, function(data) {
                    console.error(data);
                })
                $modalInstance.close();

            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        });

    /*
     新增账号
     */
    app.controller('addCtrl', function($scope, $uibModal, $log) {

        //2 调用弹出组件
        $scope.animationsEnabled = true;
        //2.1 调用open打开弹出窗
        $scope.open = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'editorial/wx/account/tpls/AccountAdd.html',
                controller: 'addCtrlInstance',
                size: size
            });
        };

        $scope.toggleAnimation = function() {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    })

    //实例化页面
    app.controller('addCtrlInstance', function($rootScope, $scope, $state, utilUnit, utilClass, $modalInstance, trshttpServer) {
        //初始化验证框架
        var vm = $scope.vm = {
            htmlSource: "",
            showErrorType: 1,
            showDynamicElement: true
        };

        var options = {};
        options.method = 'get';

        //下拉列表类型
        var promise = trshttpServer.httpServer('editorial/wx/account/data/Type.json', options);

        promise.then(function(data) {
            $scope.Types = data.result;
            $scope.Type = data.result[0];
        }, function(data) {
            $log.error(data);
        })

        //下拉列表单位
        var promise = utilUnit.queryUnit();
        promise.then(function(data) {
            $scope.Units = data.result;
            for (var i = 0; i < data.result.length; i++) {
                var unit = data.result[i];
                if (unit.UnitId == $rootScope.UnitId) {
                    $scope.Unit = data.result[i];
                    return;
                }
            }
        }, function(data) {
            $log.error(data);
        })

        //下拉列表类别
        var promise = utilClass.queryClass();
        promise.then(function(data) {
            $scope.Classs = data.result;
            for (var i = 0; i < data.result.length; i++) {
                var Class = data.result[i];
                if (Class.ClassId == $rootScope.ClassId) {
                    $scope.Class = data.result[i];
                    return;
                }
            }
        }, function(data) {
            console.log(data);
        })

        //初始化账号对象
        $scope.account = {
            name: "",
            wxid: "",
            AppId: "",
            AppSecret: "",
            description: "",
            wxheadImg: "",
            UnitId: "",
            ClassId: "",
            wxType: ""
        }

        //保存账号信息
        vm.ok = function() {
            var options = {};
            options.method = 'get';
            //组装参数
            $scope.account.wxType = $scope.Type.typeId;
            // $scope.account.UnitId = $scope.Unit.UnitId;
            // $scope.account.ClassId = $scope.Class.ClassId;
            $scope.account.wxheadImg = $("#output").val();
            //2.1 请求HTTP
            var promise = trshttpServer.httpServer('/wcm/rbcenter.do?serviceid=wcm61_wxaccount&methodName=bindAccount',
                options, $scope.account);
            promise.then(function(data) {
                $state.go("wxaccount.list", null, {
                    reload: true
                });
            }, function(data) {
                console.log("error:" + data);
            })

            $modalInstance.close();
        };

        //关闭窗口
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
});
