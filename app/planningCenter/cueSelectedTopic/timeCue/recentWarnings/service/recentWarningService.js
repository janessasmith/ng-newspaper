'use strict';
/**
 *  Module 近期预警右侧信息
 *  creatBy  fanglijuan   2016/6/21
 * Description
 */
angular.module('recentWarningServiceModele', []).factory('recentWarning', function() {
    return {
        rightDisasterTypes: function() {
            var rightDisasterTypes = [{
                "VALUE": "地震",
                "DESC": "地震预警"
            }, {
                "VALUE": "天气",
                "DESC": "天气预警"
            }, {
                "VALUE": "台风",
                "DESC": "台风预警"
            }];
            return rightDisasterTypes;
        },
        childDisasterTypes: function() {
            var childDisasterTypes = {
                '地震': [{
                    "VALUE": "3.0",
                    "DESC": " < 3级",
                    "CLASS": ""
                }, {
                    "VALUE": "3.0-4.5",
                    "DESC": " ≥ 3且 < 4.5级",
                    "CLASS": ""
                }, {
                    "VALUE": "4.5-6.0",
                    "DESC": " ≥ 4.5且 < 6级",
                    "CLASS": ""
                }, {
                    "VALUE": "6.0-7.0",
                    "DESC": " ≥ 6且 < 7级",
                    "CLASS": ""
                }, {
                    "VALUE": "7.0-8.0",
                    "DESC": " ≥ 7且 < 8级",
                    "CLASS": ""
                }, {
                    "VALUE": "8.0",
                    "DESC": " ≥ 8级",
                    "CLASS": ""
                }],
                '天气': [{
                    "VALUE": "蓝色",
                    "DESC": "蓝色一般（IV级）",
                    "CLASS": "blue"
                }, {
                    "VALUE": "黄色",
                    "DESC": "黄色较大（III级）",
                    "CLASS": "yellow"
                }, {
                    "VALUE": "橙色",
                    "DESC": "橙色重大（II级）",
                    "CLASS": "orange"
                }, {
                    "VALUE": "红色",
                    "DESC": "红色特别重大（I级）",
                    "CLASS": "red"
                }, {
                    "VALUE": "其它",
                    "DESC": "其它",
                    "CLASS": "gray"
                }],
                '台风': [{
                    "VALUE": "",
                    "DESC": "",
                    "CLASS": ""
                }]
            };
            return childDisasterTypes;
        },
        disasterTypeImgs: function() {
            var disasterTypeImgs = {
                '地震': {
                    "img": "ti-7.png"
                },
                '台风': {
                    "img": "ti-8.png"
                },
                '天气': {
                    '橙色': {
                        "暴雪": "tq_1.png",
                        "暴雨": "tq_2.png",
                        "冰雹": "tq_3.png",
                        "大风": "tq_4.png",
                        "大雾": "tq_5.png",
                        "道路冰雪": "tq_6.png",
                        /*无对应字段*/
                        "道路结冰": "tq_7.png",
                        /*无对应字段*/
                        "低温": "tq_8.png",
                        /*无对应字段*/
                        "干旱": "tq_9.png",
                        "干热风": "tq_10.png",
                        /*无对应字段*/
                        "高温": "tq_11.png",
                        "寒潮": "tq_12.png",
                        "寒冷": "tq_13.png",
                        /*无对应字段*/
                        "降温": "tq_14.png",
                        /*无对应字段*/
                        "空气重污染": "tq_15.png",
                        /*无对应字段*/
                        "雷电": "tq_16.png",
                        "雷电大风": "tq_17.png",
                        /*无对应字段*/
                        "霾橙": "tq_18.png",
                        "森林火险": "tq_19.png",
                        /*无对应字段*/
                        "沙尘暴": "tq_20.png",
                        "霜冻": "tq_21.png",
                        "台风": "tq_22.png"
                    },
                    '红色': {
                        "暴雪": "tq_red_1.png",
                        "暴雨": "tq_red_2.png",
                        "冰雹": "tq_red_3.png",
                        "大风": "tq_red_4.png",
                        "大雾": "tq_red_5.png",
                        "道路冰雪": "tq_red_6.png",
                        /*无对应字段*/
                        "道路结冰": "tq_red_7.png",
                        /*无对应字段*/
                        "低温": "tq_red_8.png",
                        /*无对应字段*/
                        "干旱": "tq_red_9.png",
                        "干热风": "tq_red_10.png",
                        /*无对应字段*/
                        "高温": "tq_red_11.png",
                        "寒潮": "tq_red_12.png",
                        "寒冷": "tq_red_13.png",
                        /*无对应字段*/
                        "降温": "tq_red_14.png",
                        /*无对应字段*/
                        "空气重污染": "tq_red_15.png",
                        /*无对应字段*/
                        "雷电": "tq_red_16.png",
                        "雷电大风": "tq_red_17.png",
                        /*无对应字段*/
                        "霾红": "tq_red_18.png",
                        "森林火险": "tq_red_19.png",
                        /*无对应字段*/
                        "沙尘暴": "tq_red_20.png",
                        "霜冻": "tq_blue_21.png",
                        /*无图片、给最低级别的*/
                        "台风": "tq_red_22.png"
                    },
                    '黄色': {
                        "暴雪": "tq_yellow_1.png",
                        "暴雨": "tq_yellow_2.png",
                        "冰雹": "tq_3.png",
                        /*无图片、给最低级别的*/
                        "大风": "tq_yellow_4.png",
                        "大雾": "tq_yellow_5.png",
                        "道路冰雪": "tq_yellow_6.png",
                        /*无对应字段*/
                        "道路结冰": "tq_yellow_7.png",
                        /*无对应字段*/
                        "低温": "tq_yellow_8.png",
                        /*无对应字段*/
                        "干旱": "tq_yellow_9.png",
                        "干热风": "tq_yellow_10.png",
                        /*无对应字段、无图片*/
                        "高温": "tq_yellow_11.png",
                        "寒潮": "tq_yellow_12.png",
                        "寒冷": "tq_yellow_13.png",
                        /*无对应字段*/
                        "降温": "tq_yellow_14.png",
                        /*无对应字段*/
                        "空气重污染": "tq_yellow_15.png",
                        /*无对应字段*/
                        "雷电": "tq_yellow_16.png",
                        "雷电大风": "tq_yellow_17.png",
                        /*无对应字段*/
                        "霾黄": "tq_yellow_18.png",
                        "森林火险": "tq_yellow_19.png",
                        /*无对应字段*/
                        "沙尘暴": "tq_yellow_20.png",
                        "霜冻": "tq_yellow_21.png",
                        "台风": "tq_yellow_22.png"
                    },
                    '蓝色': {
                        "暴雪": "tq_blue_1.png",
                        "暴雨": "tq_blue_2.png",
                        "冰雹": "tq_3.png",
                        /*无图片、给最低级别的*/
                        "大风": "tq_blue_4.png",
                        "大雾": "tq_yellow_5.png",
                        /*无图片、给最低级别的*/
                        "道路冰雪": "tq_blue_6.png",
                        /*无对应字段*/
                        "道路结冰": "tq_blue_7.png",
                        /*无对应字段、无图片*/
                        "低温": "tq_blue_8.png",
                        /*无对应字段*/
                        "干旱": "tq_blue_9.png",
                        "干热风": "tq_blue_10.png",
                        /*无对应字段*/
                        "高温": "tq_yellow_11.png",
                        /*无图片、给最低级别的*/
                        "寒潮": "tq_blue_12.png",
                        "寒冷": "tq_blue_13.png",
                        /*无对应字段*/
                        "降温": "tq_blue_14.png",
                        /*无对应字段*/
                        "空气重污染": "tq_blue_15.png",
                        /*无对应字段*/
                        "雷电": "tq_yellow_16.png",
                        /*无图片、给最低级别的*/
                        "雷电大风": "tq_blue_17.png",
                        /*无对应字段*/
                        "霾橙": "tq_yellow_18.png",
                        /*无图片、给最低级别的*/
                        "森林火险": "tq_blue_19.png",
                        /*无对应字段*/
                        "沙尘暴": "tq_yellow_20.png",
                        /*无图片、给最低级别的*/
                        "霜冻": "tq_blue_21.png",
                        "台风": "tq_blue_22.png"
                    },
                    '其它': {
                        "img": "" /*不显示图片*/
                    }
                }
            };
            return disasterTypeImgs;
        }
    };
});
