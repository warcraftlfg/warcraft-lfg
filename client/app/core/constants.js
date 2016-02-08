/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
	    .constant("LANGUAGES",["en","de","fr","es","ru","bg","zh","hr","cs","da","nl","et","fi","el","he","hu","it","ja","ko","lv","lt","no","pl","pt","ro","sl","sv","tw","tr"])
        .constant("TIMEZONES", ["Australia/Melbourne","Asia/Seoul","Asia/Taipei","Europe/Moscow","Europe/Paris","Europe/Berlin","Europe/Madrid","Europe/London","Europe/Lisbon","America/Sao_Paulo","America/New_York","America/Chicago","America/Denver","America/Los_Angeles","US/Hawaii"]);
})();