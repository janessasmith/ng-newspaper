/**
 * Created by 马荣钦on 2016/2/1.
*/
'use strict';
angular.module('initMyZoneDropDownModule', [])
    .factory('initMyZoneSelectedService', ['trsHttpService', '$q', function(trsHttpService, $q) {
        return {
            modifyInfoSex: function() {
                var sexJson = [{
                    "name":"男"
                }, {
                    "name":"女"
                }];
                return sexJson;
            },
            modifyInfoOffice: function() {
                var officeJson = [{
                    "name":"待确认"
                }, {
                    "name":"浙报传媒大厦"
                }, {
                    "name":"浙报文化产业大厦"
                }, {
                    "name":"浙报科学馆"
                }, {
                    "name":"其它"
                }];
                return officeJson;
            }
        };
    }]);
