/*Create by CC 2015-12-09*/
"use strict";
angular.module('iWoSubmitServiceModule', []).
factory('iWoSbumitService', function() {
    return {
        initMediaName: function() {
            var mediasArray = [{
                'mediaName': '纸媒',
                'mediaType': 3,
                'type': 'newspaper',
                'params':'papers'
            }, {
                'mediaName': '网站',
                'mediaType': 2,
                'type': 'website',
                'params':"webs"
            }, {
                'mediaName': 'APP',
                'mediaType': 1,
                'type': 'app',
                'params':"app"
            },{
                'mediaName': '微信',
                'mediaType': 4,
                'type':"weixin",
                'params':'weChat'
            }];
            return mediasArray;
        },
        initTreeOpition: function() {
            var treeOptions = {
                nodeChildren: "CHILDREN",
                dirSelectable: true,
                allowDeselect: false,
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "a8"
                },
                isLeaf: function(node) {
                    return node.HASCHILDREN == "false";
                }
            };
            return treeOptions;
        },
        initAppTreeOption: function() {
            var appTreeOptions = {
                nodeChildren: "ZONE_COLUMNS",
                dirSelectable: true,
                allowDeselect: false,
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "take-draft-tree-label-sel",
                },
                isLeaf: function(node) {
                    return node.ZONE_COLUMNS == undefined;
                }
            };
            return appTreeOptions;
        }
    };
});
