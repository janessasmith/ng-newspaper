var myinstructDir = angular.module('myinstruct.dir', []);

myinstructDir.directive('tableFold', function() {
  return {
    scope: {
      heading: '@'
    },
    restrict: 'E',
    template: "<div class=\"my-ck-jt\">" +
      "<div class=\"rw-my-top\" ng-click=\"toggleOpen();\">" +
      "<div class=\"ck-my-top lf\">" +
      "<span>{{heading}}</span>" +
      "<span class=\"my-op\"></span>" +
      "<span class=\"my-cl\" style=\"display: none;\"></span>" +
      "</div>" +
      "</div>" +
      "<div class=\"cg-main-ls\">" +
      "<ul ng-transclude > </ul>" +
      "</div>" +
      "</div>",
    replace: true,
    transclude: true,
    link: function($scope, iElm, iAttrs, controller) {
      $scope.isOpen = true;
      $scope.toggleOpen = function() {
        $scope.isOpen = !$scope.isOpen;
      }
      $scope.$watch('isOpen', function(newValue, oldValue, scope) {
        if (newValue) {
          jQuery(iElm).children(".cg-main-ls").slideDown(500);
        } else {
          jQuery(iElm).children(".cg-main-ls").slideUp(500);
        }
      });
    }
  };
});

myinstructDir.directive('tableList', function($state, dialogServer, $uibModal) {
  return {
    scope: {
      index: '@',
      dictateid: '@',
      title: '@',
      onlyday: '@ionlyday',
      issecert: '@',
      dataarray: '@',
      cruser:'@'
    },
    restrict: 'E',
    template: "<li ng-class=\"{'blue-bac':isfade}\">" +
//      "<div class=\"cg-check-box lf\" ng-click=\"task();\"><input type=\"checkbox\" ng-model=\"value\" /></div>" +
      "<a href ui-sref=\"command.myinstructBlacklog_details({dictateId:dictateid,issecret:issecert})\" class=\"cg-ls-tit lf\">{{title}}<span style=\"color: #FF4020\">(发送人：{{cruser}})</span></a>" +
      "<b ng-show=\"issecert==1\"></b>" +
      "<div class=\"my-rz-ts rt\">" +
      "<a  class=\"my-sy-ts {{onlyday<2?'zl-danger':onlyday>=5?'zl-ok':'zl-warn'}}\">" +
      "<i></i>" +
      " <p>剩余<span>{{onlyday}}</span>天</p>" +
      "</a>" +
      "</div>" +
      "</li>",
    replace: true,
    link: function($scope, iElm, iAttrs, controller) {

      $scope.isfade = false;
      if ((parseInt($scope.index) + 1) % 2 == 0) {
        $scope.isfade = true;
      }
      //结束任务
      $scope.task = function() {
        if (!$scope.value) return;
        var open = dialogServer.dialogVerify();
        open('400', {
          "dictateid": $scope.dictateid,
          "ctrlInstance": "backlogCtrlInstance",
          "message": "是否设置完成？"
        });
      }
    }
  };
});
/**
 * 滚动条样式
 * @param  {[type]} )         {                                                 return {      scope: {}                             [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller) {                    jQuery(iElm).mCustomScrollbar({                       scrollButtons: {            enable: false          }        });      }    };  } [description]
 * @return {[type]}           [description]
 */
myinstructDir.directive('scroll', function() {
  return {
    scope: {},
    restrict: 'A',
    replace: true,
    link: function($scope, iElm, iAttrs, controller) {
      jQuery(iElm).mCustomScrollbar({
        scrollButtons: {
          enable: false
        }
      });
    }
  };
});
/**
 * 我发起的点击绑定事件
 * @param  {[type]} )         {                                                 return {      scope: {}                          [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller) {                    jQuery(iElm).click(function() {                     jQuery('.read-sta-box').hide();          jQuery(iElm).siblings('.read-sta-box').show();        })        jQuery(document).bind("click",function(e){          var target [description]
 * @return {[type]}           [description]
 */
myinstructDir.directive('showbox', function() {
  return {
    scope: {},
    restrict: 'A',
    replace: true,
    link: function($scope, iElm, iAttrs, controller) {
      jQuery(iElm).click(function() {
        jQuery('.read-sta-box').hide();
        if(iAttrs.showbox>0){
            jQuery(iElm).siblings('.read-sta-box').show();
         }
      })
      jQuery(document).bind("click", function(e) {
        var target = jQuery(e.target);
        if (target.closest(".read-sta-box").length == 0 && target.closest(".read-sta").length == 0) {
          jQuery('.read-sta-box').hide();
        }
      })
    }
  };
});
/**
 * 隐藏 弹出框边框  回车键快捷跳转(密级指令)  
 * @param  {[type]} )         {                                                 return {      scope: {}                          [description]
 * @param  {[type]} restrict: 'E'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller) {                    jQuery(iElm).click(function() {                     jQuery('.read-sta-box').hide();          jQuery(iElm).siblings('.read-sta-box').show();        })        jQuery(document).bind("click",function(e){          var target [description]
 * @return {[type]}           [description]
 */
myinstructDir.directive('displayborder', function() {
  return {
    scope: {},
    restrict: 'AE',
    replace: true,
    link: function($scope, iElm, iAttrs, controller) {
      jQuery(iElm).parent().removeClass("modal-content");
      jQuery(iElm).bind('keydown',function(event){
                    if(event.keyCode == "13"){
                      $scope.$parent.check();
                    }
                });
    }
  };
});

/**
 * 我的待办列表查询快捷键
 * @param  {[type]} $state)   {                             return  {               scope: {} [description]
 * @param  {[type]} restrict: 'AE'             [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller) {                                    jQuery(iElm).bind('keydown',function(event){                    if(event.keyCode [description]
 * @return {[type]}           [description]
 */
myinstructDir.directive('enter', function($state) {
  return {
    scope: {},
    restrict: 'AE',
    replace: true,
    link: function($scope, iElm, iAttrs, controller) {
             jQuery(iElm).bind('keydown',function(event){
                    if(event.keyCode == "13"){
                      $state.go(iAttrs.enter,{"title":$(iElm).val()});
                    }
                });
    }
  };
});
/**
 * 我的待办-我发起的 快捷键
 * @param  {[type]} $state)   {                             return  {               scope: {} [description]
 * @param  {[type]} restrict: 'AE'             [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller) {                                    jQuery(iElm).bind('keydown',function(event){                    if(event.keyCode [description]
 * @return {[type]}           [description]
 */
 myinstructDir.directive('myEnter', function() {
  return {
    scope: {
      myType:'@',
      overType:'@'
    },
    restrict: 'AE',
    replace: true,
    link: function($scope, iElm, iAttrs, controller) {
      jQuery(iElm).bind('keydown', function(event) {
        if (event.keyCode == "13") {
          $scope.$parent.getmyLaunchList($scope.myType, $scope.overType, 1);
        }
      });
    }
  }; 
});