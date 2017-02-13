'use strict';
/**
 *  Module  随机排列文章
 * createBy  liangY
 * Description
 */
angular.module('planRandomTxtListModule', []).factory('randomTxtList', ['initCueMonitorMoreService','randomClass', function(initCueMonitorMoreService,randomClass) {
    return function randomTxt(params) {
        var headLine = params;
        var generArray = initCueMonitorMoreService.generArray();
        var newArrary = [];
        var randomAni=randomClass.animation();


        for (var i = 0; i < 8; i++) {
            var random = Math.floor(Math.random() * generArray.length);
            newArrary.push(generArray[random]); //.splice(generArray[random], 1));
            generArray.splice(random, 1);
        }
        var initNum = 0;
        angular.forEach(newArrary, function(data, index, array) {
            angular.forEach(data, function(_data, _index, _array) {
                if (initNum <= headLine.length - 1) {
                    newArrary[index][_index].STRVALUE = headLine[initNum].STRVALUE.substr(0,20);
                    newArrary[index][_index].ID=headLine[initNum].ID;
                    newArrary[index][_index].CLASS=randomAni[initNum];
                    initNum++;
                }

            });
        });
        var hotNums = newArrary;
        return hotNums;
    };
}]);
