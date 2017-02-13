"use strict";
/*
    Create By Chenchen 2015-10-19
*/
/*
trsNavLocationModule:
主要功能：左右联动的面包屑导航
html: <trs-nav-location></trs-nav-location>,
css:位于edit_center_css.css中
js:无输入参数
 */
angular.module('trsPasswordStrongModule', []).
directive('trsPwdStrong', ['$location', "$q", 'trsHttpService', '$stateParams', '$state', '$timeout', function($location, $q, trsHttpService, $stateParams, $state, $timeout) {
    return {
        restrict: 'EA',
        templateUrl: "./components/util/trsPassword/trsPassword_tpl.html",
        scope: {
            password: "=",
            description: "=",
        },
        link: function(scope, iElement, iAttrs) {
            $timeout(function() {
                if (angular.isDefined(scope.password)) {
                    showPwdStrong();
                }
                scope.checkPassword = function() {
                    showPwdStrong();
                };
            });


            function showPwdStrong() {
                var password = ['', '弱', '中', '强', '非常好'];
                scope.passwordStrong = (checkStrong(scope.password) * 25) + '%';
                scope.passwordMark = password[checkStrong(scope.password)];
            }
            /**
             * [checkStrong description]检测密码强度
             * @param  {[type]} sValue [description]输入的值
             * @return {[type]}        [description]
             */
            function checkStrong(sValue) {
                var modes = 0;
                if (sValue.length < 8) return modes;
                if (/\d/.test(sValue)) modes++; //数字
                if (/[a-z]/.test(sValue)) modes++; //小写
                if (/[A-Z]/.test(sValue)) modes++; //大写  
                if (/\W/.test(sValue)) modes++; //特殊字符
                switch (modes) {
                    case 1:
                        return 1;
                        break;
                    case 2:
                        return 2;
                    case 3:
                        return 3;
                    case 4:
                        return sValue.length < 12 ? 3 : 4;
                        break;
                }
            }
        }
    };
}]);
