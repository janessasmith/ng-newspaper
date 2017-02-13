"use strict";
require.config({
    paths: {
        'angular': './lib/angular/angular',
        'angular-ui-router': './lib/angular/angular-ui-router',
        'ui-bootstrap-tpls': './lib/bootstrap/ui-bootstrap-tpls-0.14.3.min',
        'angular-async-loader': './lib/angular/angular-async-loader',
        'jquery': './lib/jquery/jquery-1.7.2.min',
        'jquery.mCustomScrollbar': './lib/jquery/jquery.mCustomScrollbar.concat.min',
        'angular-animate':'./lib/angular/angular-animate',
        'jquery.form':'./lib/jquery/jquery.form',
        'w5cValidator':'./lib/w5cValidator/w5cValidator.min',
        'dateLocale':'./commons/i18n/dateLocale',
        'localStorage':'./lib/angular/angular-local-storage.min'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'ui-bootstrap-tpls': {
            deps: ['angular']
        },
        'angular-animate':{
            deps: ['angular']
        },
        'w5cValidator':{
            deps: ['angular']
        },
        'dateLocale':{
            deps: ['angular']
        },
        'localStorage':{
            deps:['angular']
        },
        'jquery.mCustomScrollbar': {
            deps: ['jquery']
        },
        'jquery.form':{
            deps: ['jquery']
        }
    }
});

require(['angular','jquery','app-routes'], function(angular) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
        angular.element(document).find('html').addClass('ng-app');
    });
});
