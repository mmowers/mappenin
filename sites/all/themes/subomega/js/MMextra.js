/**
 * @file MMextra.js
 * 
 * Provides my javascript for the front page for switching between map view and list view
 */
(function ($) {
  Drupal.behaviors.MMextra = { 
    attach: function(context,settings) {
      //appending page title to header section.
      $("h1#page-title").appendTo($("#section-header"));
      
      //prepending menus and gobutton to page and hiding menus.
      $("#block-fblikebutton-fblikebutton-static-block, #block-fblikebutton-fblikebutton-dynamic-block, #block-tinbully-glue-fblikebutton-custom-block").prependTo($("#page"));
      $("#block-menu-menu-go, #block-menu-menu-go-venue, #block-menu-menu-go-anonymous").prependTo($("#page"));
      $("#block-tinbully-glue-gobutton").prependTo($("#page"));
      $("#block-menu-menu-go, #block-menu-menu-go-venue, #block-menu-menu-go-anonymous").hide();
      
      //when gobutton is pressed, show menus etc.
      $("#gobutton").toggle(function(){
        $("#block-menu-menu-go, #block-menu-menu-go-venue, #block-menu-menu-go-anonymous").show(0,function(){
          $("#block-menu-menu-go, #block-menu-menu-go-venue, #block-menu-menu-go-anonymous").animate({
            right: '0'
          },100,function(){
            $("#gobutton").attr('value','>');
            $("#gobutton").css({
              'color': 'darkgreen'
            });
          });        
        });
        return false;
      },function(){
        $("#block-menu-menu-go, #block-menu-menu-go-venue, #block-menu-menu-go-anonymous").animate({
          right: '-200px'
        },100,function(){
          $("#block-menu-menu-go, #block-menu-menu-go-venue, #block-menu-menu-go-anonymous").hide(0,function(){
            $("#gobutton").attr('value','<');
            $("#gobutton").css({
              'color': 'darkgreen'
            });           
          });          
        });
        return false;
      });
      
      //trigger the gobutton click when a menu selection is made
      $('#block-menu-menu-go a, #block-menu-menu-go-venue a, #block-menu-menu-go-anonymous a').click(function(e){
        $("#gobutton").click();
        e.stopPropagation();
      });
      
      //when clicking on the li containing the navigation link, click that link
      $('#block-menu-menu-go li, #block-menu-menu-go-venue li, #block-menu-menu-go-anonymous li').click(function(e){
        $("#gobutton").click();
        var url = $(this).children('a').attr('href');
        window.location=url;
//        e.preventDefault();
      });
      
      //all pics in common-pic-list link to username
      $('.common-pic-list .views-row img').click(function(){
        if($(this).closest('.views-row').find('a').length){
          $(this).animate({opacity: '0.5'},100).animate({opacity: '1'},100);
          window.location = $(this).closest('.views-row').find('a').attr('href');          
        }
      });
      
      //add text above my schedule to inform users that friends can see their schedule
      $(".view-id-my_schedule").before("<p class='view-description-text'> Events on your schedule can only be seen by you, your friends, and the event's host </p>")

      //add text above friends schedule
      $(".view-id-friends_schedule").before("<p class='view-description-text'> Your friends are attending these events </p>")

      //add text above faves schedule
      $(".view-id-faves_schedule").before("<p class='view-description-text'> These events are happening at your favorite venues </p>")

      //this is pretty stupid, but i can't figure out quick enough how to change certain page titles
      $('.page-profile-individual #page-title, .page-profile-venue #page-title').text('Edit Profile');
      
      //reformat the pager slightly because it looked kinda dumb
      var previous_str = $('a[title="Go to previous page"]').text();
      var prev_str = previous_str.replace('previous','prev');
      $('a[title="Go to previous page"]').text(prev_str);
      
      //Rearranging node output
      //I couldn't figure out how to take convert &#039; into an apostraphe in the php so i did this.  yuck!
      $('article.node-event .submitted a').text($('article.node-event .submitted a').text().replace("&#039;","'"));
      $('article.node-event .location.vcard').before($('article.node-event .submitted a'));
      $('article.node-event footer.submitted').hide();
      
      //all map links will open a new tab or window
      $('.location.map-link a').attr('target','_blank');
      
      //when like button is clicked, make visible the overflow
//      $("#block-fblikebutton-fblikebutton-static-block, #block-fblikebutton-fblikebutton-dynamic-block, #block-tinbully-glue-fblikebutton-custom-block").click(function(){
//        $(this).css({
//          'width': 'auto',
//          'height': 'auto'
//        });
//      });
//      $("a.connect_widget_like_button").click(function(){
//        $("#block-fblikebutton-fblikebutton-static-block, #block-fblikebutton-fblikebutton-dynamic-block, #block-tinbully-glue-fblikebutton-custom-block").css({
//            'width': 'auto',
//            'height': 'auto'
//        });        
//      });
      
    }
  };
}) (jQuery);
