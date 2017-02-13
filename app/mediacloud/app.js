"use strict";
define(function (require, exports, module) {
    var angular = require('angular');
    var asyncLoader = require('angular-async-loader');

    require('angular-ui-router');
    require('ui-bootstrap-tpls');
    require('angular-animate');
    require('w5cValidator');
    require('dateLocale');
    require('localStorage');

    var app = angular.module('app', ['ui.router','ngAnimate','ui.bootstrap','w5c.validator','ngLocale','LocalStorageModule']);

    asyncLoader.configure(app);

    module.exports = app;
});
