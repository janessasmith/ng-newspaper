angular.module('templates-main', ['../app/components/htmlTemplates/treeTemplate.html']);

angular.module("../app/components/htmlTemplates/treeTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../app/components/htmlTemplates/treeTemplate.html",
    "<ul {{options.ulClass}}>\n" +
    "    <li ng-repeat=\"node in node.{{options.nodeChildren}} | filter:filterExpression:filterComparator {{options.orderBy}}\" ng-class=\"headClass(node)\" {{options.liClass}} set-node-to-data>\n" +
    "        <div ng-mouseenter=\"treeEyes(node,true,$even)\" ng-mouseleave=\"treeEyes(node,false,$even)\">\n" +
    "            <i class=\"tree-branch-head\" ng-class=\"iBranchClass()\" ng-click=\"selectNodeHead(node)\"></i>\n" +
    "            <i class=\"tree-leaf-head {{options.iLeafClass}}\"></i>\n" +
    "            <div class=\"tree-label {{options.labelClass}}\" ng-class=\"[selectedClass(), unselectableClass()]\" ng-click=\"selectNodeLabel(node)\" tree-transclude></div>\n" +
    "        </div>\n" +
    "        <treeitem ng-show=\"nodeExpanded()\"></treeitem>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
