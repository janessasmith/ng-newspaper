angular.module('manageSysManageEmailConfigModule', [])
    .controller('manageSysManageEmailConfigCtrl', ['$scope', '$validation', function($scope, $validation) {
        initStatus();

        function initStatus() {
            $scope.status = {
                singleSelect: {
                    sendWay: [{
                        desc: "使用PHP的mail函数发送",
                        value: "0",
                    }, {
                        desc: "通过SOCKET链接SMTP服务器发送（支持ESMTP验证，推荐方法）",
                        value: "1",
                    }, {
                        desc: "使用PHP的mail函数发送（仅Windows主机下有效，不支持ESMTP验证）",
                        value: "2",
                    }],
                    authentication: [{
                        desc: '是',
                        value: '0',
                    }, {
                        desc: '否',
                        value: '1',
                    }],
                    separator: [{
                        desc: '使用CRLF作为分隔符（常用，SMTP方式默认分隔符）',
                        value: '0',
                    }, {
                        desc: '使用LF作为分隔符（一些Unix主机使用mail函数时需用LF代替CRLF',
                        value: '1',
                    }, {
                        desc: '使用CR作为分隔符（通常为Mac主机，不常用）',
                        value: '2',
                    }],
                }
            }
        }
        $scope.save = function() {
            $validation.validate($scope.typingForm).success(function() {
                $modalInstance.close($scope.content);
            });
        }
    }]);
