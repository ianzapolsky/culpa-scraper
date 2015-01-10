define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone) {
  
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
      $('#results').html('<div class=professor"><p>Loading ...</p></div>');
      var term = $('#term').val();
      var dept = $('#dept').val();
      var url  = '/api/courses/' + term + '/department/' + dept;

      $.get(url, function( data ) {
        var content = _.template( $('#professors-template').html(), { Professors: data });
        $('#results').html(content);
      });
    }

  });
  
  return App;
});

    
