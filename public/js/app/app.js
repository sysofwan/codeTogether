var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'LocalStorageModule']);

app.config(function($routeProvider, $locationProvider) {
    'use strict';

   $routeProvider
       .when('/', {
           controller: 'FrontPageController',
           templateUrl: '/partials/main.html'
       })
       .when('/code/:title', {
           controller: 'CodeEditController',
           templateUrl: '/partials/coding.html'
       })
       .otherwise({redirectTo:'/'});

    $locationProvider.html5Mode(true).hashPrefix('!');
});