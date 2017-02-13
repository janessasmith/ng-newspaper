'use strict';
/**
 *  Module 随机动画排列
 *
 * Description
 */
angular.module('randomAnimationModule', []).factory('randomClass', function() {
    return {
        animation: function() {
            var oldArrClass = [];
            var newArrClass = [];
            for (var i = 0; i < 20; i++) {
                oldArrClass.push('anim-' + i);
            }
            for (var n= 0; n < 20; n++) {
                var random = Math.floor(Math.random() * oldArrClass.length);
                newArrClass.push(oldArrClass[random]); //
                oldArrClass.splice(random, 1);
            }
            return newArrClass;
        }
    };
});
