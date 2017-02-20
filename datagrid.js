/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Aditya Sharat
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * Use this directive to convert drop downs into chosen drop downs.
 * http://harvesthq.github.io/chosen/
 * http://adityasharat.github.io/angular-chosen/
 */
(function(angular) {
  var AngularChosen = angular.module('angular.chosen', []);


  function chosen($timeout) {
    var EVENTS, scope, linker, watchCollection;

    /*
     * List of events and the alias used for binding with angularJS
     */
    EVENTS = [{
      onChange: 'change'
    }, {
      onReady: 'chosen:ready'
    }, {
      onMaxSelected: 'chosen:maxselected'
    }, {
      onShowDropdown: 'chosen:showing_dropdown'
    }, {
      onHideDropdown: 'chosen:hiding_dropdown'
    }, {
      onNoResult: 'chosen:no_results'
    }];

    /*
     * Items to be added in the scope of the directive
     */
    scope = {
      options: '=', // the options array
      ngModel: '=', // the model to bind to,,
      ngDisabled: '='
    };

    /*
     * initialize the list of items
     * to watch to trigger the chosen:updated event
     */
    watchCollection = [];
    Object.keys(scope).forEach(function(scopeName) {
      watchCollection.push(scopeName);
    });

    /*
     * Add the list of event handler of the chosen
     * in the scope.
     */
    EVENTS.forEach(function(event) {
      var eventNameAlias = Object.keys(event)[0];
      scope[eventNameAlias] = '=';
    });

    /* Linker for the directive */
    linker = function($scope, iElm, iAttr) {
      var maxSelection = parseInt(iAttr.maxSelection, 10),
        searchThreshold = parseInt(iAttr.searchThreshold, 10);

      if (isNaN(maxSelection) || maxSelection === Infinity) {
        maxSelection = undefined;
      }

      if (isNaN(searchThreshold) || searchThreshold === Infinity) {
        searchThreshold = undefined;
      }

      var allowSingleDeselect = iElm.attr('allow-single-deselect') !== undefined ? true : false;
      var noResultsText = iElm.attr('no-results-text') !== undefined ? iAttr.noResultsText : "No results found.";
      var disableSearch = iElm.attr('disable-search') !== undefined ? JSON.parse(iAttr.disableSearch) : false;
      var placeholderTextSingle = iElm.attr('placeholder-text-single') !== undefined ? iAttr.placeholderTextSingle : "Select an Option";
      var placeholderTextMultiple = iElm.attr('placeholder-text-multiple') !== undefined ? iAttr.placeholderTextMultiple : "Select Some Options";
      var displayDisabledOptions = iElm.attr('display-disabled-options') !== undefined ? JSON.parse(iAttr.displayDisabledOptions) : true;
      var displaySelectedOptions = iElm.attr('display-selected-options') !== undefined ? JSON.parse(iAttr.displaySelectedOptions) : true;

      iElm.chosen({
        width: '100%',
        max_selected_options: maxSelection,
        disable_search_threshold: searchThreshold,
        search_contains: true,
        allow_single_deselect: allowSingleDeselect,
        no_results_text: noResultsText,
        disable_search: disableSearch,
        placeholder_text_single: placeholderTextSingle,
        placeholder_text_multiple: placeholderTextMultiple,
        display_disabled_options: displayDisabledOptions,
        display_selected_options: displaySelectedOptions
      });

      iElm.on('change', function() {
        iElm.trigger('chosen:updated');
      });

      $scope.$watchGroup(watchCollection, function() {
        $timeout(function() {
          iElm.trigger('chosen:updated');
        }, 100);
      });

      // assign event handlers
      EVENTS.forEach(function(event) {
        var eventNameAlias = Object.keys(event)[0];

        if (typeof $scope[eventNameAlias] === 'function') { // check if the handler is a function
          iElm.on(event[eventNameAlias], function(event) {
            $scope.$apply(function() {
              $scope[eventNameAlias](event);
            });
          }); // listen to the event triggered by chosen
        }
      });
    };

    // return the directive
    return {
      name: 'chosen',
      scope: scope,
      restrict: 'A',
      link: linker
    };
  }
  AngularChosen.directive('chosen', ['$timeout', chosen]);
}(angular));
angular.module('my-app', ['angular.chosen'])
  .directive('tableGrid', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      scope: {
        table: '=',
        config: "=",
        dropmenu: "=",
        df: "="
      },
      templateUrl: 'datagrid.html',


      link: function(scope, elem, attr, ngModelCtrl) {

        scope.df.validate = function(data) {
          scope.df.dterror = data ? data.dterror : null;
          scope.df.dtmessage = data ? data.dtmessage : null;
          for (var i = 0; i <= 15; i++) {
            scope.df['dt' + i] = data ? data['dt' + i] : null;
          }
        };



        scope.editHandler = function(index) {
          console.clear();
          $(".ui-dialog-title").text(scope.config.config.dialogTitle + andMore());
          scope.isNew = index < 0 ? true : false;
          if (index >= 0) {
            scope.df.key = scope.table[scope.config.config.pk][index];
          }
          angular.forEach(scope.config.table, function(value, key) {
            if (value.type === 'text' || value.type === 'date' || value.type === 'textarea' || value.type === 'label')
              scope.df[value.map] = index >= 0 ? scope.table[value.map][index] : null;
            else if (value.type === 'drop')
              scope.df[value.map] = index >= 0 ? scope.dropmenu[value.drop][getDropIndex(scope.dropmenu[value.drop], scope.table[value.map][index])] : null; //getDropIndex(scope.dropmenu[value.drop],scope.table[value.map][index]);
          });

          $(".dialog-" + scope.config.config.id).dialog('open');

        };


        scope.onSubmit = function() {
          console.clear();
          if (scope.rm)
            scope.config.config.remove();
          else
            scope.config.config.save();
        };

        scope.$watch('df.dterror', function() {
          $timeout(function() {
            scope.df.dterror = null;
          }, 5000);
        }, true);
        scope.$watch('df.dtmessage', function() {
          $timeout(function() {
            scope.df.dtmessage = null;
          }, 5000);
        }, true);


        scope.closeDialog = function() {
          $(".dialog-" + scope.config.config.id).dialog('close');
        };
        // Specify the options for the dialog
        var dialogOptions = {
          autoOpen: false,
          title: scope.config.config.dialogTitle,
          width: scope.config.config.dialogWidth || 600,
          height: scope.config.config.dialogHeight || 600,
          modal: true,
          show: '',
          hide: '',
          draggable: true,
          resizable: true,
          closeOnEscape: false,
          close: function() {
            console.log('closing...');
            scope.df.validate(null);

          },
          open: function(event, ui) {

          }
        };
        $timeout(function() {
          $(".dialog-" + scope.config.config.id).dialog(dialogOptions);
        }, 0);

        var getDropIndex = function(arr, val) {
          var j;
          if (arr)
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].value === val) {
                j = i;
                break;
              }
            }
          return j;
        };
        var andMore = function() {
          var forMore = "";
          if (scope.df.sid && scope.df.sid.length > 0) {
            forMore = " for " + scope.df.fullName;
            if (scope.df.sid.length > 1) {
              forMore += " and " + (scope.df.sid.length - 1) + " more ...";
            }
          }
          return forMore;
        }

      }
    };
  }])
  .directive('datepicker', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        $(function() {
          element.datepicker({
            dateFormat: 'mm/dd/yy',
            onSelect: function(date) {
              scope.$apply(function() {
                ngModelCtrl.$setViewValue(date);
              });
            }
          });
        });
      }
    };
  });