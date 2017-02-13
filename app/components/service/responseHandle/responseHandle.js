  /*
            Create by Baizhiming 2015-11-17
            responseHandle方法：
                参数:response (http请求结果)  isPopup (成功后是否弹出窗口)
                返回值:response (处理后的http请求结果)
                用途:处理http请求的REPORTS返回值，当ISSUCCESS为FALSE时，弹出提示框
            noResponse方法：
                参数:url (请求失败时的跳转地址，填写路由地址。如“manageconfig.rolemanage”)
                返回值:无
                用途:当请求不到服务时，弹出提示框，并跳转到传入参数所指的地址。注：参数可为空。
        */
  "use strict";
  angular.module("trsResponseHandleModule", [])
      .factory("trsResponseHandle", ["$q", "$state", "trsconfirm", "trsspliceString", function($q, $state, trsconfirm, trsspliceString) {
          return {
              responseHandle: function(response, isPopup, isTitle) {
                  var deferred = $q.defer();
                  if (response.status !== undefined && response.status === "-1") {
/*                      trsconfirm.alertType("请求失败", response.message, "warning", false, function() {});
*/                      return null;
                  } else if (response.ISSUCCESS !== undefined && response.ISSUCCESS === "false") {
                      var content;
                      if (isTitle !== undefined) {
                          content = trsspliceString.spliceString(response.REPORTS, isTitle, ",");
                      } else {
                          content = trsspliceString.spliceString(response.REPORTS, "DETAIL", ",");
                      }
                      trsconfirm.alertType(response.TITLE, content, "warning", false, function() {});
                      return null;
                  } else if (response.ISSUCCESS !== undefined && response.ISSUCCESS === "true") {
                      if (isPopup) {
                          trsconfirm.alertType("操作成功", "操作成功", "success", false, function() {

                          });
                      }
                      deferred.resolve("success");
                      return deferred.promise;
                  } else {
                      return response;
                  }

              },
              noResponse: function(url) {
                  trsconfirm.alertType("请求失败", "请检查网络", "warning", false, function() {
                      if (url !== undefined && url !== '') {
                          $state.go(url);
                      }
                  });
              },
              saveResponse: function(data, callback) {
                  //var deferred = $q.defer();
                  if (data.status == "-1" && data.status !== undefined) {
                      trsconfirm.alertType("保存失败", data.message, "warning", false, function() {});
                      return null;
                  } else {
                      callback();
                      /*deferred.resolve(data);
                      return deferred.promise;*/
                  }
              },
              handelPic: function(pic, figure, docPic) {
                  return pic;
              }
          };
      }]);
