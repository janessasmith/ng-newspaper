angular.module('resCenDigitalDetailModule', [])
    .controller('resCenDigitalDetailCtrl', ['$scope', '$state', function($scope, $state) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化状态函数开始
         * @return {[type]} [description] null
         */
        function initStatus() {
            $scope.page = {
                CURRPAGE: '1',
                PAGESIZE: 12,
                ITEMCOUNT: 0,
                PAGECOUNT: 1,
            };
            $scope.params = {

            };
            $scope.status = {

            };
        };
        /**
         * [initStatus description]初始化请求数据函数开始
         * @return {[type]} [description] null
         */
        function initData() {

        };
    }])
