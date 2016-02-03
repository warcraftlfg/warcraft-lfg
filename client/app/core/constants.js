/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
	    .constant("LANGUAGES",["en","de","fr","es","ru","bg","zh","hr","cs","da","nl","et","fi","el","he","hu","it","ja","ko","lv","lt","no","pl","pt","ro","sl","sv","tw","tr"])
        .constant("TIMEZONES", ["America/Chicago","America/Los_Angeles","America/New_York","America/Denver","America/Sao_Paulo","Australia/Melbourne","Asia/Seoul","Asia/Taipei","Europe/London","Europe/Paris","Europe/Berlin","Europe/Madrid","Europe/Lisbon","Europe/Moscow"]);
})();