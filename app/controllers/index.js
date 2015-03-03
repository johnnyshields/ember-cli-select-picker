import Ember from 'ember';

function neighborhood() {
  return chance.pick(['East side', 'West side']);
}

var IndexController = Ember.ObjectController.extend({
  singleContent: (function() {
    return chance.unique(chance.street, 10)
      .map(function(street) {
        return {label: street, value: street};
      });
  })(),
  multipleContent: (function() {
    return chance.unique(chance.street, 10)
      .map(function(street) {
        return {label: street, value: street, group: neighborhood()};
      })
      .sortBy('group');
  })()
});

export default IndexController;
