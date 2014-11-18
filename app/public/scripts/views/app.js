define([
  'jquery',
  'underscore',
  'backbone',
  '../models/professor'
], function($, _, Backbone, ProfessorModel) {
  
  var App = Backbone.View.extend({

    el: '#appcontainer',

    initialize: function() {
      console.log('hello world');
    },

    events: {
      'click #form-submit': 'handleSubmit'
    },

    handleSubmit: function( ev ) {
      event.preventDefault();
      var term = $('#term').val();
      var dept = $('#dept').val();
      var url  = '/api/courses/' + term + '/' + dept;

      $.get(url, function( data ) {
        var content = _.template( $('#professors-template').html(), { Professors: data });
        $('#results').html(content);
      });
    }

  });
  
  return App;
});

    
