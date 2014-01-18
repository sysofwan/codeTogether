var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    'use strict';

   $routeProvider
       .when('/', {
           controller: 'FrontPageController',
           templateUrl: '/partials/main.html'
       })
       .when('/:documentName', {
           controller: 'CodeEditController',
           templateUrl: '/partials/coding.html'
       })
       .otherwise({redirectTo:'/'});

    $locationProvider.html5Mode(true).hashPrefix('!');
});