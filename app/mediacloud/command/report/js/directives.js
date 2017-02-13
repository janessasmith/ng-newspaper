var reportDir = angular.module('report.dir', []);

/**
 * 上传图片
 * @param  {[type]} $state)   {	return        {		scope:    {}        [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, element,      attributes, controller)   {			$(element).click(function() {				$('#t_file').click();			});			$("#t_file").change(function() {				var address [description]
 * @return {[type]}           [description]
 */
reportDir.directive('uplodepic', function($state, upload) {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, element, attributes, controller) {
			$(element).click(function() {
				$('#pic_file').click();
			});
			$("#pic_file").change(function() {
				var address = $("#pic_file").val();

				//判断文件是否为图片
				var addressArry = address.split(".");
				// var pictypes=new
				var picformat = addressArry[1].toLowerCase();
				if ((picformat == "jpg") || (picformat == "png") || (picformat == "gif") || (picformat == "bmp") || (picformat == "jpeg")) {
					//删除上传的视频
					var videodiv = $('.videofileList').is(':has(*)');
					if (videodiv > 0) {
						$scope.$parent.params.fileNames = [];
					}
					var videolis = document.getElementById("videofileList");
					var childs = videolis.childNodes;
					while (childs.length) {
						videolis.removeChild(videolis.firstChild);
					}
					//上传文件
					upload.setFileName(address);
					var result = upload.uploadFile("iconForm", "wxHeadImg-browser-btn");
					result.then(function(data) {
						var params = {
							"fileName": upload.getFileName(),
							"fileType": "1",
							"filePath": data.Message
						}
						$scope.$parent.params.fileNames.push(params);
						$('#f_file').val($('#f_file').val() + upload.getFileName() + ",");
						var createobj = $(
							'<div id="" class="lf" style="margin:0 5px 5px 0"><img height="80px" width="80px" src="' + data.Path + '"><a class="fname" style="display: none">' + upload.getFileName() + '</a><span class="delete" id="picdelete" ></span></div>'
						);
						angular.element($('.pcfileList')).append(createobj);
					}, function(data) {
						console.log(data)
					})
				} else {
					alert("请选择jpg,png,gif,bmp,jpeg图片上传！");
				}
			});

		}
	};
});
/**
 * 上传视频
 * @param  {[type]} $state)   {	return        {		scope:    {}        [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, element,      attributes, controller)   {			$(element).click(function() {				$('#t_file').click();			});			$("#t_file").change(function() {				var address [description]
 * @return {[type]}           [description]
 */
reportDir.directive('uplodevideo', function($state, upload) {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, element, attributes, controller) {
			$(element).click(function() {
				$('#video_file').click();
			});
			$("#video_file").change(function() {
				var address = $("#video_file").val();

				//判断是否为视频
				var videoflag = 0;
				var addressArry = address.split(".");
				var videoformat = addressArry[1].toLowerCase();
				if ((videoformat == "3gp") || (videoformat == "flv") || (videoformat == "avi") || (videoformat == "mpeg") || (videoformat == "mp4")) {
					//删除上传图片
					var pcdiv = $('.pcfileList').is(':has(*)');
					if (pcdiv > 0) {
						$scope.$parent.params.fileNames = [];
					}
					var pclis = document.getElementById("pcfileList");
					var childs = pclis.childNodes;
					while (childs.length) {
						pclis.removeChild(pclis.firstChild);
					}
					//上传文件
					upload.setFileName(address);
					var result = upload.uploadFile("iconForm", "video");
					result.then(function(data) {
						var params = {
							"fileName": upload.getFileName(),
							"fileType": "2",
							"filePath": data.Message
						}
						$scope.$parent.params.fileNames.push(params);
						$('#f_file').val($('#f_file').val() + upload.getFileName() + ",");
						var createobj = $(
							// '<div id="" class="lf"><a class="fname">' +'<video src="../../scm/file/read_image.jsp?FileName='+data.Message+'" controls preload style="width:300px"></video>'+ '</a><span id="videodelete" class="delete" ></span></div>'
							'<div id="" class="lf">' + '<video src="' + data.Message + '" controls preload style="width:300px;height: 150px;background: black;">' + '</video>' + '<a class="fname" style="display: none">' + upload.getFileName() + '</a>' + '<span id="videodelete" class="delete" ></span>' + '</div>'
						);
						angular.element($('.videofileList')).append(createobj);
					}, function(data) {
						console.log(data)
					})
				} else {
					alert("请选择mp4,3gp,avi,flv,mpeg上传！");
				}

			});
		}
	};
});

/**
 * 联合报道- 快捷键
 * @param  {[type]} $state)   {                             return  {               scope: {} [description]
 * @param  {[type]} restrict: 'AE'             [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller) {                                    jQuery(iElm).bind('keydown',function(event){                    if(event.keyCode [description]
 * @return {[type]}           [description]
 */
 reportDir.directive('reportEnter', function() {
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
          $scope.$parent.getReportList();
        }
      });
    }
  }; 
});