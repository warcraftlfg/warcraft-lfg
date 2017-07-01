(function() {
    'use strict';

    angular
        .module('app.web')
        .controller('WebAboutController', About)
        .controller('WebContactController', Contact)
        .controller('WebPrivacyController', Privacy)
        .controller('WebWidgetController', Widget)
        .controller('WebTermsController', Terms)
        .controller('WebCookiesController', Cookies)
        .controller('WebRoadmapController', Roadmap)
    ;

    About.$inject = ['$scope','socket','$state'];
    function About($scope, socket, $state) {
    }

    Contact.$inject = ['$scope','socket','$state'];
    function Contact($scope, socket, $state) {
    }

    Privacy.$inject = ['$scope','socket','$state'];
    function Privacy($scope, socket, $state) {
    }

    Widget.$inject = ['$scope','socket','$state'];
    function Widget($scope, socket, $state) {
    }


    Terms.$inject = ['$scope','socket','$state'];
    function Terms($scope, socket, $state) {
    }

    Cookies.$inject = ['$scope','socket','$state'];
    function Cookies($scope, socket, $state) {
    }

    Roadmap.$inject = ['$scope','socket','$state'];
    function Roadmap($scope, socket, $state) {
    }
})();