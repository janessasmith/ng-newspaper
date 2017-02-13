define(function (require) {
    var app = require('app');

/**
 * 高亮选中标签
 * @param  {[type]} ) {	return     {				restrict: 'A',		replace: true,		link: function($scope, iElm, iAttrs, controller){			jQuery(iElm).bind('click', function() {				if (!jQuery(this).hasClass("lg-sel-cur")) {					jQuery(this).addClass("lg-sel-cur");					jQuery(this).siblings().removeClass("lg-sel-cur");					$scope.getContent();				};			})		}	};} [description]
 * @return {[type]}   [description]
 */
app.directive('checked', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller){
			jQuery(iElm).bind('click', function() {
				if (!jQuery(this).hasClass(iAttrs.checked)) {
					jQuery(this).addClass(iAttrs.checked);
					jQuery(this).siblings().removeClass(iAttrs.checked);
				};
			})
		}
	};
});

/**
 * 元素切换
 * @param  {[type]} $window)  {	return        {		scope:    {			num: "@",			ele:"@",			width:"@"		} [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs,   controller)                     {						$window.onload [description]
 * @return {[type]}           [description]
 */
app.directive('change', function(utilClass) {
	return {
		scope: {
			ele:"@",
			width:"@",
			num:"@"
		},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			//设置DIV宽度
			var classPromise = utilClass.queryClass();
			classPromise.then(function(data) {
				$scope.len = data.result.length;
				$scope.sumNum = parseInt($scope.num)+$scope.len;//获取元素个数
				$scope.aWidth = jQuery(iElm).children().eq(0)[0].offsetWidth; //获取元素宽度
				jQuery(iElm).width($scope.sumNum * ($scope.aWidth + 5)); //设置父元素宽度
				jQuery(iElm).css("left", 0);

				//元素切换
				jQuery("#" + $scope.ele).click(function() {
					var left = Math.abs(parseInt(jQuery(iElm).css("left"))) + parseInt($scope.width);
					if (left >= $scope.sumNum * $scope.aWidth) {
						if (!jQuery(iElm).is(":animated")) { //判断元素是否正处于动画状态
							jQuery(iElm).animate({
								"left": 0
							});
						}
					} else {
						if (!jQuery(iElm).is(":animated")) {
							jQuery(iElm).animate({
								"left": (parseInt(jQuery(iElm).css("left")) - parseInt($scope.width)) + "px"
							});
						}
					}
				})
			}, function(data) {
				console.log(data);
			})
		}
	};
});

app.directive('accountNum',  function($state){
return {
		restrict: 'AE', 
		replace: true,
		link: function($scope, element, attributes, controller) {		
				jQuery(".wb-rk-arrow").siblings(".wb-rk-deal").css("height","90px");
				element.bind('click',function(){
					if(jQuery(this).siblings(".wb-rk-deal").height()>90){
                        jQuery(this).siblings(".wb-rk-deal").css("height","90px");
						jQuery(".wb-rk-arrow").css("background-image",'url("common/images/wb-rk-bac02.png")');
					}else{
						jQuery(this).siblings(".wb-rk-deal").css("height","auto");
						jQuery(".wb-rk-arrow").css("background-image",'url("common/images/wb-rk-bac04.png")');	
					}
				});			
		}
	};
});

});