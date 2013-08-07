/**
 * @file MMextra-front.js
 * 
 * Provides my javascript for the front page for switching between map view and list view
 */
(function ($) {
  Drupal.behaviors.MMextra = { 
    attach: function(context,settings) {
//Switching views between map view and list view
      $(".view-frontmap .view-display-id-attachment_2").hide();
      $("#switchviewbutton").attr('value','View List');
      $("#switchviewbutton").click(function(){
        $(".view-frontmap .view-display-id-attachment_1").slideToggle(200);
        $(".view-frontmap #gmap-auto1map-gmap0").slideToggle(200);
        $(".view-frontmap .view-display-id-attachment_2").slideToggle(200);
        return false;
      });
      $("#switchviewbutton").toggle(function(){
        $(this).attr('value','View Map');
        return false;
      },function(){
        $(this).attr('value','View List');
        return false;
      });
 
//showing or hiding the exposed search form
      $("#views-exposed-form-frontmap-page-1").hide();
      $("#searchoptions").click(function(){
        $("#views-exposed-form-frontmap-page-1").slideToggle(200);
        $("#address-entered").focus();
        return false;
      });
      $("#searchoptions").attr('value','Search'); 
      $("#searchoptions").toggle(function(){
        $(this).attr('value','Cancel');
        return false;
      },function(){
        $(this).attr('value','Search');
        return false;
      });


//add div around date filters and add styling to div
      $("#edit-date-filter-wrapper").before(
        '<div class=date-filters-outer>'+
          '<p class=date-filters-label> Search this time range </p>' +
          '<div class=date-filters-inner> </div> </div>');
      $(".date-filters-inner").append($("#edit-date-filter-wrapper"));
      $(".date-filters-inner").append($("#edit-date-filter-1-wrapper"));
      $(".date-filters-outer").css({
        'float':'left',
        'margin':'0.5em 0 0 0'
      });
      $(".date-filters-inner").css({
        'float':'left',
        'border':'solid grey 1px'
      });
      $(".date-filters-outer .date-filters-label").css({
        'margin':'0',
        'font-weight':'bold'
      });
      
//when showing exposed search form, default enter the current date for the "from""
//entry and current date + 1 hr for the "to" entry
      $("#searchoptions").one("click",function(){
        var date = new Date();
        var d  = date.getDate();
        var day = (d < 10) ? '0' + d : d;
        var m = date.getMonth() + 1;
        var month = (m < 10) ? '0' + m : m;
        var yy = date.getYear();
        var year = (yy < 1000) ? yy + 1900 : yy;
        var formatted_date = year + "-" + month + "-" + day;
        $('#edit-date-filter-value-datepicker-popup-0').attr('value',formatted_date);
        var h = date.getHours();
        var hour = (h < 10) ? '0' + h : h;
        var min = date.getMinutes();
        var minutes = (min < 10) ? '0' + min : min;
        var formatted_time = hour + ':' + minutes;
        $('#edit-date-filter-value-timeEntry-popup-1').attr('value',formatted_time);

        var date2 = new Date();
        date2.setHours(date2.getHours()+1);
        var d2  = date2.getDate();
        var day2 = (d2 < 10) ? '0' + d2 : d2;
        var m2 = date2.getMonth() + 1;
        var month2 = (m2 < 10) ? '0' + m2 : m2;
        var yy2 = date2.getYear();
        var year2 = (yy2 < 1000) ? yy2 + 1900 : yy2;
        var formatted_date2 = year2 + "-" + month2 + "-" + day2;
        $('#edit-date-filter-1-value-datepicker-popup-0').attr('value',formatted_date2);
        var h2 = date2.getHours();
        var hour2 = (h2 < 10) ? '0' + h2 : h2;
        var min2 = date2.getMinutes();
        var minutes2 = (min2 < 10) ? '0' + min2 : min2;
        var formatted_time2 = hour2 + ':' + minutes2;
        $('#edit-date-filter-1-value-timeEntry-popup-1').attr('value',formatted_time2);
      });
//if the "from" date is set higher than the "to" date, then adjust "to" date to equal "from" date.
//hmm, i had to set setTimeout to 200 to make this work with the datepicker.  Bad hack!!!
      $('#edit-date-filter-value-datepicker-popup-0').blur(function(){
       setTimeout(function(){
        var fromDateArrayString = $('#edit-date-filter-value-datepicker-popup-0').attr('value').split("-");
        var toDateArrayString = $('#edit-date-filter-1-value-datepicker-popup-0').attr('value').split("-");
        var fromDate=new Date(fromDateArrayString[0],fromDateArrayString[1],fromDateArrayString[2]);
        var toDate=new Date(toDateArrayString[0],toDateArrayString[1],toDateArrayString[2]);
        if(fromDate > toDate){
          $('#edit-date-filter-1-value-datepicker-popup-0').attr('value',$('#edit-date-filter-value-datepicker-popup-0').attr('value'));
        }
       },200);
      });
      
      $('#edit-date-filter-value-timeEntry-popup-1').blur(function(){
        var fromDateArrayString = $('#edit-date-filter-value-datepicker-popup-0').attr('value').split("-");
        fromDateArrayString = fromDateArrayString.concat($('#edit-date-filter-value-timeEntry-popup-1').attr('value').split(":"));
        var toDateArrayString = $('#edit-date-filter-1-value-datepicker-popup-0').attr('value').split("-");
        toDateArrayString = toDateArrayString.concat($('#edit-date-filter-1-value-timeEntry-popup-1').attr('value').split(":"));
        var fromDate=new Date(fromDateArrayString[0],fromDateArrayString[1],fromDateArrayString[2],fromDateArrayString[3],fromDateArrayString[4]);
        var toDate=new Date(toDateArrayString[0],toDateArrayString[1],toDateArrayString[2],toDateArrayString[3],toDateArrayString[4]);
        if(fromDate > toDate){
          $('#edit-date-filter-1-value-timeEntry-popup-1').attr('value',$('#edit-date-filter-value-timeEntry-popup-1').attr('value'));
        }
      });


//change e.g. statement below date and time fields
      $('#edit-date-filter-value-datepicker-popup-0').next('.description').html('E.g. May 1, 2012 is 2012-05-01');
      $('#edit-date-filter-1-value-datepicker-popup-0').next('.description').html('E.g. May 1, 2012 is 2012-05-01');
      $('#edit-date-filter-value-timeEntry-popup-1').next('.description').html('E.g. 12:05 AM is 00:05, 1:05 PM is 13:05');
      $('#edit-date-filter-1-value-timeEntry-popup-1').next('.description').html('E.g. 12:05 AM is 00:05, 1:05 PM is 13:05');

//adding user-entered address field to exposed form
      $("#views-exposed-form-frontmap-page-1 .views-exposed-widgets.clearfix").prepend(
      '<div> <strong> Enter address </strong> <input type="text" id="address-entered" value="Ames, IA" /> <br/>'+
      '&#160 &#160 &#160 &#160 &#160 &#160 &#160 &#160 &#160 &#160 &#160 &#160 &#160 &#160' +
      'search within <input type="text" id="within-miles" value="10" /> miles </div>');
      $("#address-entered").css({
        'width':'200px'
      });
      $("#within-miles").css({
        'width':'20px'
      });
//removing default behavior of submitting form when enter is pressed in the search box
//text fields. for some reason i couldn't have multiple selectors here, and I had
//to do all these separately...'
      $('#address-entered').keypress(function(e){
        if (e.which == 13){
          $('#fake-search').focus();
          return false;
        }
      });
      $('#within-miles').keypress(function(e){
        if (e.which == 13){
          $('#fake-search').focus();
          return false;
        }
      });
      $('#edit-date-filter-value-datepicker-popup-0').keypress(function(e){
        if (e.which == 13){
          $('#fake-search').focus();
          return false;
        }
      });
      $('#edit-date-filter-1-value-datepicker-popup-0').keypress(function(e){
        if (e.which == 13){
          $('#fake-search').focus();
          return false;
        }
      });
      $('#edit-date-filter-value-timeEntry-popup-1').keypress(function(e){
        if (e.which == 13){
          $('#fake-search').focus();
          return false;
        }
      });
      $('#edit-date-filter-1-value-timeEntry-popup-1').keypress(function(e){
        if (e.which == 13){
          $('#fake-search').focus();
          return false;
        }
      });

//add fake search button to exposed form!
      $("#views-exposed-form-frontmap-page-1 .views-exposed-widgets.clearfix").prepend(
      '<div> <input type="submit" id="fake-search" value="Search!" /> </div>');
      $('#fake-search').css({
        'color':'green',
        'border-color':'green',
        'cursor':'pointer',
        'clear':'both',
        'float':'right',
        'margin':'0.5em'
      });
      
//changing select button style on exposed form
      
//showing or hiding individual filters within the search form
//      $("#views-exposed-form-frontmap-page-1 .views-widget").hide();
//      $("#views-exposed-form-frontmap-page-1 .views-exposed-widget>label")
//      .click(function(){
//        $(this).next('.views-widget').slideToggle(200);
//      });
      
//using user-entered address and google geocoder (api 3) to fill the longitude
//and latitude fields in the exposed form
      var geocoder_api3;
      $('#fake-search').click(function(){
        $("#invalid-address").remove();
        var address_entered = $('#address-entered').val();
        var within_miles = $('#within-miles').val();        
        if(!geocoder_api3) {
          geocoder_api3 = new google.maps.Geocoder();
        }
        var geocoderRequest = {
          address: address_entered
        }
        geocoder_api3.geocode(geocoderRequest, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var address_lat = results[0].geometry.location.lat();
            var address_lng = results[0].geometry.location.lng();
            $('#edit-distance-latitude').attr('value',address_lat);
            $('#edit-distance-longitude').attr('value',address_lng);
            $('#edit-distance-search-distance').attr('value',within_miles);
            $('#edit-submit-frontmap').click();
           }
          else{
            $('#address-entered').after('<span id="invalid-address"> Enter valid address </span>');
            $("#invalid-address").css({
              'color':'red' 
            });
          }
        });
        return false;
      });
      
      
      
//centering map on the load based on address entered. setTimeout is used (probably
//incorrectly) with 0 milliseconds to make the change after the map has been loaded.
      setTimeout(function(){
        var address_lat = $('#edit-distance-latitude').attr('value');
        var address_lng = $('#edit-distance-longitude').attr('value');
        tempmap = Drupal.gmap.getMap("auto1map").map
        tempmap.setCenter(new GLatLng(address_lat, address_lng));
//        tempmap.openInfoWindow(tempmap.getCenter(),
//                   document.createTextNode("Start"));
        var blueIcon = new GIcon(G_DEFAULT_ICON);
        blueIcon.image = "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png";
        markerOptions = { icon:blueIcon };
        tempmap.addOverlay(new GMarker(new GLatLng(address_lat, address_lng),markerOptions));
      }, 0);
      
//Remove no results message from attached lists, and remove no results message when
//clicking on #searchoptions button.
      $(".view-display-id-attachment_1 .view-empty").html('');
      $(".view-display-id-attachment_2 .view-empty").html('');
      $("#searchoptions").click(function(){
        $(".view-display-id-page_1 .view-empty").html('');
      });
      
//Numbering the attached list      
      $(".view-display-id-attachment_1 tr").each(function (i) {
        if(i>0){
          $(this).prepend('<td class="event-list-number">'+i+'</td>');
        }
        else{
          $(this).prepend('<td> <strong> Map# </strong> </td>');
        }
      });
    }
  };
}) (jQuery);
