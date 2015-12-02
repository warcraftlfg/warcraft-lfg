/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
	    .constant("LANGUAGES",["en","de","fr","es","ru","bg","zh","hr","cs","da","nl","et","fi","el","he","hu","it","ja","ko","lv","lt","no","pl","pt","ro","sl","sv","tw","tr"])
        .constant("TIMEZONES", ["","-12.0","-11.0","-10.0","-9.0","-8.0","-7.0","-6.0","-5.0","-4.0","-3.5","-3.0","-2.0","-1.0","0.0","1.0","2.0","3.0","3.5","4.0","4.5","5.0","5.5","5.75","6.0","7.0","8.0","9.0","9.5","10.0","11.0","12.0"]);
})();