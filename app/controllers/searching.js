import Ember from 'ember';

function popularity() {
  return chance.pick(['Great states', 'Awesome states']);
}

function stateList() {
  return chance.states()
    .map(function(state) {
      return {label: state.name, value: state.name, group: popularity()};
    })
    .sortBy('group', 'label');
}

var SearchingController = Ember.Controller.extend({
  simpleSearchContent:   stateList(),
  advancedSearchContent: stateList()
});

export default SearchingController;
