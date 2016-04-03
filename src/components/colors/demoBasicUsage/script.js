'use strict';
angular
  .module('colorsDemo', ['ngMaterial', 'ngMessages'])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('light-green');

    $mdThemingProvider.theme('myTheme')
      .primaryPalette('indigo')
      .accentPalette('pink');
  })
  .controller('BasicDemoCtrl', function ($scope, $mdColorPalette) {
    $scope.colors = Object.keys($mdColorPalette);

    $scope.primary = 'purple';
    $scope.accent = 'green';

    $scope.isPrimary = true;

    $scope.selectTheme = function (color) {
      if ($scope.isPrimary) {
        $scope.primary = color;

        $scope.isPrimary = false;
      }
      else {
        $scope.accent = color;

        $scope.isPrimary = true;
      }
    };

    $scope.themes = [
      {
        name: 'Default theme',
        primary: 'primary',
        accent: 'accent'
      },
      {
        name: 'myTheme theme',
        theme: 'myTheme',
        primary: 'primary',
        accent: 'accent'
      },
      {
        name: 'Purple green theme',
        primary: 'purple',
        accent: 'green'
      }
    ]
  });
