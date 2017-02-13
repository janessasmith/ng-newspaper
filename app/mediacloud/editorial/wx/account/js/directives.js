define(function (require) {
    var app = require('app');
/**
 * 图片上传
 * @param  {[type]} $state){	return {		restrict: 'A', 		replace: true,		link: function($scope, element, attributes, controller) {			jQuery(element).bind('click',function(){				var search [description]
 * @return {[type]}                  [description]
 */
app.directive('uplodeDirective', function($state) {
	return {
		restrict: 'A',
		replace: true,
		link: function($scope, element, attributes, controller) {
			$('.choose-btn').click(function() {
				$('#t_file').click();
			});
			$("#t_file").change(function() {
				var address = $("#t_file").val();
				var arr = address.split('\\');
				var my = arr[arr.length - 1];
				var index = window.location.pathname.indexOf("/", 1) + 1;
				var path = window.location.pathname.substring(0, index);
				var domain = window.location.protocol + "//" + window.location.host;
				var options = {
					url: domain + "/wcm/app/application/" +
						"core/com.trs.ui/appendix/file_upload_dowith.jsp?" +
						"fileNameParam=wxHeadImg-browser-btn&fileNameValue=" + my +
						"&Type=METAVIEWDATA_APPENDIX_SIZE_LIMIT&pathFlag=W0",
					dataType: "json",
					success: function(data) {
						var imgAddress = $("#t_file").val();
						$scope.$apply(function(){
							$scope.imgName=imgAddress;
						})
						$("#uploadImg").attr("style", "");
						$("#uploadImg").attr("src",data.Path);
                        $("#output").val(data.Message);    
					},
					error:function(data){
						console.log(data)
					}
				};
				$("#iconForm").ajaxSubmit(options);
			});

		}
	};
});

/**
 * 账号搜索
 * @param  {[type]} $state){	return {		restrict: 'A', 		replace: true,		link: function($scope, element, attributes, controller) {			jQuery(element).bind('click',function(){				var search [description]
 * @return {[type]}                  [description]
 */
app.directive('searchDirective', function($state){
	return {
		restrict: 'A', 
		replace: true,
		link: function($scope, element, attributes, controller) {
			element.bind('click',function(){
				var search = attributes.searchDirective;
				$state.go("index.list",{Search:search},{
					reload: true
				});
				jQuery(this).prev().val('');
			})
		}
	};
});

app.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, ngModel) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      element.bind('change', function(event){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
        //附件预览
        scope.file = (event.srcElement || event.target).files[0];
        scope.getFile();
      });
    }
  };
}]);
});