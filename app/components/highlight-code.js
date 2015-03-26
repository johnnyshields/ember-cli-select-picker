import Ember from 'ember';

var HighlightCodeComponent = Ember.Component.extend({
  tagName: 'pre',
  didInsertElement: function() {
    hljs.configure({useBR: true});
    var html = this.$().html().trim();
    html = hljs.highlight(this.get('lang'), html).value;
    this.$().html(html);
  }
});

export default HighlightCodeComponent;
