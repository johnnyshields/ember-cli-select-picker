import Ember from 'ember';

var ApplicationController = Ember.ObjectController.extend({
  singleContent: [
    {label: 'Foo 1',  value: 'foo1'},
    {label: 'Foo 2',  value: 'foo2'},
    {label: 'Foo 3',  value: 'foo3'},
    {label: 'Foo 4',  value: 'foo4'},
    {label: 'Foo 5',  value: 'foo5'},
    {label: 'Foo 6',  value: 'foo6'},
    {label: 'Foo 7',  value: 'foo7'},
    {label: 'Foo 8',  value: 'foo8'},
    {label: 'Foo 9',  value: 'foo9'},
    {label: 'Foo 10', value: 'foo10'}
  ],

  multipleContent: [
    {label: 'Bar 1',  value: 'bar1',  group: 'Bar Group 1'},
    {label: 'Bar 2',  value: 'bar2',  group: 'Bar Group 1'},
    {label: 'Bar 3',  value: 'bar3',  group: 'Bar Group 1'},
    {label: 'Bar 4',  value: 'bar4',  group: 'Bar Group 1'},
    {label: 'Bar 5',  value: 'bar5',  group: 'Bar Group 1'},
    {label: 'Bar 6',  value: 'bar6',  group: 'Bar Group 2'},
    {label: 'Bar 7',  value: 'bar7',  group: 'Bar Group 2'},
    {label: 'Bar 8',  value: 'bar8',  group: 'Bar Group 2'},
    {label: 'Bar 9',  value: 'bar9',  group: 'Bar Group 3'},
    {label: 'Bar 10', value: 'bar10', group: 'Bar Group 3'}
  ]
});

export default ApplicationController;
