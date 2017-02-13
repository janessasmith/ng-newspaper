"use strict";
/**
 *  Module
 * Author:wang.jiang 2016-2-29
 * Description 在编辑页新建修改稿件时，通过缓存刷新列表页；
 */
angular.module('storageLIstenerModule', []).factory('storageListenerService', ['$window', 'localStorageService', '$q', '$timeout', function($window, localStorageService, $q, $timeout) {
    var localStorage = {
        app: {
            save: "",
        },
        iwo: {
            newsSaved: "",
            newsPassed: "",
            newsSubmit: "",
            newsShared: "",
            newsCopy: "",
            newsInvoke: "",
            newsCopyDraft: "",
            newsRestore: "",
            newsDelete: ""
        },
        newspaper: {
            save: "",
            shangban: "",
            zhuanban: "",
            daiyong: "",
            qianfazp: "",
            chegao: "",
            quxiaoqf: "",
            tuigao: ""
        },
        website: {
            save: "",
            send: "",
            directSign: "",
            timeSign: "",
            pubish: "",
            reject: "",
            move: ""
        },
        weixin: {
            save: "",
            send: "",
            directSign: "",
            rejectionDraft: "",
            revoke: ""
        },
        plan: {
            modifCaland: ""
        },
        resource: {
            takeDraft: ""
        },
        platforms: {
            "app": "appdraftedit",
            "iwo": "iwonewsaddedit",
            "newspaper": "newspaperaddedit",
            "website": "websiteaddedit",
            "plan": "planaddedit",
            "resource": "resourceaddedit",
            "weixin": "weixinaddedit",
        },
        selectArray: {
            curPageIsNull: '',
            curPageSelectArray: [],
        }
    };

    var cacheCallback = [];
    return {
        removeAllListener: function() {
            for (var i = cacheCallback.length - 1; i >= 0; i--) {
                $window.removeEventListener('storage', cacheCallback[i]);
            }
            cacheCallback = [];
        },
        /**
         * [listenApp description]监听APP缓存
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        listenApp: function(callback) {
            var fn = function(e) {
                if (localStorageService.get("appdraftedit") != null) {
                    var localStorage = localStorageService.get("appdraftedit");
                    if (localStorage.save === true) {
                        callback();
                    }
                }
            };
            $window.addEventListener("storage", fn, false);
            cacheCallback.push(fn);
        },
        /**
         * [listenIwo description] 在列表页添加监听器
         * @param  {Function} callback [description] 缓存变动后的回调
         * @return {[type]}            [description] null
         */
        listenIwo: function(callback) {
            var fn = function(e) {
                if (localStorageService.get("iwonewsaddedit") != null) {
                    var localStorage = localStorageService.get("iwonewsaddedit");
                    if (localStorage.newsSaved === true ||
                        localStorage.newsPassed === true ||
                        localStorage.newsSubmit === true ||
                        localStorage.newsShared === true ||
                        localStorage.newsCopy === true ||
                        localStorage.newsInvoke === true ||
                        localStorage.newsCopyDraft === true ||
                        localStorage.newsRestore === true ||
                        localStorage.newsDelete === true) {
                        callback();
                    }
                }
            };
            $window.addEventListener("storage", fn, false);
            cacheCallback.push(fn);
        },
        /**
         * [addListenerToApp description]监听app编辑页修改
         * @param {[type]} key [description]
         */
        addListenerToApp: function(key) {
            localStorage.app[key] = true;
            localStorageService.set("appdraftedit", localStorage.app);
        },
        /**
         * [addListenerToIwo description]iwo 的编辑页修改监听项的值
         * @param {[type]} key [description] null
         */
        addListenerToIwo: function(key) {
            localStorage.iwo[key] = true;
            localStorageService.set("iwonewsaddedit", localStorage.iwo);
        },
        /**
         * [addListenerToPlan description]策划中心概览页面修改监听项值
         * @param {[type]} key [description]
         */
        addListenerToPlan: function(key) {
            localStorage.plan[key] = true;
            localStorageService.set('planaddedit', localStorage.plan);
        },
        /**
         * [removeListener description]移除对应平台的监听器
         * @param  {[type]} platform [description]
         * @return {[type]}          [description]
         */
        removeListener: function(platform) {
            platform = localStorage.platforms[platform];
            $timeout(function() {
                localStorageService.remove(platform);
            }, 500);
        },
        /**
         * [listenNewspaper description] 在报纸的列表页添加监听器
         * @param  {Function} callback [description] 监听项修改后触发回掉
         * @return {[type]}            [description]
         */
        listenNewspaper: function(callback) {
            var fn = function(e) {
                if (localStorageService.get("newspaperaddedit") != null) {
                    var localStorage = localStorageService.get("newspaperaddedit");
                    if (localStorage.shangban === true ||
                        localStorage.zhuanban === true ||
                        localStorage.daiyong === true ||
                        localStorage.qianfazp === true ||
                        localStorage.chegao === true ||
                        localStorage.quxiaoqf === true ||
                        localStorage.save === true ||
                        localStorage.tuigao === true
                    ) {
                        callback();
                    }
                }

            };
            $window.addEventListener("storage", fn, false);
            cacheCallback.push(fn);
        },
        /**
         * [addListenerToNewspaper description] 报纸的编辑页修改监听项的值
         * @param {[type]} key [description]
         */
        addListenerToNewspaper: function(key) {
            localStorage.newspaper[key] = true;
            localStorageService.set("newspaperaddedit", localStorage.newspaper);
        },
        /**
         * [listenNewspaper description] 在网站的列表页添加监听器
         * @param  {Function} callback [description] 监听项修改后触发回掉
         * @return {[type]}            [description]
         */
        listenWebsite: function(callback) {
            var fn = function(e) {
                if (localStorageService.get("websiteaddedit") != null) {
                    var localStorage = localStorageService.get("websiteaddedit");
                    if (localStorage.save === true ||
                        localStorage.send === true ||
                        localStorage.directSign === true ||
                        localStorage.pubish === true ||
                        localStorage.reject === true ||
                        localStorage.timeSign === true ||
                        localStorage.move === true
                    ) {
                        callback();
                    }
                }

            };
            $window.addEventListener("storage", fn, false);
            cacheCallback.push(fn);
        },
        /**
         * [listenPlan description]监听策划中心缓存
         * @param  {Function} callback [description]回调函数
         * @return {[type]}            [description]
         */
        listenPlan: function(callback) {
            var fn = function(e) {
                if (localStorageService.get("planaddedit") != null) {
                    var localStorage = localStorageService.get("planaddedit");
                    if (localStorage.modifCaland === true) {
                        callback();
                    }
                }
            };
            $window.addEventListener("storage", fn, false);
            cacheCallback.push(fn);
        },
        /**
         * [addListenerToNewspaper description] 网站的编辑页修改监听项的值
         * @param {[type]} key [description]
         */
        addListenerToWebsite: function(key) {
            localStorage.website[key] = true;
            localStorageService.set("websiteaddedit", localStorage.website);
        },

        /**
         * [listenResource description]监听资源中心缓存
         * @param  {Function} callback [description]回调函数
         * @return {[type]}            [description]
         */
        listenResource: function(callback) {
            var fn = function(e) {
                if (localStorageService.get("resourceaddedit") != null) {
                    var localStorage = localStorageService.get("resourceaddedit");
                    if (localStorage.takeDraft === true) {
                        callback();
                    }
                }
            };
            $window.addEventListener("storage", fn, false);
            cacheCallback.push(fn);
        },
        /**
         * [addListenerToResource description] 资源中心查看页取稿监听项的值
         * @param {[type]} key [description]
         */
        addListenerToResource: function(key) {
            localStorage.resource[key] = true;
            localStorageService.set("resourceaddedit", localStorage.resource);
        },
        /**
         * [listenSelectArray description] 列表页SelectArray 的变化值
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        listenSelectArray: function(callback) {
            var fn = function(e) {
                if (localStorageService.get("newspaperPreviewSelectArray") !== null) {
                    if (localStorage.selectArray.curPageIsNull === true) {
                        callback();
                    }
                }
            };
            $window.addEventListener("storage", fn, false);
            cacheCallback.push(fn);
        },
        /**
         * [addListenerToSelectArray description]  监听列表页SelectArray上的改变
         * @param {[type]} key [description]
         * @param {[type]} curPageSelectArray [description] 当前页面选择列表
         */
        addListenerToSelectArray: function(key, curPageSelectArray) {
            localStorage.selectArray[key] = true;
            localStorage.selectArray.curPageSelectArray = curPageSelectArray;
            localStorageService.set("newspaperPreviewSelectArray", localStorage.selectArray.curPageSelectArray);
        },
        /**
         * [listenWeixin description] 在微信的列表页添加监听器
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        listenWeixin: function(callback) {
            var fn = function(e) {
                if (localStorageService.get("weixinaddedit") != null) {
                    var localStorage = localStorageService.get("weixinaddedit");
                    if (localStorage.save === true ||
                        localStorage.send === true ||
                        localStorage.directSign === true ||
                        localStorage.rejectionDraft === true ||
                        localStorage.revoke === true
                    ) {
                        callback();
                    }
                }

            };
            $window.addEventListener("storage", fn, false);
            cacheCallback.push(fn);
        },
        /**
         * [addListenerToWeixin description] 微信的编辑页修改监听项的值
         * @param {[type]} key [description]
         */
        addListenerToWeixin: function(key) {
            localStorage.weixin[key] = true;
            localStorageService.set("weixinaddedit", localStorage.weixin);
        },

    };

}]);
