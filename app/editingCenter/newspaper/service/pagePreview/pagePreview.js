'use strict';
/**
 *  Module  分页预览模板
 *  createBy ly
 *  time 2016/4/5
 *
 * Description
 */
angular.module('newsPaperPagePreviewModule', []).factory('pagePreview', ['trsspliceString', 'localStorageService','storageListenerService', function(trsspliceString, localStorageService,storageListenerService) {
    return {
        //缓存存储METADATAID
        listItemCache: function(data) {
            var cachePreviewMetadataid = [];
            cachePreviewMetadataid = trsspliceString.getArrayString(data, "METADATAID", ",").split(",");
            localStorageService.set("newspaperPreviewCache", cachePreviewMetadataid);
        },
        /**
         * [selectedArrayCahe description] 缓存当前选中项
         * @array {[type]} [description]  选中对象
         */
        selectedArrayCahe: function(array) {
            var selectedArray = angular.copy(array);
            var selectedArrayMetadaid = [];
            angular.forEach(selectedArray, function(data, index) {
                selectedArrayMetadaid.push(data.METADATAID);
            });
            storageListenerService.addListenerToSelectArray("curPageIsNull",selectedArrayMetadaid);
            //localStorageService.set("newspaperPreviewSelectArray", selectedArrayMetadaid);
        },
        /**
         * [selectCurArray description] 遍历出选择对象
         * @curSelectedArray {[type]} [description]  当前选中对象
         * @originalArray {[type]} [description]  当前所有列表集合
         * @callback {[type]} [return]  
         */
        selectCurArray: function(curSelectedArray, originalArray) {
            if (curSelectedArray === null) return;
            var selectedArray = [];
            for (var i = 0; i < curSelectedArray.length; i++) {
                for (var j = 0; j < originalArray.length; j++) {
                    if (curSelectedArray[i] === originalArray[j].METADATAID) {
                        selectedArray.push(originalArray[j]);
                    }
                }
            }
            return selectedArray;

        },
        /**
         * 清除缓存
         */
        cleanCache: function() {
            localStorageService.remove("newspaperPreviewSelectArray");
            localStorageService.remove("newspaperPreviewCache");
        }
    };
}]);
