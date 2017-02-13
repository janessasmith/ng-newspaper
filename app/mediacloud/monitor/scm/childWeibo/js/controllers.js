define(function (require) {
    var app = require('app');
/**
 * 账号运营情况图表
 * @param  {[type]} $scope) {             }] [description]
 * @return {[type]}         [description]
 */
app.controller('wboperatingCtrl', function($scope,$stateParams,wboperatingSer,wbreadoperatingSer,wbreplyoperatingSer) {
        
   //图表样式
    $scope.grid = {backgroundColor: "#fff",x: 55, y: 30, x2: 43,y2: 125};
    $scope.symbol = ["emptyCircle"];

     //账号运营情况数据量
    $scope.queryOperating = function(unitName){
        //调用服务获取集合对象
        var operatingList = wboperatingSer.query($stateParams.unitName);
         //解析集合对象
        operatingList.then(function(data) {
            //实现数据双向绑定 展现数据
            $scope.xaxis = data.date;
            $scope.legend = {"data":data.accounts,"y":"bottom","padding": 15};

            //循环data添加type属性
            if(!angular.isArray(data.data))return;
            for (var i = 0; i < data.data.length; i++) {
                 data.data[i].type = "line";        
            }
            $scope.series = data.data;
        }, function(data) {
            console.log(data);
        })
    }
    $scope.queryOperating(0);

    //账号运营情况阅读数
    
    $scope.queryreadNum = function(unitName){
        //调用服务获取集合对象
        var readNumList = wbreadoperatingSer.queryread($stateParams.unitName);
         //解析集合对象
        readNumList.then(function(data) {
            //实现数据双向绑定 展现数据
            $scope.xaxis = data.date;
            $scope.legend = {"data":data.accounts,"y":"bottom","padding": 15};

            //循环data添加type属性
            if(!angular.isArray(data.data))return;
            for (var i = 0; i < data.data.length; i++) {
                 data.data[i].type = "line";        
            }
            $scope.series = data.data;
        }, function(data) {
            console.log(data);
        })
    }

    //账号运营情况回复数
    
    $scope.queryreplyNum = function(unitName){
        //调用服务获取集合对象
        var replyNumList = wbreplyoperatingSer.queryreply($stateParams.unitName);
         //解析集合对象
        replyNumList.then(function(data) {
            //实现数据双向绑定 展现数据
            $scope.xaxis = data.date;
            $scope.legend = {"data":data.accounts,"y":"bottom","padding": 15};

            //循环data添加type属性
            if(!angular.isArray(data.data))return;
            for (var i = 0; i < data.data.length; i++) {
                 data.data[i].type = "line";        
            }
            $scope.series = data.data;
        }, function(data) {
            console.log(data);
        })
    }

})

/**
 * 微博账号列表查询
 * @param  {[type]} $scope          [description]
 * @param  {[type]} $stateParams    [description]
 * @param  {[type]} wxAxxountSer){                 wxAxxountSer.queryAccountList();    } [description]
 * @return {[type]}                 [description]
 */
app.controller('wbAccountListCtrl', function($scope,$stateParams,wbAccountSer){

   var accountList = wbAccountSer.queryAccountList($stateParams.unitName);
   
   accountList.then(function(data){
        $scope.accounts = data.data;
   },function(data){
        console.log(data);
   })
})

/**
 * 账号影响力榜单
 * @param  {[type]} $scope         [description]
 * @param  {[type]} influenceSer)  {                   $scope.queryFluence [description]
 * @param  {[type]} function(data) {                                                       console.log(data);        })    }    $scope.queryFluence();} [description]
 * @return {[type]}                [description]
 */
app.controller('wbInfluenceCtrl', function($rootScope,$scope,wbInfluenceSer,$stateParams) {
    //获取微博列表
    $scope.queryFluence = function (unitName){
        
        //调用服务获取集合对象
        var  influenceList = wbInfluenceSer.queryInfluences(unitName);
        //解析集合对象
        influenceList.then(function(data) {
            $scope.contents = data.data;
        }, function(data) {
            console.log(data);
        })
    }

    $scope.queryFluence($stateParams.unitName);
});


/**
 * 最新文章
 * @param  {[type]} $scope) {               }] [description]
 * @return {[type]}         [description]
 */
app.controller('wbLatestArticlesCtrl', 
     function($scope,$state,$stateParams,utilClass,wbLatestArticlesSer) {

    var classPromise = utilClass.queryClass();
    classPromise.then(function(data) {
        $scope.classs = data.result;
    }, function(data) {
        console.log(data);
    })

    //获取最新微博
    $scope.queryLatestArticle = function (accountType){

        $scope.params = {
            "accountType": accountType,
            "orderType": 1,
            "unitName": $stateParams.unitName
        }
        
        //调用服务获取集合对象
        var  latestArticleList = wbLatestArticlesSer.queryLatestArticles($scope.params);
        //解析集合对象
        latestArticleList.then(function(data) {
            $scope.contents = data.data;
        }, function(data) {
            console.log(data);
        })  
    }

    $scope.queryLatestArticle("",$stateParams.unitNames);

    //更多
    $scope.more = function(){
         $state.go("weibonewList.list",$scope.params);
    }
})

/**
 *  热点微博
 * @param  {[type]} $scope) {               }] [description]
 * @return {[type]}         [description]
 */
app.controller('HotwbCtrl', function($stateParams,$scope,$state,utilClass,hotweiboSer) {

    var classPromise = utilClass.queryClass();
    classPromise.then(function(data) {
        $scope.classs = data.result;
    }, function(data) {
        console.log(data);
    })

    //获取热点微博
    $scope.queryHotWeibo = function (accountType){
        
        $scope.params = {
            "accountType": accountType,
            "orderType":2,
            "unitName": $stateParams.unitName
        }

        //调用服务获取集合对象
        var  hotWeiboList = hotweiboSer.queryHotweibos($scope.params);
        //解析集合对象
        hotWeiboList.then(function(data) {
            $scope.contents = data.data;
        },function(data) {
            console.log(data);
        })
    }

    $scope.queryHotWeibo("",$stateParams.unitName);

    //更多
    $scope.more = function(){
         $state.go("weibonewList.list",$scope.params);
    }
})

})
