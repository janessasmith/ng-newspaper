var app = angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'w5c.validator',
    'ngLocale',
    'command.ser',
    'command.dir',
    'home.ctrl',
    'myinstruct.ctrl',
    'report.ctrl',
    'treeControl',
    'setup.ctrl'
]);

app.run(['$state','$stateParams', '$rootScope', 'messageSer', function($state,$stateParams, $rootScope, messageSer) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;   

    // var stateChangeSuccess = $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);  

    // function stateChangeSuccess($rootScope) {
    //    $templateCache.removeAll();    
    // }  
}]);

app.config(['$stateProvider', '$urlRouterProvider', 'w5cValidatorProvider','$httpProvider', function($stateProvider, $urlRouterProvider, w5cValidatorProvider,$httpProvider) {

	//IE不缓存XHR请求
	$httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['formdata'] = '1';

    $httpProvider.defaults.transformRequest = function(data){
        if (typeof(data)=="undefined") {
            return;
        }else {
             return jQuery.param(data);
        }
        
    }
	//配置表单验证信息
    w5cValidatorProvider.config({
        blurTrig: true,
        showError: true,
        removeError: true
    });

    w5cValidatorProvider.setRules({
        heading: {
            required: "标题不能为空"
        },
        userIds: {
            required: "接收人不能为空"
        },
        detail:{
            required:"联合报道描述不能为空"
        },
        content:{
            required:"指令内容不能为空"
        },
        groupname:{
            required:"名称不能为空"
        }
    });

    $urlRouterProvider.otherwise('/command/myinstructBacklog/list?type=0');
    $stateProvider
        .state('command', {
            url: "/command",
            templateUrl: "home/tpls/navigation.html",
            abstract: true
        })
    //地图
    $stateProvider
        .state('command.map', {
            url: "/map",
            templateUrl: "home/tpls/map.html"
        })
    //创建指令
    $stateProvider
        .state('command.createDir', {
            url: "/createDir",
            templateUrl: "home/tpls/createDir.html"
        })
    //发布任务
    $stateProvider
        .state('command.pubTask', {
            url: "/pubTask?corpsId",
            templateUrl: "home/tpls/pubTask.html"
        })
    //创建联合报道
    $stateProvider
        .state('command.createReport', {
            url: "/createReport",
            templateUrl: "home/tpls/createReport.html"
        })
    //我的待办backlogCtrl
    $stateProvider
        .state('command.myinstructBacklog', {
            url: "/myinstructBacklog",
            templateUrl: "myinstruct/tpls/backlog.html",
            abstract: true
        })
    $stateProvider
        .state('command.myinstructBacklog.list', {
            url: "/list?type&title&t",
            templateUrl: "myinstruct/tpls/backlog_list.html",
            controller: 'backlogCtrl'
        })
    //待办指令查看
    $stateProvider
        .state('command.myinstructBlacklog_details', {
            url: "/blacklog_details?dictateId&issecret",
            templateUrl: "myinstruct/tpls/blacklog_details.html"
        })
        //待办联合报道任务查看
    $stateProvider
        .state('command.reportBlacklog_details', {
            url: "/reportBlacklog_details?dictateId&issecret",
            templateUrl: "report/tpls/upcoming_command.html"
        })
        //待办指令转发
    $stateProvider
        .state('command.myinstructBlacklog_forward', {
            url: "/blacklog_forward?dictateId",
            templateUrl: "myinstruct/tpls/blacklog_forward.html"
        })
        //已结束
    $stateProvider
        .state('command.myinstructFinish', {
            url: "/myinstructFinish",
            templateUrl: "myinstruct/tpls/finish.html",
            abstract: true
        })
        //列表   
    $stateProvider
        .state('command.myinstructFinish.list', {
            url: "/list?type&title&t",
            templateUrl: "myinstruct/tpls/finish_list.html",
            controller: "finishCtrl"
        })
        //查阅指令(已结束)commandShowCtrl
    $stateProvider
        .state('command.myinstructCommandShow', {
            url: "/myinstructCommandShow?DICTATEID&issecret",
            templateUrl: "myinstruct/tpls/finish_command.html"
        })
    //联合报道查阅任务(已结束)commandShowCtrl
    $stateProvider
        .state('command.reportCommandShow', {
            url: "/reportCommandShow?DICTATEID&issecret",
            templateUrl: "report/tpls/over_command.html"
        })
        //我的发起myLaunchCtrl
    $stateProvider
        .state('command.myinstructMyLaunch', {
            url: "/myinstructMyLaunch",
            templateUrl: "myinstruct/tpls/myLaunch.html",
            abstract: true
        })
    $stateProvider
        .state('command.myinstructMyLaunch.list', {
            url: "/list?type",
            templateUrl: "myinstruct/tpls/myLaunch_list.html"
        })
        //查阅指令launchCommandShowCtrl
    $stateProvider
        .state('command.myinstructLaunchCommandShow', {
            url: "/myinstructLaunchCommandShow?DICTATEID&issecret",
            templateUrl: "myinstruct/tpls/myLaunch_command.html"
        })
        //联合报道查阅指令launchCommandShowCtrl
    $stateProvider
        .state('command.reportLaunchCommandShow', {
            url: "/reportLaunchCommandShow?DICTATEID&issecret",
            templateUrl: "report/tpls/myPublish_command.html"
        })
        //草稿箱
    $stateProvider
        .state('command.myinstructDrafts', {
            url: "/myinstructDrafts",
            templateUrl: "myinstruct/tpls/drafts.html",
            abstract: true
        })
        //列表    
    $stateProvider
        .state('command.myinstructDrafts.list', {
            url: "/list?type&title&t",
            templateUrl: "myinstruct/tpls/drafts_list.html",
            controller: "draftsCtrl"
        })
        //草稿箱详情
    $stateProvider
        .state('command.myinstructDrafts_details', {
            url: "/drafts_details?dictateId&issecret",
            templateUrl: "myinstruct/tpls/drafts_details.html"
        })
    //审核
    $stateProvider
        .state('command.myinstructCheck', {
            url: "/myinstructCheck",
            templateUrl: "myinstruct/tpls/check.html",
            abstract: true
        })
    //审核列表   
    $stateProvider
        .state('command.myinstructCheck.list', {
            url: "/list?type&title&t",
            templateUrl: "myinstruct/tpls/check_list.html",
            controller: "checkCtrl"
        })
    //审核详情   
    $stateProvider
        .state('command.myinstructCheck_details', {
            url: "/details?dictateId",
            templateUrl: "myinstruct/tpls/check_details.html",
            controller: "checkDetailCtrl"
        }) 
    //指令翻阅
    $stateProvider
        .state('command.myinstructBrowse', {
            url: "/myinstructBrowse",
            templateUrl: "myinstruct/tpls/browse.html",
            abstract: true
        })
    //指令翻阅列表
    $stateProvider
        .state('command.myinstructBrowse.list', {
            url: "/list?type&title&t",
            templateUrl: "myinstruct/tpls/browse_list.html",
            controller: "browseCtrl"
        })
    //指令翻阅详情   
    $stateProvider
        .state('command.myinstructBrowse_details', {
            url: "/browse&details?dictateId",
            templateUrl: "myinstruct/tpls/browse_details.html",
            controller: "browseDetailCtrl"
        })        
    //联合报道管理
    $stateProvider
        .state('command.reportManagement', {
            url: "/reportManagement?t",
            templateUrl: "report/tpls/reportManagement.html"
        })
    //联合报道细览
    $stateProvider
        .state('command.reportDetailedview', {
            url: "/reportDetailedview",
            templateUrl: "report/tpls/reportDetailedview.html",
            abstract: true
        })
    //联合报道细览->主界面
    $stateProvider
        .state('command.reportDetailedview.reportViewMain', {
            url: "/reportViewMain?corpsId&t",
            templateUrl: "report/tpls/reportViewMain.html"
        })
        //联合报道细览->任务说明
    $stateProvider
        .state('command.reportDetailedview.reportViewExplanation', {
            url: "/reportViewExplanation?corpsId",
            templateUrl: "report/tpls/reportViewExplanation.html"
        })
        //联合报道细览->任务管理
    $stateProvider
        .state('command.reportDetailedview.reportViewManagement', {
            url: "/reportViewManagement",
            templateUrl: "report/tpls/reportViewManagement.html"
        })
        //联合报道细览->任务管理->列表
    $stateProvider
        .state('command.reportDetailedview.reportViewManagement.list', {
            url: "/list?corpsId&orderType&t",
            templateUrl: "report/tpls/reportViewManagement_list.html",
            controller: "reportViewManagementCtrl"
        })
        //联合报道修改
    $stateProvider
        .state('command.reportReviseReport', {
            url: "/reportReviseReport?corpsId",
            templateUrl: "report/tpls/reviseReport.html"
        })
    //设置自定义分组
    $stateProvider
        .state('command.setGroup', {
            url: "/setGroup",
            templateUrl: "setup/tpls/setGroup.html"
        })
    $stateProvider
        .state('command.setGroup_details', {
            url: "/setGroup_details?groupId",
            templateUrl: "setup/tpls/group_details.html"
        })
}]);