/* jshint ignore:start */

/* jshint ignore:end */

define('test-select-picker/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'test-select-picker/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('test-select-picker/components/select-picker', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var I18n = Ember['default'].I18n && Ember['default'].I18n.TranslateableProperties || {};

  var SelectPickerComponent = Ember['default'].Component.extend(I18n, {
    classNames: ["select-picker"],
    selectAllLabel: "All",
    selectNoneLabel: "None",
    advancedSearch: false,
    showDropdown: false,

    didInsertElement: function didInsertElement() {
      $(document).on("click", (function (e) {
        if (this.get("keepDropdownOpen")) {
          this.set("keepDropdownOpen", false);
          return;
        }
        if (!$.contains(this.element, e.target)) {
          this.set("showDropdown", false);
        }
      }).bind(this));
    },

    menuButtonId: (function () {
      return this.get("elementId") + "-dropdown-menu";
    }).property("elementId"),

    selectionAsArray: function selectionAsArray() {
      var selection = this.get("selection");
      if (Ember['default'].isArray(selection)) {
        return selection;
      } else if (Ember['default'].isNone(selection)) {
        return [];
      } else {
        return [selection];
      }
    },

    contentPathName: function contentPathName(pathName) {
      return this.getWithDefault(pathName, "").substr(8);
    },

    getByContentPath: function getByContentPath(obj, pathName) {
      return Ember['default'].get(obj, this.contentPathName(pathName));
    },

    contentList: (function () {
      var lastGroup;
      // Ember.Select does not include the content prefix for optionGroupPath
      var groupPath = this.get("optionGroupPath");
      // Ember.Select expects optionLabelPath and optionValuePath to have a
      // `content.` prefix
      var labelPath = this.contentPathName("optionLabelPath");
      var valuePath = this.contentPathName("optionValuePath");
      // selection is either an object or an array of object depending on the
      // value of the multiple property. Ember.Select maintains the value
      // property.
      var selection = this.selectionAsArray();
      var searchMatcher = this.makeSearchMatcher();

      var result = this.get("content").map(function (item) {
        var label = Ember['default'].get(item, labelPath);
        var value = Ember['default'].get(item, valuePath);
        var group = groupPath ? Ember['default'].get(item, groupPath) : null;
        if (group === lastGroup) {
          group = null;
        } else {
          lastGroup = group;
        }
        return {
          item: item,
          group: group,
          label: label,
          value: value,
          selected: selection.contains(item)
        };
      }).filter(function (item) {
        return searchMatcher(item.group) || searchMatcher(item.label);
      });

      if (result[0]) {
        result[0].first = true;
      }

      return result;
    }).property("selection.@each", "content.@each", "optionGroupPath", "optionLabelPath", "optionValuePath", "searchFilter"),

    selectedContentList: Ember['default'].computed.filterBy("contentList", "selected"),
    unselectedContentList: Ember['default'].computed.setDiff("contentList", "selectedContentList"),

    makeSearchMatcher: function makeSearchMatcher() {
      var searchFilter = this.get("searchFilter");
      if (Ember['default'].isEmpty(searchFilter)) {
        return function () {
          return true; // Show all
        };
      } else if (this.get("advancedSearch")) {
        searchFilter = new RegExp(searchFilter.split("").join(".*"), "i");
        return function (item) {
          return item && searchFilter.test(item);
        };
      } else {
        return function (item) {
          return item && item.toLowerCase().indexOf(searchFilter.toLowerCase()) >= 0;
        };
      }
    },

    selectionSummary: (function () {
      var selection = this.selectionAsArray();
      switch (selection.length) {
        case 0:
          return this.get("prompt") || "";
        case 1:
          return this.getByContentPath(selection[0], "optionValuePath");
        default:
          return selection.length + " items selected";
      }
    }).property("selection.@each"),

    toggleSelection: function toggleSelection(value) {
      var selection = this.get("selection");
      if (selection.contains(value)) {
        selection.removeObject(value);
      } else {
        selection.pushObject(value);
      }
    },

    actions: {
      selectItem: function selectItem(selected) {
        this.set("keepDropdownOpen", true);
        if (!this.get("disabled")) {
          if (this.get("multiple")) {
            this.toggleSelection(selected.item);
          } else {
            this.set("selection", selected.item);
          }
        }
        return true;
      },

      showHide: function showHide() {
        this.toggleProperty("showDropdown");
      },

      selectAllNone: function selectAllNone(listName) {
        this.get(listName).forEach((function (item) {
          this.send("selectItem", item);
        }).bind(this));
      }
    }

  });

  exports['default'] = SelectPickerComponent;

});
define('test-select-picker/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var ApplicationController = Ember['default'].ObjectController.extend({
    singleContent: [{ label: "Foo 1", value: "foo1" }, { label: "Foo 2", value: "foo2" }, { label: "Foo 3", value: "foo3" }, { label: "Foo 4", value: "foo4" }, { label: "Foo 5", value: "foo5" }, { label: "Foo 6", value: "foo6" }, { label: "Foo 7", value: "foo7" }, { label: "Foo 8", value: "foo8" }, { label: "Foo 9", value: "foo9" }, { label: "Foo 10", value: "foo10" }],

    multipleContent: [{ label: "Bar 1", value: "bar1", group: "Bar Group 1" }, { label: "Bar 2", value: "bar2", group: "Bar Group 1" }, { label: "Bar 3", value: "bar3", group: "Bar Group 1" }, { label: "Bar 4", value: "bar4", group: "Bar Group 1" }, { label: "Bar 5", value: "bar5", group: "Bar Group 1" }, { label: "Bar 6", value: "bar6", group: "Bar Group 2" }, { label: "Bar 7", value: "bar7", group: "Bar Group 2" }, { label: "Bar 8", value: "bar8", group: "Bar Group 2" }, { label: "Bar 9", value: "bar9", group: "Bar Group 3" }, { label: "Bar 10", value: "bar10", group: "Bar Group 3" }]
  });

  exports['default'] = ApplicationController;

});
define('test-select-picker/initializers/app-version', ['exports', 'test-select-picker/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('test-select-picker/initializers/export-application-global', ['exports', 'ember', 'test-select-picker/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('test-select-picker/router', ['exports', 'ember', 'test-select-picker/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {});

  exports['default'] = Router;

});
define('test-select-picker/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","single-select-example");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Single Selection:");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","multiple-select-example");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Multiple Selections:");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),2,3);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [2]),2,3);
        inline(env, morph0, context, "select-picker", [], {"content": get(env, context, "singleContent"), "optionLabelPath": "content.label", "optionValuePath": "content.value"});
        inline(env, morph1, context, "select-picker", [], {"content": get(env, context, "multipleContent"), "multiple": "true", "prompt": "Select one or more options", "advancedSearch": "true", "optionGroupPath": "group", "optionLabelPath": "content.label", "optionValuePath": "content.value"});
        return fragment;
      }
    };
  }()));

});
define('test-select-picker/templates/components/select-picker', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","btn-group select-all-none btn-block");
          dom.setAttribute(el2,"role","group");
          dom.setAttribute(el2,"aria-label","Select all or none");
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"type","button");
          dom.setAttribute(el3,"class","btn btn-default btn-xs");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"type","button");
          dom.setAttribute(el3,"class","btn btn-default btn-xs");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element3 = dom.childAt(fragment, [1, 1]);
          var element4 = dom.childAt(element3, [1]);
          var element5 = dom.childAt(element3, [3]);
          var morph0 = dom.createMorphAt(element4,-1,-1);
          var morph1 = dom.createMorphAt(element5,-1,-1);
          element(env, element4, context, "action", ["selectAllNone", "unselectedContentList"], {});
          content(env, morph0, context, "selectAllLabel");
          element(env, element5, context, "action", ["selectAllNone", "selectedContentList"], {});
          content(env, morph1, context, "selectNoneLabel");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createElement("li");
              dom.setAttribute(el0,"class","divider");
              dom.setAttribute(el0,"role","presentation");
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"class","dropdown-header");
            dom.setAttribute(el1,"role","presentation");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            var morph1 = dom.createMorphAt(dom.childAt(fragment, [2]),-1,-1);
            block(env, morph0, context, "unless", [get(env, context, "item.first")], {}, child0, null);
            content(env, morph1, context, "item.group");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"role","presentation");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"role","menuitem");
          dom.setAttribute(el2,"tabindex","-1");
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
          var element0 = dom.childAt(fragment, [2]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element1, [2]);
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          var morph1 = dom.createMorphAt(element1,0,1);
          set(env, context, "item", blockArguments[0]);
          block(env, morph0, context, "if", [get(env, context, "item.group")], {}, child0, null);
          element(env, element0, context, "bind-attr", [], {"class": "item.selected:selected"});
          element(env, element1, context, "action", ["selectItem", get(env, context, "item")], {});
          content(env, morph1, context, "item.label");
          element(env, element2, context, "bind-attr", [], {"class": ":glyphicon :glyphicon-ok :check-mark item.selected::hidden"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-default dropdown-toggle");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"aria-expanded","true");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"clas","pull-left");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","caret");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","dropdown-menu");
        dom.setAttribute(el2,"role","menu");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element, content = hooks.content, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var element6 = dom.childAt(fragment, [2]);
        var element7 = dom.childAt(element6, [1]);
        var element8 = dom.childAt(element6, [3]);
        if (this.cachedFragment) { dom.repairClonedNode(element8,[3]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        var morph1 = dom.createMorphAt(dom.childAt(element7, [1]),-1,-1);
        var morph2 = dom.createMorphAt(dom.childAt(element8, [1]),0,1);
        var morph3 = dom.createMorphAt(element8,2,3);
        var morph4 = dom.createMorphAt(element8,3,4);
        inline(env, morph0, context, "view", ["select"], {"class": "native-select visible-xs-inline", "content": get(env, context, "content"), "selection": get(env, context, "selection"), "value": get(env, context, "value"), "title": get(env, context, "title"), "prompt": get(env, context, "prompt"), "multiple": get(env, context, "multiple"), "disabled": get(env, context, "disabled"), "optionGroupPath": get(env, context, "optionGroupPath"), "optionLabelPath": get(env, context, "optionLabelPath"), "optionValuePath": get(env, context, "optionValuePath")});
        element(env, element6, context, "bind-attr", [], {"class": ":bs-select :btn-group :dropdown :hidden-xs disabled:disabled showDropdown:open"});
        element(env, element7, context, "bind-attr", [], {"id": get(env, context, "menuButtonId")});
        element(env, element7, context, "bind-attr", [], {"disabled": get(env, context, "disabled")});
        element(env, element7, context, "action", ["showHide"], {});
        content(env, morph1, context, "selectionSummary");
        element(env, element8, context, "bind-attr", [], {"aria-labelledby": get(env, context, "menuButtonId")});
        inline(env, morph2, context, "input", [], {"type": "text", "class": "search-filter form-control", "value": get(env, context, "searchFilter"), "action": "preventClosing", "on": "focus"});
        block(env, morph3, context, "if", [get(env, context, "multiple")], {}, child0, null);
        block(env, morph4, context, "each", [get(env, context, "contentList")], {}, child1, null);
        return fragment;
      }
    };
  }()));

});
define('test-select-picker/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('test-select-picker/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('test-select-picker/tests/helpers/resolver', ['exports', 'ember/resolver', 'test-select-picker/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('test-select-picker/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('test-select-picker/tests/helpers/start-app', ['exports', 'ember', 'test-select-picker/app', 'test-select-picker/router', 'test-select-picker/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('test-select-picker/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('test-select-picker/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('test-select-picker/tests/test-helper', ['test-select-picker/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('test-select-picker/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('test-select-picker/config/environment', ['ember'], function(Ember) {
  var prefix = 'test-select-picker';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("test-select-picker/tests/test-helper");
} else {
  require("test-select-picker/app")["default"].create({"name":"test-select-picker","version":"0.0.0.fcc44402"});
}

/* jshint ignore:end */
//# sourceMappingURL=test-select-picker.map