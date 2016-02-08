/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
	    .constant("LANGUAGES",["en","de","fr","es","ru","bg","zh","hr","cs","da","nl","et","fi","el","he","hu","it","ja","ko","lv","lt","no","pl","pt","ro","sl","sv","tw","tr"])
        .constant("TIMEZONES", ["US/Hawaii","America/Los_Angeles","America/Denver","America/Chicago","America/New_York","America/Sao_Paulo","Europe/Lisbon","Europe/London","Europe/Berlin","Europe/Madrid","Europe/Paris","Europe/Moscow","Asia/Taipei","Asia/Seoul","Australia/Melbourne"]);
})();