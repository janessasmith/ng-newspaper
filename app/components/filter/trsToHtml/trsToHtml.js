/**
 * 将输入串中的\n,空格等转换成<br/>&nbsp;等，用于邮件稿件在细览页面显示
 * @author hxj
 */
angular.module('trsToHtmlModule', [])

.filter("trsToHtml", [function() {
	return function(str) {
		return str.replace(/(.|\n)/ig, function($0) {
			var value;
			switch ($0) {
				case ' ':
					value = '&nbsp;';
					break;
				case '\n':
					value = '<br/>';
					break;

				default:
					value = $0;
			}

			return value;
		});
	};
}]);