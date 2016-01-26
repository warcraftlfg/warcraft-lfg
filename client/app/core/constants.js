/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
	    .constant("LANGUAGES",["en","de","fr","es","ru","bg","zh","hr","cs","da","nl","et","fi","el","he","hu","it","ja","ko","lv","lt","no","pl","pt","ro","sl","sv","tw","tr"])
        .constant("TIMEZONES", ["","-1200","-1100","-1000","-0900","-0800","-0700","-0600","-0500","-0400","-0330","-0300","-0200","-0100","0000","0100","0200","0300","0330","0400","0430","0500","0530","0545","0600","0700","0800","0900","0930","1000","1100","1200"]);
})();