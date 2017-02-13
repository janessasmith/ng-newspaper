define(function (require) {
    var app = require('app');

/*单选框切换样式*/
app.directive('actionDir',function(){
	return {
		restrict: 'A',
		replace: true,
		link: function($scope, element, iAttrs, controller) {
         	element.bind('click', function() {
        		jQuery(this).addClass("data-ls-cur");
				jQuery(this).siblings().removeClass("data-ls-cur");
   	
			})
		}
	};
});

app.directive('changeDir',function(){
	return {
		restrict: 'A',
		replace: true,
		link: function($scope, element, iAttrs, controller) {
         	element.bind('click', function() {
         		 $(".ls-con-rd ul li .rad-bac").removeClass("cur-rad");
       			 $(this).addClass("cur-rad");
			})
		}
	};
});

});