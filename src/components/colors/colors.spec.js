describe('md-colors', function () {
  var $compile, $rootScope, $mdColorPalette, supplant;

  beforeEach(module('material.components.colors', function ($mdThemingProvider) {
    $mdThemingProvider.theme('myTheme')
      .primaryPalette('light-blue')
      .accentPalette('yellow');
  }));

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $mdColorPalette = $injector.get('$mdColorPalette');
    supplant = $injector.get('$mdUtil').supplant;
  }));

  describe('directive', function () {

    function createElement(scope, options) {
      var elementString = supplant('<div md-colors="{background: \'{theme}-{palette}{hue}{opacity}\'}" {attrs}></div>', {
        theme: options.theme || 'default',
        palette: options.palette,
        hue: '-' + (options.hue || '500'),
        opacity: '-' + (options.opacity || 1),
        attrs: options.attrs
      });

      return $compile(elementString)(scope);
    }

    function setup(palette, hue, opacity, theme) {
      hue = hue || '500';
      var scope = $rootScope.$new();

      var element = createElement(scope, {
        palette: palette,
        hue: hue,
        opacity: opacity,
        theme: theme
      });

      scope.$apply();

      var color = $mdColorPalette[palette][hue].value;
      return {
        elementBackground: element[0].style.background,
        scope: scope,
        color: opacity ?
          supplant('rgba({0}, {1}, {2}, {3})', [color[0], color[1], color[2], opacity]) :
          supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]])
      }
    }

    it('should accept color palette', function () {
      var build = setup('red');

      expect(build.elementBackground).toContain(build.color);
    });

    describe('two worded palette', function () {
      it('should accept palette spliced with dash', function () {
        var build = setup('blue-grey');

        expect(build.elementBackground).toContain(build.color);
      });

      it('should accept palette formatted as camelCase', function () {
        var scope = $rootScope.$new();
        var element = createElement(scope, {
          palette: 'blueGrey',
          hue: '200',
          opacity: '0.8'
        });

        scope.$apply();

        var color = $mdColorPalette['blue-grey']['200'].value;

        expect(element[0].style.background).toContain(supplant('rgba({0}, {1}, {2}, {3})', [color[0], color[1], color[2], '0.8']));
      });
    });

    it('should accept color palette and hue', function () {
      var build = setup('red', '200');

      expect(build.elementBackground).toContain(build.color);
    });

    it('should accept color palette, hue and opacity', function () {
      var build = setup('red', '200', '0.8');

      expect(build.elementBackground).toContain(build.color);
    });

    describe('themes', function () {
      it('should accept primary palette', inject(function ($mdTheming, $rootScope) {
        var type = 'primary';
        var paletteName = $mdTheming.THEMES['default'].colors[type].name;

        var scope = $rootScope.$new();
        var element = createElement(scope, { palette: type });

        scope.$apply();

        var color = $mdColorPalette[paletteName]['500'].value;

        expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));
      }));

      it('should accept accent palette', inject(function ($rootScope, $mdTheming, $mdColorPalette) {
        var type = 'accent';
        var paletteName = $mdTheming.THEMES['default'].colors[type].name;

        var scope = $rootScope.$new();
        var element = createElement(scope, { palette: type });

        scope.$apply();

        var color = $mdColorPalette[paletteName]['500'].value;

        expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));
      }));

      it('should accept warn palette', inject(function ($rootScope, $mdTheming, $mdColorPalette) {
        var type = 'warn';
        var paletteName = $mdTheming.THEMES['default'].colors[type].name;

        var scope = $rootScope.$new();
        var element = createElement(scope, { palette: type });

        scope.$apply();

        var color = $mdColorPalette[paletteName]['500'].value;

        expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));
      }));

      it('should accept background palette', inject(function ($rootScope, $mdTheming, $mdColorPalette) {
        var type = 'background';
        var paletteName = $mdTheming.THEMES['default'].colors[type].name;

        var scope = $rootScope.$new();
        var element = createElement(scope, { palette: type });

        scope.$apply();

        var color = $mdColorPalette[paletteName]['500'].value;

        expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));
      }));

      describe('custom themes', function () {
        it('should accept theme, color palette, hue and opacity', inject(function ($mdTheming, $rootScope, $mdColorPalette) {
          var type = 'primary';
          var paletteName = $mdTheming.THEMES['myTheme'].colors[type].name;

          var scope = $rootScope.$new();
          var element = createElement(scope, {
            theme: 'myTheme',
            palette: type,
            hue: '500'
          });

          scope.$apply();

          var color = $mdColorPalette[paletteName]['500'].value;

          expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));
        }));
      });
    });

    describe('watched values', function () {
      it('should accept interpolated value', inject(function ($rootScope, $mdColorPalette) {
        var scope = $rootScope.$new();

        scope.color = 'red';

        var color = $mdColorPalette[scope.color]['500'].value;

        var element = createElement(scope, {
          palette: '{{color}}'
        });

        scope.$apply();

        expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));

        scope.color = 'lightBlue-200-0.8';
        scope.$apply();

        color = $mdColorPalette['light-blue']['200'].value;
        expect(element[0].style.background).toContain(supplant('rgba({0}, {1}, {2}, {3})', [color[0], color[1], color[2], '0.8']));
      }));

      it('should accept function', inject(function ($compile, $rootScope, $mdColorPalette) {
        var scope = $rootScope.$new();

        var element = $compile('<div md-colors="{background: color()}"></div>')(scope);

        scope.color = function () {
          return 'lightBlue-200-0.8';
        };

        scope.$apply();

        var color = $mdColorPalette['light-blue']['200'].value;
        expect(element[0].style.background).toContain(supplant('rgba({0}, {1}, {2}, {3})', [color[0], color[1], color[2], '0.8']));
      }));

      it('should accept ternary value', inject(function ($compile, $rootScope, $timeout, $mdColorPalette) {
        var scope = $rootScope.$new();

        scope.test = false;

        var element = $compile('<div md-colors="{background: \'{{test ? \'red\' : \'lightBlue\'}}\'}"></div>')(scope);

        scope.$apply();

        var color = $mdColorPalette['light-blue']['500'].value;
        expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));

        scope.test = true;

        scope.$apply();
        $timeout.flush();

        var red = $mdColorPalette['red']['500'].value;
        expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [red[0], red[1], red[2]]));
      }));

      describe('md-colors-watch', function () {
        it('should not watch if mdColorsWatch attribute is set', function () {
          var scope = $rootScope.$new();

          scope.color = 'red';

          var color = $mdColorPalette[scope.color]['500'].value;

          var element = createElement(scope, {
            palette: '{{color}}',
            attrs: 'md-colors-watch'
          });

          scope.$apply();

          expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));

          scope.color = 'lightBlue-200-0.8';
          scope.$apply();

          expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]))
        });

        it('should not watch if mdColorsWatch attribute is set to false', function () {
          var scope = $rootScope.$new();

          scope.color = 'red';

          var color = $mdColorPalette[scope.color]['500'].value;

          var element = createElement(scope, {
            palette: '{{color}}',
            attrs: 'md-colors-watch="false"'
          });

          scope.$apply();

          expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));

          scope.color = 'lightBlue-200-0.8';
          scope.$apply();

          expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]))
        });

        it('should watch if mdColorsWatch attribute is set to true', function () {
          var scope = $rootScope.$new();

          scope.color = 'red';

          var color = $mdColorPalette[scope.color]['500'].value;

          var element = createElement(scope, {
            palette: '{{color}}',
            attrs: 'md-colors-watch="true"'
          });

          scope.$apply();

          expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));

          scope.color = 'lightBlue-200-0.8';
          scope.$apply();

          color = $mdColorPalette['light-blue']['200'].value;
          expect(element[0].style.background).toContain(supplant('rgba({0}, {1}, {2}, {3})', [color[0], color[1], color[2], '0.8']));
        });
      });
    })
  });

  describe('service', function () {
    it('should apply colors on an element', inject(function ($mdColors) {
      var element = angular.element('<div></div>');
      var scope = $rootScope.$new();

      $mdColors.applyThemeColors(element, scope, '{background: \'red-200\'}');

      scope.$apply();

      var color = $mdColorPalette['red']['200'].value;

      expect(element[0].style.background).toContain(supplant('rgb({0}, {1}, {2})', [color[0], color[1], color[2]]));
    }))
  })
});