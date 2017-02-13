/**
 * Created by bzm on 2015/9/21.
 */
'use strict';
angular.module("pieceMgr.multiDocEdit", []).directive("trsFragDocsEdit", ["$validation", "$compile", function($validation, $compile) {
    return {
        restrict: "E",
        templateUrl: "./editingCenter/website/fragmentManagement/multiDoc/multiDoc_doc_edit_tpl.html",
        replace: true,
        scope: {
            editJson: "@",
            editJsonNew: "=",
            widgetParams: "=",
            required: "@"
        },
        link: function(scope, element, attrs) {
            var editJson = JSON.parse(scope.editJson);
            scope.editJsonTemp = editJson;
            var targetDiv = element.find('all');
            var singleDoc = '<trs-frag-single-doc widget-params="widgetParams" required="' + scope.required + '" json-obj="editJsonTemp"></trs-frag-single-doc>';
            singleDoc = $compile(singleDoc)(scope);
            $(targetDiv).html(singleDoc);
            scope.cancel = function() {
                scope.$parent.$close();
            };
            scope.confirm = function() {
                scope.editJsonNew = scope.editJsonTemp;
                setTimeout(function() {
                    scope.$parent.$close();
                }, 500);
            };
            /*  scope.$watch("editJsonTemp",function(newValue,oldValue){
                  scope.oldValue = oldValue;
                  console.log(scope.oldValue);
              })*/
        }
    };
}]);
