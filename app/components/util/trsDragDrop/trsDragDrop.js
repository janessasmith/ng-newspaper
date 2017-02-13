/**
 * @author hxj
 * @description 指令trsDragFrom支持拖动指定的内容到目标容器中，考虑到目标容器为编辑器，
 * 如果使用mousedown、mouseup等事件进行拖动，则不能控制编辑器插入光标的位置；
 * 目前仅通过使用HTML5的dragstart，draggable等特性，使用浏览器的拖拽特性。
 */
angular.module('util.dragdrop', []).directive('trsDragFrom', [function() {
	var nextId = 0;
	return {
		restrict: 'EA',
		scope: {
			dragStart: '&'
		},
		link: function($scope, $element, $attrs) {
			$element.attr('draggable', true);

			var json = null;
			var uuid;

			//为图片添加唯一标识，以便添加完图片之后，标识出来添加相应的文本信息
			$element.bind('mousedown', function(event) {
				uuid = new Date().getTime() + "_" + (++nextId);
				$element.find('img').attr('uuid', uuid);
			});

			$element.bind('dragstart', function(event) {
				$element.addClass('drag-el-active');
				json = $scope.dragStart();

				if (json.value.CREATIONTYPE == 3) {
					event.originalEvent.dataTransfer.setData("Image", json.value.SRCIMGURL);
				} else {
					event.originalEvent.dataTransfer.setData("Text", json.value.CONTENT || "");
				}
			});

			function notifyEditorChange() {
				var ue = UE.getEditor('ueditor');
				ue.fireEvent("contentChange");
			}

			$element.bind('dragend', function(event) {
				$element.removeClass('drag-el-active');

				var ue = UE.getEditor('ueditor');

				if (!ue) {
					return;
				}

				if (json.value.CREATIONTYPE != 3) {
					notifyEditorChange();
					return;
				}

				var dom = ue.document.querySelector("[uuid='" + uuid + "']");

				if (!dom) {
					return;
				}

				dom.removeAttribute("uuid");
				dom.removeAttribute("ng-src");

				var sHtml = $element.find('.img-content').attr('title');
				sHtml = sHtml.replace(/\n/g, '<br />');
				sHtml = "<div>" + sHtml + "</div>";
				dom.insertAdjacentHTML('afterEnd', sHtml);

				if (json.value.IMGNAME && json.value.IMGNAME.indexOf('/') < 0) {
					dom.setAttribute("oldsrc", json.value.IMGNAME);
				}

				dom.insertAdjacentHTML('beforeBegin', '<p style="text-align:center;"></p>');
				var imgBox = dom.previousSibling;
				imgBox.appendChild(dom);

				var maxImageWidth = 550;
				if (parseInt(dom.offsetWidth, 10) > maxImageWidth) {
					dom.style.width = maxImageWidth + 'px';
					notifyEditorChange();

				} else {
					var img = new Image();
					img.onload = function() {
						dom.src = this.src;

						if (this.width > maxImageWidth) {
							dom.style.width = maxImageWidth + 'px';
						}
						notifyEditorChange();
					}
					img.src = json.value.SRCIMGURL;
				}
			});
		}
	};
}])


/*
.directive('trsDragTo', [function() {

	return {
		restrict: 'EA',
		scope: {
			dragEnd: '&'
		},
		link: function($scope, $element, $attrs) {
			$element.bind('drop', function(event) {
				event.preventDefault();
				var data = event.originalEvent.dataTransfer.getData("Text");
				var json = JSON.parse(data);
				console.log("json:" + json);
			});
		}
	};
}]);

*/