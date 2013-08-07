/**
 * @file MMextra-front.js
 * 
 * Provides my javascript for the front page for switching between map view and list view
 */
(function ($) {
  Drupal.behaviors.MMextra = { 
    attach: function(context,settings) {
      $(".view-frontmap .view-display-id-attachment_2").hide();
      $("#block-tinbully-glue-test1 .content").click(function(){
        $(".view-frontmap .view-display-id-attachment_1").slideToggle(200);
        $(".view-frontmap #gmap-auto1map-gmap0").slideToggle(200);
        $(".view-frontmap .view-display-id-attachment_2").slideToggle(200);
      });
      
      
      $("#views-exposed-form-frontmap-page-1 .views-widget").hide();
      $("#views-exposed-form-frontmap-page-1 .views-exposed-widget>label")
      .click(function(){
        $(this).next('.views-widget').slideToggle(200);
      });
      
    }
  };
}) (jQuery);
