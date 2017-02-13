"use strict";
angular.module('trsWarningToneDirectiveModule', []).directive('trsWarningTone', ["$window", function($window) {
    return {
        retrict: "A",
        scope: {
            "isPlay": "="
        },
        link: function(scope, iElm, iAttrs, controller) {
            // var audio = $window.document.createElement("audio");
            // var header = audio.parentNode;
            // var existAudio = header.getElementsByTagName("audio");
            // if (scope.isPlay === true) {
            //     if (existAudio.length > 0) {
            //         for (var i = 0; i < existAudio.length; i++) {
            //             header.removeChild(existAudio[i]);
            //         }
            //     }
            //     header.appendChild(audio);
            //     audio.src = "./music/warningTone.mp3";
            //     audio.autoplay = "autoplay";
            // }
            var audio = angular.element("audio");
            var header = iElm.parent().eq(0);
            var existAudio = header.find("audio");
            if (scope.isPlay === true) {
                // if (existAudio.length > 0) {
                //     for (var i = 0; i < existAudio.length; i++) {
                //         header.removeChild(existAudio[i]);
                //     }
                // }
                // header.appendChild(audio);
                // audio.src = "./music/warningTone.mp3";
                // audio.autoplay = "autoplay";
                angular.forEach(existAudio,function(value,index){
                	existAudio.split(existAudio[index],1);
                });
                header.append("audio");
                audio.src = "./music/warningTone.mp3";
            	audio.autoplay = "autoplay";
            }
        }
    };
}]);
