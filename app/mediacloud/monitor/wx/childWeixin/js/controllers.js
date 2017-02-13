define(function (require) {
    var app = require('app');
/**
 * 账号运营情况图表
 * @param  {[type]} $scope) {             }] [description]
 * @return {[type]}         [description]
 */
app.controller('wxoperatingCtrl', function($scope,$stateParams,wxoperatingSer,wxreadoperatingSer,wxreplyoperatingSer) {
       
    //图表样式
    $scope.grid = {backgroundColor: "#fff",x: 55, y: 30, x2: 43,y2: 125};
    $scope.symbol = ["emptyCircle"];

    //账号运营情况数据量
    
    $scope.queryOperating = function(unitName){
        //调用服务获取集合对象
        var operatingList = wxoperatingSer.query($stateParams.unitName);
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
        var readNumList = wxreadoperatingSer.queryread($stateParams.unitName);
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

    //账号运营情况评论数
    
    $scope.querycommentNum = function(unitName){
        //调用服务获取集合对象
        var replyNumList = wxreplyoperatingSer.queryreply($stateParams.unitName);
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
 * 账号影响力
 * @param  {String} $scope)       {                            $scope.upNav [description]
 * @param  {[type]} options.id:   1             [description]
 * @param  {[type]} options.name: '本周'          [description]
 * @param  {[type]} options.id:   2             [description]
 * @param  {[type]} options.name: '本月'                          }]          [description]
 * @return {[type]}               [description]
 */
app.controller('influenceCtrl', function($scope,$stateParams,influenceSer) {

    //获取微博列表
    $scope.queryFluence = function (){
        
        //调用服务获取集合对象
        var  influenceList = influenceSer.queryInfluences($stateParams.unitName);
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
 * 微信账号列表查询
 * @param  {[type]} $scope          [description]
 * @param  {[type]} $stateParams    [description]
 * @param  {[type]} wxAxxountSer){                 wxAxxountSer.queryAccountList();    } [description]
 * @return {[type]}                 [description]
 */
app.controller('wxAccountListCtrl', function($scope,$stateParams,wxAccountSer){
   var accountList = wxAccountSer.queryAccountList($stateParams.unitName);
   accountList.then(function(data){
        $scope.accounts = data.data;
   },function(data){
        console.log(data);
   })
})

/**
 * 最新文章
 * @param  {[type]} $scope) {               }] [description]
 * @return {[type]}         [description]
 */
app.controller('latestArticlesCtrl', function($scope,$state,$stateParams,utilClass,wxLatestArticlesSer) {

    var classPromise = utilClass.queryClass();
    classPromise.then(function(data) {
            $scope.classs = data.result;
        },function(data) {
            console.log(data);
        })

    //获取微信最新文章
    $scope.queryLatestArticle = function (accountType){

        $scope.params = {
            "accountType": accountType,
            "orderType": 1,
            "unitName": $stateParams.unitName
        }
        
        //调用服务获取集合对象
        var  latestArticleList = wxLatestArticlesSer.queryLatestArticles($scope.params);
        //解析集合对象
        latestArticleList.then(function(data) {
            $scope.contents = data.data;
        }, function(data) {
            console.log(data);
        })  
    }
    //默认查询
    $scope.queryLatestArticle();

    //更多
    $scope.more = function() {
        $state.go("weixinnewList.list", $scope.params);
    }
})

/**
 *  热点微信
 * @param  {[type]} $scope) {               }] [description]
 * @return {[type]}         [description]
 */
app.controller('HotwxCtrl', function($scope,$state,$stateParams,utilClass,hotweixinSer) {

    var classPromise = utilClass.queryClass();
    classPromise.then(function(data) {
            $scope.classs = data.result;
        },function(data) {
            console.log(data);
        })

    //获取热点微信
    $scope.queryHotWeixin = function (accountType){

        $scope.params = {
            "accountType": accountType,
            "orderType": 2,
            "unitName": $stateParams.unitName
        }
        
        //调用服务获取集合对象
        var hotWeiboList = hotweixinSer.queryHotweixins($scope.params);
        //解析集合对象
        hotWeiboList.then(function(data) {
            $scope.contents = data.data;
        },function(data) {
            console.log(data);
        })
    
    }
    //默认查询
    $scope.queryHotWeixin();

    //更多
    $scope.more = function() {
        $state.go("weixinnewList.list", $scope.params);
    }
})

})