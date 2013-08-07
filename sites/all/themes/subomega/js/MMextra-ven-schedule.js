/**
 * @file MMextra-ven-schedule.js
 * 
 * Provides my javascript for the venue schedule page
 */
(function ($) {
  Drupal.behaviors.MMextra_ven_schedule = { 
    attach: function(context,settings) {
 
      $('#edit-field-event-type-tid [value="All"]').text('All happenings');

    }
  };
}) (jQuery);
