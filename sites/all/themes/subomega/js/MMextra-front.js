/**
 * @file MMextra-front.js
 * 
 * Provides my javascript for the front page for switching between map view and list view
 */
(function ($) {
  Drupal.behaviors.MMextra_front = { 
    attach: function(context,settings) {
      //hiding these things at the very top because they were popping up on the screen for a second
      $("#views-exposed-form-frontmap-page-1").hide();
      $("#section-content").hide();
      //still show messages if there are any
      $("#section-content").before('<div id="frontmap-messages-outer"></div>');
      $('#messages').appendTo($("#frontmap-messages-outer"));
      setTimeout(function(){$('#messages').animate({bottom: '500px'},2000)}, 8000);

      //The following array is needed for matching month name to month number when using getMonth
      var getMonthArray = new Array();
      getMonthArray[0] = 'Jan';
      getMonthArray[1] = 'Feb';
      getMonthArray[2] = 'Mar';
      getMonthArray[3] = 'Apr';
      getMonthArray[4] = 'May';
      getMonthArray[5] = 'Jun';
      getMonthArray[6] = 'Jul';
      getMonthArray[7] = 'Aug';
      getMonthArray[8] = 'Sep';
      getMonthArray[9] = 'Oct';
      getMonthArray[10] = 'Nov';
      getMonthArray[11] = 'Dec';

      //The following array is needed for matching day name to day number when using getDay
      var getDayArray = new Array();
      getDayArray[0] = 'Sun';
      getDayArray[1] = 'Mon';
      getDayArray[2] = 'Tue';
      getDayArray[3] = 'Wed';
      getDayArray[4] = 'Thu';
      getDayArray[5] = 'Fri';
      getDayArray[6] = 'Sat';

      
      //The following array is needed for matching month name to month number on the original month select box
      var monthArray = new Array();
      monthArray['Jan'] = 1;
      monthArray['Feb'] = 2;
      monthArray['Mar'] = 3;
      monthArray['Apr'] = 4;
      monthArray['May'] = 5;
      monthArray['Jun'] = 6;
      monthArray['Jul'] = 7;
      monthArray['Aug'] = 8;
      monthArray['Sep'] = 9;
      monthArray['Oct'] = 10;
      monthArray['Nov'] = 11;
      monthArray['Dec'] = 12;

      //function for converting 24 hour format into 12 hour format. hour_24 should
      //be the 24-hour number, and an array with the 12-hour number and "AM" or "PM" is returned
      function time_convert_24_12(hour_24){
        var hour = hour_24*1;
        var arrayOut = [];
        if (hour < 12){
          arrayOut['ampm'] = "AM";
        }
        else{
          arrayOut['ampm'] = "PM";
        }
        if (hour == 0){
          arrayOut['hour'] = 12;
        }
        else if (hour > 12){
          arrayOut['hour'] = hour - 12;
        }
        else{
          arrayOut['hour'] = hour;
        }
        
        return arrayOut;
      }

      
      //function for converting 12 hour format into 24 hour format. hour_12 should
      //be the 12-hour number, am_pm should be "AM" or "PM", and the 24-hour number is returned
      function time_convert_12_24(hour_12, am_pm){
        var hour = hour_12*1;
        var hourOut=0;
        if (am_pm.toLowerCase() == "am"){
          if (hour == 12){
            hourOut = 0;
          }
          else{
            hourOut = hour;
          }
        }
        else{
          if (hour == 12){
            hourOut = hour;
          }
          else{
            hourOut = hour+12;
          }
        }
        return hourOut;
      }
      
      //success and fail functions for navigator.geolocation.getCurrentPosition()
      function success(position){
        $('#edit-distance-latitude').attr('value',position.coords.latitude);
        $('#edit-distance-longitude').attr('value',position.coords.longitude);
        $('#edit-distance-search-distance').attr('value',$('#search-within-select').val());
        $('#views-exposed-form-frontmap-page-1').submit();
      }
      function success2(position){
        $('#edit-distance-latitude').attr('value',position.coords.latitude);
        $('#edit-distance-longitude').attr('value',position.coords.longitude);
        $('#edit-distance-search-distance').attr('value',10);
        $('#views-exposed-form-frontmap-page-1').submit();
      }
      function success3(position){
        $('#edit-distance-latitude').attr('value',position.coords.latitude);
        $('#edit-distance-longitude').attr('value',position.coords.longitude);
        $('#edit-distance-search-distance').attr('value',10);
        $('#views-exposed-form-frontmap-page-1').submit();
      }
      function fail(){
        $("#views-exposed-form-frontmap-page-1 .views-exposed-widgets.clearfix").before('<span id="invalid-address"> Current location unavailable. Enter address </span>');
      }
      
      //special queries
      function special_query(queryString){
        var specialDate = new Date();
        var minspecialDate = specialDate.getMinutes();
        if(minspecialDate<15){
          minspecialDate = 0;
        }
        else if(minspecialDate<30){
          minspecialDate = 15;
        }
        else if(minspecialDate<45){
          minspecialDate = 30;
        }
        else{
          minspecialDate = 45;
        }
        specialDate.setMinutes(minspecialDate);
        if(queryString == 'special_query=live_music_today'){
          $('#edit-date-filter-value-year').val(specialDate.getFullYear());
          $('#edit-date-filter-value-month').val(specialDate.getMonth()+1);
          $('#edit-date-filter-value-day').val(specialDate.getDate());
          $('#edit-date-filter-value-hour').val(specialDate.getHours());        
          $('#edit-date-filter-value-minute').val((specialDate.getMinutes()<10)?'0'+specialDate.getMinutes():specialDate.getMinutes());


          specialDate.setDate(specialDate.getDate()+1);
          specialDate.setHours(2);
          specialDate.setMinutes(0);        
          $('#edit-date-filter-1-value-year').val(specialDate.getFullYear());
          $('#edit-date-filter-1-value-month').val(specialDate.getMonth()+1);
          $('#edit-date-filter-1-value-day').val(specialDate.getDate());
          $('#edit-date-filter-1-value-hour').val(specialDate.getHours());        
          $('#edit-date-filter-1-value-minute').val((specialDate.getMinutes()<10)?'0'+specialDate.getMinutes():specialDate.getMinutes());

          $("#edit-tid").val(1);

          $("#edit-rid").val('All');
          $("#edit-fave").val('All');
          $("#edit-friend").val('All');
          $("#edit-fave-fave-or-friend").val('All');
          $("#edit-friend-fave-or-friend").val('All');

          $("#edit-title").val("");
          $("#edit-sort-by").val('field_time_value');

          $('[name="full_address"]').attr('value', 'Current Location');
          if( navigator.geolocation ){
            // Call getCurrentPosition with success and failure callbacks
            navigator.geolocation.getCurrentPosition(success2, fail);
          }
          else{
            $("#views-exposed-form-frontmap-page-1 .views-exposed-widgets.clearfix").before('<span id="invalid-address"> Current location unavailable. Enter address </span>');
          }        
        }
        else if(queryString == 'special_query=upcoming_live_music'){
          $('#edit-date-filter-value-year').val(specialDate.getFullYear());
          $('#edit-date-filter-value-month').val(specialDate.getMonth()+1);
          $('#edit-date-filter-value-day').val(specialDate.getDate());
          $('#edit-date-filter-value-hour').val(specialDate.getHours());        
          $('#edit-date-filter-value-minute').val((specialDate.getMinutes()<10)?'0'+specialDate.getMinutes():specialDate.getMinutes());


          specialDate.setDate(specialDate.getDate()+7);
          $('#edit-date-filter-1-value-year').val(specialDate.getFullYear());
          $('#edit-date-filter-1-value-month').val(specialDate.getMonth()+1);
          $('#edit-date-filter-1-value-day').val(specialDate.getDate());
          $('#edit-date-filter-1-value-hour').val(specialDate.getHours());        
          $('#edit-date-filter-1-value-minute').val((specialDate.getMinutes()<10)?'0'+specialDate.getMinutes():specialDate.getMinutes());

          $("#edit-tid").val(1);

          $("#edit-rid").val('All');
          $("#edit-fave").val('All');
          $("#edit-friend").val('All');
          $("#edit-fave-fave-or-friend").val('All');
          $("#edit-friend-fave-or-friend").val('All');

          $("#edit-title").val("");
          $("#edit-sort-by").val('field_time_value');

          $('[name="full_address"]').attr('value', 'Current Location');

          if( navigator.geolocation ){
            // Call getCurrentPosition with success and failure callbacks
            navigator.geolocation.getCurrentPosition(success2, fail);
          }
          else{
            $("#views-exposed-form-frontmap-page-1 .views-exposed-widgets.clearfix").before('<span id="invalid-address"> Current location unavailable. Enter address </span>');
          }        
        }
        else if(queryString == 'special_query=drink_deals_now'){
          $('#edit-date-filter-value-year').val(specialDate.getFullYear());
          $('#edit-date-filter-value-month').val(specialDate.getMonth()+1);
          $('#edit-date-filter-value-day').val(specialDate.getDate());
          $('#edit-date-filter-value-hour').val(specialDate.getHours());        
          $('#edit-date-filter-value-minute').val((specialDate.getMinutes()<10)?'0'+specialDate.getMinutes():specialDate.getMinutes());


          specialDate.setMinutes(specialDate.getMinutes()+15);        
          $('#edit-date-filter-1-value-year').val(specialDate.getFullYear());
          $('#edit-date-filter-1-value-month').val(specialDate.getMonth()+1);
          $('#edit-date-filter-1-value-day').val(specialDate.getDate());
          $('#edit-date-filter-1-value-hour').val(specialDate.getHours());        
          $('#edit-date-filter-1-value-minute').val((specialDate.getMinutes()<10)?'0'+specialDate.getMinutes():specialDate.getMinutes());

          $("#edit-tid").val(6);

          $("#edit-rid").val('All');
          $("#edit-fave").val('All');
          $("#edit-friend").val('All');
          $("#edit-fave-fave-or-friend").val('All');
          $("#edit-friend-fave-or-friend").val('All');

          $("#edit-title").val("");
          $("#edit-sort-by").val('distance');

          $('[name="full_address"]').attr('value', 'Current Location');

          if( navigator.geolocation ){
            // Call getCurrentPosition with success and failure callbacks
            navigator.geolocation.getCurrentPosition(success3, fail);
          }
          else{
            $("#views-exposed-form-frontmap-page-1 .views-exposed-widgets.clearfix").before('<span id="invalid-address"> Current location unavailable. Enter address </span>');
          }        

        }        
        
      }
      
      //call special query string function if we recieved a special query string through the url     
      
      var curURL = document.URL;
      var queryStringArray = curURL.split('?');
      if(queryStringArray.length == 2){
        var special_query_check = queryStringArray[1].split('=');
        if(special_query_check.length == 2 && special_query_check[0] == 'special_query'){
          special_query(queryStringArray[1]);
        }       
      }
      
      
      
      //my own implementation of google maps. much easier than gmap!:
      $("#page").append('<div id="eventMap"></div>');
      var eventMap = new google.maps.Map(document.getElementById('eventMap'),{
        zoom: 13,
        //center of berkeley is (37.8717, -122.2728)
        //center of stanford is (37.426, -122.17)
        center: new google.maps.LatLng(37.426, -122.17),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false
      });
      
      //appending exposed form to div id=page
      $("#views-exposed-form-frontmap-page-1").appendTo($("#page"));
      
      //Switching views between map view and list view
//      $(".view-display-id-page_1").hide();
      $("#switchviewbutton").attr('value','List');
      $("#switchviewbutton").toggle(function(){
        $("#eventMap").hide();
        $("#prev-next-result-container").hide();
        $("#section-content").show();
//        $(".view-display-id-page_1").show();
        $(this).attr('value','Map');
        return false;
      },function(){
        $("#eventMap").show();
        $("#prev-next-result-container").show();
        $("#section-content").hide();
//        $(".view-display-id-page_1").hide();
        $(this).attr('value','List');
        return false;
      });
 
      //showing or hiding the exposed search form
      var gmap_was_visible = 1;
      var switchview_was_visible = 1;
//      $("#searchoptions").attr('value','New Search');
      $('#searchoptions').click(function(){
        $('#searchoptions').hide();
        $("#views-exposed-form-frontmap-page-1").show();
        if($("#switchviewbutton").is(":visible")){
          switchview_was_visible = 1;
          $("#switchviewbutton").hide();
        }
        else{
          switchview_was_visible = 0;
        }
        if($("#eventMap").is(":visible")){
          gmap_was_visible = 1;
          $("#eventMap").hide();
          $("#prev-next-result-container").hide();
        }        
        else{
          gmap_was_visible = 0;
          $("#section-content").hide();
//          $(".view-display-id-page_1").hide();
        }
        return false;
      });

      


      //adding custom date and time select boxes
      $('#edit-date-filter-wrapper').before(
      '<div id="from-date-custom-select">'+
        '<strong>Search time range</strong> <br /> from:'+
      '<select id="date-from-day"></select> &nbsp'+
      '<select id="date-from-time"></select>'+
      '</div>');
      var iDateOptionCount;
      for(iDateOptionCount=1;iDateOptionCount<=60;iDateOptionCount++){
        $('#date-from-day').append('<option data-hidden-year="hidden-year">'+iDateOptionCount+'</option>');
      }
      
      $('#edit-date-filter-1-wrapper').before(
      '<div id="to-date-custom-select"> to: &nbsp; &nbsp;'+
       '<select id="date-to-day"></select> &nbsp'+
      '<select id="date-to-time"></select>'+
      '</div>'+
      //'<div class="frontmap-search-descriptions">events that overlap are returned</div>'+
      '');
      for(iDateOptionCount=1;iDateOptionCount<=60;iDateOptionCount++){
        $('#date-to-day').append('<option data-hidden-year="hidden-year">'+iDateOptionCount+'</option>');
      }
      
      
      //when showing exposed search form, initialize custom date filter select boxes (defined above)
      //as follows: If drupal's from exposed filter is a lesser time than the current time rounded
      //down to the nearest 15 mins, than make the custom from date filters equal to the current time
      //rounded down. Otherwise, make the custom filters equal to drupal's exposed filter. Do the same
      //for the custom to-filters, except use 15 minutes later than now rounded down.
        var refDateFrom = new Date();
        var refDateTo = new Date();
      $("#searchoptions").click(function(){
        
        //first use the values of the exposed filters to form a date, and use this
        //as the custom select box value if that date is later than now rounded
        //down to the nearest 15 mins. Otherwise, use now rounded down as the custom
        //select box value. In any case, the custom select box *options* should be based on
        //now rounded down
        var fromDateInit=new Date($('#edit-date-filter-value-year').val()*1,$('#edit-date-filter-value-month').val()*1-1,$('#edit-date-filter-value-day').val()*1,$('#edit-date-filter-value-hour').val()*1,$('#edit-date-filter-value-minute').val()*1);
        refDateFrom = new Date();
        var min = refDateFrom.getMinutes();
        if(min<15){
          min = 0;
        }
        else if(min<30){
          min = 15;
        }
        else if(min<45){
          min = 30;
        }
        else{
          min = 45;
        }
        refDateFrom.setMinutes(min);
        if(fromDateInit < refDateFrom){
          fromDateInit=new Date(refDateFrom.getFullYear(), refDateFrom.getMonth(), refDateFrom.getDate(), refDateFrom.getHours(), refDateFrom.getMinutes());
        }
        //in any case, use now rounded down to the nearest 15 mins (refDateFrom) as the select
        //box options for #date-from-day
        var fromDateSel = new Date(refDateFrom.getFullYear(), refDateFrom.getMonth(), refDateFrom.getDate(), refDateFrom.getHours(), refDateFrom.getMinutes());
        $('#date-from-day option').each(function(){
          $(this).text(getDayArray[fromDateSel.getDay()]+' '+getMonthArray[fromDateSel.getMonth()]+' '+fromDateSel.getDate());
          $(this).attr('data-hidden-year',fromDateSel.getFullYear());
          fromDateSel.setDate(fromDateSel.getDate()+1);
        });
        //set the currently selected option for date-from-day with fromDateInit
        $('#date-from-day').val(getDayArray[fromDateInit.getDay()]+' '+getMonthArray[fromDateInit.getMonth()]+' '+fromDateInit.getDate());
        
        //now do date-from-time options, based on fromDateInit.  If date-from-day is the same as refDateFrom, start from refDateFrom time
        $('#date-from-time').empty();
        var fromHourStart = 0;
        var fromMinStart = 0;
        //if date-from-day is the same as that from refDateFrom, we must start our date-from-time options based on refDateFrom
        if($('#date-from-day').val() == getDayArray[refDateFrom.getDay()]+' '+getMonthArray[refDateFrom.getMonth()]+' '+refDateFrom.getDate()){
          fromHourStart = refDateFrom.getHours();
          fromMinStart = refDateFrom.getMinutes();
        }
        var fromTimeSel = new Date(fromDateInit.getFullYear(), fromDateInit.getMonth(), fromDateInit.getDate(), fromHourStart, fromMinStart);
        for(var iTime=1;iTime<=96;iTime++){
          var fromTimeHourArray = time_convert_24_12(fromTimeSel.getHours());
          var fromTimeMinutes = (fromTimeSel.getMinutes() < 10) ? '0' + fromTimeSel.getMinutes() : fromTimeSel.getMinutes();
          $('#date-from-time').append('<option value="'+fromTimeHourArray['hour']+':'+fromTimeMinutes+' '+fromTimeHourArray['ampm']+'">'+fromTimeHourArray['hour']+':'+fromTimeMinutes+' '+fromTimeHourArray['ampm']+'</option>');
          fromTimeSel.setMinutes(fromTimeSel.getMinutes()+15);
          //break loop if fromTimeSel is 1 day later than refDateFrom
          if(fromTimeSel.getHours()*1 == 0 && fromTimeSel.getMinutes()*1 == 0){
            break;
          }
        }        
        //set the currently selected option for date-from-time with fromDateInit
        var fromTimeHourArrayInit = time_convert_24_12(fromDateInit.getHours());
        var fromTimeMinutesInit = (fromDateInit.getMinutes() < 10) ? '0' + fromDateInit.getMinutes() : fromDateInit.getMinutes();
        $('#date-from-time').val(fromTimeHourArrayInit['hour']+':'+fromTimeMinutesInit+' '+fromTimeHourArrayInit['ampm']);


        //Do the same process as above for toDate.  This time, refDate is just
        //15 minutes greater than it was, making the process a little simpler.
        var toDateInit=new Date($('#edit-date-filter-1-value-year').val()*1,$('#edit-date-filter-1-value-month').val()*1-1,$('#edit-date-filter-1-value-day').val()*1,$('#edit-date-filter-1-value-hour').val()*1,$('#edit-date-filter-1-value-minute').val()*1);
        refDateTo = new Date(refDateFrom.getFullYear(), refDateFrom.getMonth(), refDateFrom.getDate(), refDateFrom.getHours(), refDateFrom.getMinutes()+15);
        if(toDateInit < refDateTo){
          toDateInit=new Date(refDateTo.getFullYear(), refDateTo.getMonth(), refDateTo.getDate(), refDateTo.getHours(), refDateTo.getMinutes());
        }
        
        //use refDateTo as the select box options for #date-to-day
        var toDateSel = new Date(refDateTo.getFullYear(), refDateTo.getMonth(), refDateTo.getDate(), refDateTo.getHours(), refDateTo.getMinutes());
        $('#date-to-day option').each(function(){
          $(this).text(getDayArray[toDateSel.getDay()]+' '+getMonthArray[toDateSel.getMonth()]+' '+toDateSel.getDate());
          $(this).attr('data-hidden-year',toDateSel.getFullYear());
          toDateSel.setDate(toDateSel.getDate()+1);
        });
        //set the currently selected option for date-to-day with toDateInit
        $('#date-to-day').val(getDayArray[toDateInit.getDay()]+' '+getMonthArray[toDateInit.getMonth()]+' '+toDateInit.getDate());
        
        //now do date-to-time options, based on toDateInit.  If date-to-day is the same as refDateTo, start from refDateTo time
        $('#date-to-time').empty();
        var toHourStart = 0;
        var toMinStart = 0;
        //if date-from-day is the same as that from refDateFrom, we must start our date-from-time options based on refDateFrom
        if($('#date-to-day').val() == getDayArray[refDateTo.getDay()]+' '+getMonthArray[refDateTo.getMonth()]+' '+refDateTo.getDate()){
          toHourStart = refDateTo.getHours();
          toMinStart = refDateTo.getMinutes();
        }
        var toTimeSel = new Date(toDateInit.getFullYear(), toDateInit.getMonth(), toDateInit.getDate(), toHourStart, toMinStart);
        for(iTime=1;iTime<=96;iTime++){
          var toTimeHourArray = time_convert_24_12(toTimeSel.getHours());
          var toTimeMinutes = (toTimeSel.getMinutes() < 10) ? '0' + toTimeSel.getMinutes() : toTimeSel.getMinutes();
          $('#date-to-time').append('<option value="'+toTimeHourArray['hour']+':'+toTimeMinutes+' '+toTimeHourArray['ampm']+'">'+toTimeHourArray['hour']+':'+toTimeMinutes+' '+toTimeHourArray['ampm']+'</option>');
          toTimeSel.setMinutes(toTimeSel.getMinutes()+15);
          //break loop if toTimeSel is 1 day later than refDateTo
          if(toTimeSel.getHours()*1 == 0 && toTimeSel.getMinutes()*1 == 0){
            break;
          }
        }               
        //set the currently selected option for date-to-time with toDateInit
        var toTimeHourArrayInit = time_convert_24_12(toDateInit.getHours());
        var toTimeMinutesInit = (toDateInit.getMinutes() < 10) ? '0' + toDateInit.getMinutes() : toDateInit.getMinutes();
        $('#date-to-time').val(toTimeHourArrayInit['hour']+':'+toTimeMinutesInit+' '+toTimeHourArrayInit['ampm']);
      });


      //When date-from-day changes, update date-from-time options and value,
      //then update date-to-day and date-to-time options and values. When
      //date-from-time changes, update date-to-day and date-to-time options and
      //values.  When date-to-day changes, update date-to-time options and value
      $('#date-from-day, #date-from-time, #date-to-day').change(function(){        
        //first, store the current object for date-from
        var dateFromStringArray = $('#date-from-day').val().split(' ');
        var dateFromYear = $('#date-from-day option:selected').attr('data-hidden-year');
        var timeArrayHour = $('#date-from-time').val().split(':');
        var timeArrayMinAP = timeArrayHour[1].split(' ');
        var newDateFrom = new Date(dateFromYear*1,
                                monthArray[dateFromStringArray[1]]*1-1,
                                dateFromStringArray[2]*1,
                                time_convert_12_24(timeArrayHour[0], timeArrayMinAP[1])*1,
                                timeArrayMinAP[0]*1);                
        
        //update date-to-time. This happens only if we changed date-from-day
        if($(this).attr('id') == 'date-from-day'){
          //first, find out which hour and minute to start the date-from-time options
          var fromHourStart = 0;
          var fromMinStart = 0;
          //if date-from-day is the same as that from refDateFrom, we must start our date-from-time options based on refDateFrom
          if($('#date-from-day').val() == getDayArray[refDateFrom.getDay()]+' '+getMonthArray[refDateFrom.getMonth()]+' '+refDateFrom.getDate()){
            fromHourStart = refDateFrom.getHours();
            fromMinStart = refDateFrom.getMinutes();
          }
          //make the date object for populating the date-from-time options, starting at the appropriate hour and minute
          var fromTimeSel = new Date(dateFromYear*1,
                                  monthArray[dateFromStringArray[1]]*1-1,
                                  dateFromStringArray[2]*1,
                                  fromHourStart,
                                  fromMinStart);

          //before we empty date-from-time, store the current value in dateFromTimeTemp
          var dateFromTimeTemp = $('#date-from-time').val();

          //ok, now empty contents of date-from-time
          $('#date-from-time').empty();

          //make date-from-time options
          for(var iTime=1;iTime<=96;iTime++){
            var fromTimeHourArraySel = time_convert_24_12(fromTimeSel.getHours());
            var fromTimeMinutesSel = (fromTimeSel.getMinutes() < 10) ? '0' + fromTimeSel.getMinutes() : fromTimeSel.getMinutes();
            $('#date-from-time').append('<option value="'+fromTimeHourArraySel['hour']+':'+fromTimeMinutesSel+' '+fromTimeHourArraySel['ampm']+'">'+fromTimeHourArraySel['hour']+':'+fromTimeMinutesSel+' '+fromTimeHourArraySel['ampm']+'</option>');
            fromTimeSel.setMinutes(fromTimeSel.getMinutes()+15);
            //break loop if we have entered a new day
            if(fromTimeSel.getHours()*1 == 0 && fromTimeSel.getMinutes()*1 == 0){
              break;
            }
          }

          //now to the date-from-time value itself. if newDateFrom is less than refDateFrom, base
          //date-from-time's value on refDateFrom and update newDateFrom.
          if(newDateFrom < refDateFrom){
            var fromTimeHourArrayNew = time_convert_24_12(refDateFrom.getHours());
            var fromTimeMinutesNew = (refDateFrom.getMinutes() < 10) ? '0' + refDateFrom.getMinutes() : refDateFrom.getMinutes();
            $('#date-from-time').val(fromTimeHourArrayNew['hour']+':'+fromTimeMinutesNew+' '+fromTimeHourArrayNew['ampm']);
            newDateFrom = new Date(refDateFrom.getFullYear(), refDateFrom.getMonth(), refDateFrom.getDate(), refDateFrom.getHours(), refDateFrom.getMinutes());
          }
          //otherwise, keep date-from-time as is
          else{
            $('#date-from-time').val(dateFromTimeTemp);
          }
        }
        //we are finished with updating date-from-time. for date-to-day and date-to-time updates, we need to compare
        //the date-to object (newDateTo) with newDateFrom + 15 mins (dateFromAdj)
        var dateFromAdj = new Date(newDateFrom.getFullYear(), newDateFrom.getMonth(), newDateFrom.getDate(), newDateFrom.getHours(), newDateFrom.getMinutes()+15);
        var dateToStringArray = $('#date-to-day').val().split(' ');
        var dateToYear = $('#date-to-day option:selected').attr('data-hidden-year');
        var timeArrayHourTo = $('#date-to-time').val().split(':');
        var timeArrayMinAPTo = timeArrayHourTo[1].split(' ');
        var newDateTo = new Date(dateToYear*1,
                                monthArray[dateToStringArray[1]]*1-1,
                                dateToStringArray[2]*1,
                                time_convert_12_24(timeArrayHourTo[0], timeArrayMinAPTo[1])*1,
                                timeArrayMinAPTo[0]*1);       
        
        
        //now update date-to-day options and value.  this only happens if date-from-day or date-from-time was changed        
        if($(this).attr('id') == 'date-from-day' || $(this).attr('id') == 'date-from-time'){
          //first store the current value of date-to-day in dateToTemp
          var dateToDayTemp = $('#date-to-day').val();        

          //now update date-to-day options, based on dateFromAdj.
          var toDateSel = new Date(dateFromAdj.getFullYear(), dateFromAdj.getMonth(), dateFromAdj.getDate());
          $('#date-to-day option').each(function(){
            $(this).text(getDayArray[toDateSel.getDay()]+' '+getMonthArray[toDateSel.getMonth()]+' '+toDateSel.getDate());
            $(this).attr('data-hidden-year',toDateSel.getFullYear());
            toDateSel.setDate(toDateSel.getDate()+1);
          });

          //if newDateTo is less than dateFromAdj, update date-to-day's selected value and update newDateTo
          if(newDateTo < dateFromAdj){
            $('#date-to-day').val(getDayArray[dateFromAdj.getDay()]+' '+getMonthArray[dateFromAdj.getMonth()]+' '+dateFromAdj.getDate());
            dateToStringArray = $('#date-to-day').val().split(' ');
            dateToYear = $('#date-to-day option:selected').attr('data-hidden-year');
            newDateTo = new Date(dateToYear*1,
                                  monthArray[dateToStringArray[1]]*1-1,
                                  dateToStringArray[2]*1,
                                  time_convert_12_24(timeArrayHourTo[0], timeArrayMinAPTo[1])*1,
                                  timeArrayMinAPTo[0]*1);

          }
          //otherwise, keep date-to-day as it was
          else{
            $('#date-to-day').val(dateToDayTemp);
          }
        }
        
        
        //now update the options for date-to-time. this happens for changes to date-from-day,
        //date-from-time, and date-to-day
        //first, find out which hour and minute to start the date-from-time options
        var toHourStart = 0;
        var toMinStart = 0;
        //if date-to-day is the same as that from dateFromAdj, we must start our date-to-time options based on dateFromAdj
        if($('#date-to-day').val() == getDayArray[dateFromAdj.getDay()]+' '+getMonthArray[dateFromAdj.getMonth()]+' '+dateFromAdj.getDate()){
          toHourStart = dateFromAdj.getHours();
          toMinStart = dateFromAdj.getMinutes();
        }
        //make the date object for populating the date-from-time options, starting at the appropriate hour and minute
        var toTimeSel = new Date(dateToYear*1,
                                monthArray[dateToStringArray[1]]*1-1,
                                dateToStringArray[2]*1,
                                toHourStart,
                                toMinStart);
                                
        //before we empty date-to-time, store the current value in dateToTimeTemp
        var dateToTimeTemp = $('#date-to-time').val();
        //ok, now empty contents of date-from-time
        $('#date-to-time').empty();
        
        //make date-to-time options
        for(iTime=1;iTime<=96;iTime++){
          var toTimeHourArraySel = time_convert_24_12(toTimeSel.getHours());
          var toTimeMinutesSel = (toTimeSel.getMinutes() < 10) ? '0' + toTimeSel.getMinutes() : toTimeSel.getMinutes();
          $('#date-to-time').append('<option value="'+toTimeHourArraySel['hour']+':'+toTimeMinutesSel+' '+toTimeHourArraySel['ampm']+'">'+toTimeHourArraySel['hour']+':'+toTimeMinutesSel+' '+toTimeHourArraySel['ampm']+'</option>');
          toTimeSel.setMinutes(toTimeSel.getMinutes()+15);
          //break loop if we have entered a new day
          if(toTimeSel.getHours()*1 == 0 && toTimeSel.getMinutes()*1 == 0){
            break;
          }
        }        
        //now update date-to-time's value
        //if newDateTo is still less than dateFromAdj (after updating date-to-day), then update date-to-time.
        //the purpose of checking this again after updating date-to-day is to allow searching different dates
        //without changing a desired time differential.
        if(newDateTo < dateFromAdj){
          var toTimeHourArrayNew = time_convert_24_12(dateFromAdj.getHours());
          var toTimeMinutesNew = (dateFromAdj.getMinutes() < 10) ? '0' + dateFromAdj.getMinutes() : dateFromAdj.getMinutes();
          $('#date-to-time').val(toTimeHourArrayNew['hour']+':'+toTimeMinutesNew+' '+toTimeHourArrayNew['ampm']);         
        }
        //otherwise, keep date-to-time as it was
        else{
          $('#date-to-time').val(dateToTimeTemp);
        }
      });
      

      //hiding exposed form date entry fields, as I have already added custom fields
      $('#edit-date-filter-wrapper, #edit-date-filter-1-wrapper').hide();


      //adding user-entered address field and current location option to beginning of exposed form and hiding. Also adding
      //summary text of search selections. Showing summary text and hiding user-entry
      //fields by default
      $("#views-exposed-form-frontmap-page-1 .views-exposed-widgets.clearfix").prepend(
      '<div id="location-search-field"> <strong> Search near: </strong> <input type="text" id="address-entered" /></div>'+
      '<div id="current-location-div">address or "<a href="#" id="current-location-link">Current Location</a>" </div>'+
      '<strong>Search within:</strong> <select id="search-within-select"> <option>0.5</option>'+
      '<option>1</option><option>3</option><option>5</option>'+
      '<option>10</option><option>20</option><option>30</option><option>50</option></select> miles');
      
      //if we have some memory of the search distance, enter it here:
      if($('#edit-distance-search-distance').attr('value')){
        $("#search-within-select").val($('#edit-distance-search-distance').attr('value'));
      }
      else{
        $("#search-within-select").val(5);
      }
      
      
      //retrieve the address that was stored in a session variable, if it exists.
      $("#address-entered").val($('[name="full_address"]').attr('value'));
      
      //if use current location is clicked, then enter "Current Location" as location
      $("#current-location-link").click(function(){
        $("#address-entered").val('Current Location');
        return false;    
      });

      
      $('#edit-tid [value="All"]').text('All types');
      /*
      //Adding summary text of event type selections. Hiding event selection options
      //by default
      $("#edit-tid-wrapper").before(
      '<div id="event-type-summary"> <strong>Event types</strong><br /> <a href="#" id="event-type-link"></a> </div>');
      $("#edit-tid-wrapper").append('<div class="form-item"><input id="event-type-all" type="radio"><label class="option"> <em> All events </em> </label></div>'+
        '<div id="hide-event-types-div"><a href="#" id="hide-event-types">hide event type selection</a>');
      $("#edit-tid-wrapper").hide();

      //var selectedEventTypes = $("#edit-tid-wrapper .bef-checkboxes option:selected");
      
      //Add initial event type summary
      //$('#edit-tid-wrapper .bef-checkboxes .form-item input[checked="checked"]').each(function(){
      $('#edit-tid-wrapper .bef-checkboxes .form-item input:checkbox:checked').each(function(){
        $("#event-type-link").append(", " + $(this).next("label").text());
      });
      if($("#event-type-link").text()==""){
        $("#event-type-link").text('all');
        $("#event-type-all").attr("checked", true);
      }
      $("#event-type-link").text($("#event-type-link").text().replace(", ",""));


      //show event type checkboxes on click of event type link
      $("#event-type-link").click(function(){
        $("#edit-tid-wrapper").toggle();
        return false;
      });

      $("#event-type-all").click(function(){
        $('#edit-tid-wrapper .bef-checkboxes .form-item input').attr("checked", false);
//        $(this).attr("checked", true);
        $("#event-type-link").text('all');
      });
      $("#hide-event-types").click(function(){
        $("#edit-tid-wrapper").toggle();
        return false;
      });
      
      //change event type summary when checkboxes are changed. I found it easiest to simply
      //run the .each function again for all checkboxes, although I know this is slower
      //than adding and subtracting incrementally from the list.
      $('#edit-tid-wrapper .bef-checkboxes .form-item input').change(function(){
        $("#event-type-all").attr("checked", false);
        $("#event-type-link").text("");
        $('#edit-tid-wrapper .bef-checkboxes .form-item input:checkbox:checked').each(function(){
          $("#event-type-link").append(", " + $(this).next("label").text());
        });
        if($("#event-type-link").text()==""){
          $("#event-type-link").text('all');
          $("#event-type-all").attr("checked", true);
        }
        $("#event-type-link").text($("#event-type-link").text().replace(", ",""));
      });

      $("#edit-rid").val('All');
      */
      
      //adding Additional options select box
      $("#edit-rid-wrapper").before(
      '<div id="additional-options-div"> <strong>Additional Options </strong><br />'+
       '<select id="additional-options-select">'+
        '<option value="none">None</option>'+
        '<option value="faves">Show only events at favorite venues</option>'+
        '<option value="friends">Show only events attended by friends</option>'+
        '<option value="faves-or-friends">Attended by friends or at favorite venues</option>'+
        '</select></div>');
      
      $("#additional-options-select").val("none");
      if($("#edit-fave").val()=="1"){
        $("#additional-options-select").val("faves");
      }
      else if($("#edit-friend").val()=="1"){
        $("#additional-options-select").val("friends");
      }
      else if($("#edit-fave-fave-or-friend").val()=="1"){
        $("#additional-options-select").val("faves-or-friends");
      }
      else{
        $("#additional-options-select").val("none");
      }
      
      $("#edit-rid-wrapper, #edit-fave-wrapper, #edit-friend-wrapper, #edit-fave-fave-or-friend-wrapper, #edit-friend-fave-or-friend-wrapper").hide();      

      //add cancel button to exposed form
      $("#edit-submit-frontmap").after(
      '<div> <input type="submit" id="fake-search" value="Search!" />'+
      '<input type="submit" id="cancel-search" value="Cancel" /> </div>');
      $('#cancel-search').click(function(){
        $("#views-exposed-form-frontmap-page-1").hide();
        $("#searchoptions").show();
        if(switchview_was_visible == 1){
          $("#switchviewbutton").show();          
        }
        if(gmap_was_visible == 1){
          $("#eventMap").show();
          $("#prev-next-result-container").show();
        }
        else{
          $("#section-content").show();
//          $(".view-display-id-page_1").show();            
        }
        return false;        
      });
            
      //continuing my own implementation of google maps. much easier than gmap!:
      //define new infobubble.  this is a project from google that allows more flexibility
      //than infowindow.
      /*
      infoBubble options and default values:
      shadowStyle: 1(,0,2)
      padding: 10 px
      borderRadius: 10 px
      borderWidth: 1 px
      borderColor: '#ccc'
      backgroundColor: '#fff'
      minWidth: 50 px
      maxWidth: px
      minHeight: px
      maxHeight: px
      arrowSize: 15 px
      arrowPosition: 50 %
      arrowStyle: 0(,1,2)
      disableAutoPan: false(,true)
      disableAnimation: false(,true)
      hideCloseButton: false(,true)
      backgroundClassName:
      */
      infoBubble = new InfoBubble({
        arrowSize: 5,
        padding: 5,
        borderRadius: 5,
        borderWidth: 2,
        hideCloseButton: true,
        maxWidth: 250,
        disableAutoPan: true,
        disableAnimation: true,
        shadowStyle: 0
      });
      
      //declare bounds variable to later adjust screen size
      var bounds = new google.maps.LatLngBounds ();
      
      //make an adjustment to the time field to condense it for better bubble display
       $(".view-display-id-page_1 .views-row .date-display-end").each(function(){
         var origEndDate = $(this).text();
         var origEndDateArray = origEndDate.split(" ");
         if(origEndDateArray.length == 4){
           $(this).text(origEndDateArray[3]);
         }
       });
      
      //take information from each row of the list view results. This way I don't
      //need a gmap view at all! In the same loop, also adjust the bounds variable
      //with each lat long.
      var latLngs = [];
      var titles = [];
      var hosts = [];
      var times = [];
      var titletext = [];
      var hosttext = [];
      var infoBubbleResultContent = [];
      $(".view-display-id-page_1 .views-row").each(function(i){
        latLngObj = new google.maps.LatLng($(this).children(".views-field-latitude").text(),$(this).children(".views-field-longitude").text());
        latLngs.push(latLngObj);
        titles.push('<div id="map-marker-title">'+$(this).children(".views-field-title").children(".field-content").html()+'</div>');
        hosts.push('<div id="map-marker-host">'+$(this).children(".views-field-field-ven-name").children(".field-content").html()+'</div>');
        times.push('<div id="map-marker-time">'+$(this).children(".views-field-field-time").text()+'</div>');
        infoBubbleResultContent.push('<div id="map-marker-title">'+$(this).children(".views-field-title").children(".field-content").html()+'</div>'+
                                     '<div id="map-marker-time">'+$(this).children(".views-field-field-time").text()+'</div>'+
                                     '<div id="map-marker-host">'+$(this).children(".views-field-field-ven-name").children(".field-content").html()+'</div>');
        titletext.push($(this).children(".views-field-title").children(".field-content").text());
        hosttext.push($(this).children(".views-field-field-ven-name").children(".field-content").text());
        bounds.extend(latLngObj);
      });
      
      //add a marker for where the user decided to search around make its zindex
      // something that will be lower than the result markers
      var searchNearLatLngObj = new google.maps.LatLng($('#edit-distance-latitude').attr('value'),$('#edit-distance-longitude').attr('value'));
      eventMap.setCenter(searchNearLatLngObj);
      var searchNearMarker = new google.maps.Marker({
        position: searchNearLatLngObj,
        map: eventMap,
        title: 'Searching near here',
        icon: '/sites/all/modules/custom/tinbully_glue/blue_dot.png',
        //icon: '/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png',
        zIndex: -50
      });
      
      //the content of the searchNearMarker infobubble is mostly summarizing what was selected.
      //however, the content is slightly different for with results and without results.
      //see the no results section for the different beginning.
      var searchNearContBeg = '<div id="withResultsContent">'+
        '<div id="searchnear-infobub-loc"> Searched ';
/*
      var eventTypesChecked = "";
      $('#edit-tid-wrapper .bef-checkboxes .form-item input:checkbox:checked').each(function(i){
        if(i == 0){
          eventTypesChecked = $(this).next("label").text();
        }       
        else{
          eventTypesChecked = eventTypesChecked + ", " + $(this).next("label").text();
        }

      });
      if(eventTypesChecked==""){
        eventTypesChecked = 'All events';
      }
*/      
      var searchedFromTimeArray = time_convert_24_12($('#edit-date-filter-value-hour').val()*1);
      var searchedToTimeArray = time_convert_24_12($('#edit-date-filter-1-value-hour').val()*1);
      var addOptsBubbleDiv = '<br /><div id="searchnear-infobub-opts">Additional options: <strong>'+$("#additional-options-select option:selected").text()+'</strong>. </div>';
      if($("#additional-options-select").val()=="none"){
        addOptsBubbleDiv = '';
      }
      var keywordBubbleDiv = '<br /> <div id="searchnear-infobub-keyword">Keywords: <strong>'+$("#edit-title").val()+'</strong>.</div>';
      if($("#edit-title").val()==""){
        keywordBubbleDiv ='';
      }
      var mileOrMiles = " miles";
      if($('#edit-distance-search-distance').attr('value') == 1){
        mileOrMiles = " mile";
      }     
      var searchNearContEnd = 'within <strong>'+
        $('#edit-distance-search-distance').attr('value') + mileOrMiles+
        '</strong> of <strong>'+$('[name="full_address"]').attr('value')+'</strong>. </div><br /><div id="searchnear-infobub-time-range">Time range: <br /><strong>'+
        getMonthArray[$('#edit-date-filter-value-month').val()*1-1]+' '+$('#edit-date-filter-value-day').val()*1+', '+searchedFromTimeArray['hour']+':'+$('#edit-date-filter-value-minute').val()+searchedFromTimeArray['ampm']+
        '</strong> to <strong>'+getMonthArray[$('#edit-date-filter-1-value-month').val()*1-1]+' '+$('#edit-date-filter-1-value-day').val()*1+', '+searchedToTimeArray['hour']+':'+$('#edit-date-filter-1-value-minute').val()+searchedToTimeArray['ampm']+
        '</strong></div><br /><div id="searchnear-infobub-eventtypes">Type: <strong>'+$('#edit-tid option:selected').text()+'</strong></div>'+
        addOptsBubbleDiv + keywordBubbleDiv+ '</div>';
      

           
      //add an index to indicate which marker is currently highlighted. -1 is for the
      //searchNearMarker. The other indices follow the views results (0-X). Set initially
      //to zero, as the first result is shown initially.
      var curMarkerIndex = 0;
      var preMarkerIndex = 0;
      
      //create the result markers, order them with z-indices, and add event
      // handlers to handle when these markers are clicked. When clicked, highlight
      //the current marker and unhighlight the currently highlighted marker
      var markerArray = [];
      
      //if we haven't yet serached, then bring up some helpful text. For some reason,
      //even though I have "input required" in my view and my live is synced with local,
      //drupal decides to run a search when navigating from any other page to frontmap,
      //so I have moved this to the first condition checked so that I still show helpful text
      //
      if($('#edit-distance-search-distance').attr('value')*1 == 0){
/*        
        preMarkerIndex = curMarkerIndex;
        curMarkerIndex = -1;
*/        
        
        /*
        searchNearContBeg = '<div id="introContent">'+
          '<strong>Welcome to mappenin, your map of local happenings</strong>.'+
          ' Press "<strong>New Search</strong>" above to begin searching for events by type, location, and time'+
          ' (for example, <a id="upcoming-live-music" href="/upcoming-live-music">upcoming live music</a> or <a id="drink-deals-now" href="/drink-deals-now">current drink deals</a>)'+
          ', or press the green arrow (<span class="green-arrow-color"><strong>&gt;</strong></span>) in the upper right'+
          ' to navigate around the site. <a href="/user/register"><br/><br/>Register</a> and <a href="/user">login</a>'+
          " to add events to <strong>your schedule</strong>, and keep up with your <strong>favorite venues'</strong> and <strong>friends' schedules</strong>. <br/><br/><strong>mappenin.com</strong> works"+
          " the same on all devices, <strong>from smartphones to desktop computers</strong>. Don't forget to add mappenin to your"+
          " <strong>bookmarks</strong>, <strong>favorites</strong>, and <strong>homescreens</strong>.<br/><br/>If you would like to <strong>post your venue's events and deals</strong>, please "+
          '<a href="/user/new-venue">register your venue</a>.</div>';
        */

        searchNearContBeg = '<div id="introContent">'+
          ' Press "<strong>New Search</strong>" above to begin searching'+
          ' (for example, <a id="upcoming-live-music" href="/upcoming-live-music">upcoming live music</a> or <a id="drink-deals-now" href="/drink-deals-now">current drink deals</a>)'+
          '. <a href="/user/register"><br/><br/>Register</a> and <a href="/user">login</a>'+
          " to add events to your schedule, and keep up with your favorite venues' and friends' schedules.<br/><br/>"+
          '<a href="/user/new-venue">Register your venue</a>.</div>';


        infoBubble.setContent(searchNearContBeg);
        infoBubble.open(eventMap, searchNearMarker);
        searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');
        //searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');

        google.maps.event.addListener(searchNearMarker, 'click', function(){
          infoBubble.open(eventMap, searchNearMarker);
          this.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');
          //this.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');
        });
        $("#switchviewbutton").hide();
       
        /*
        $("#eventMap").hide();
        $("#section-content").show();
        $(".view-display-id-page_1").prepend(searchNearContBeg);
        $("#switchviewbutton").hide();
        $(".view-content").hide();
        */
        
        //when the special query links are clicked, run the appropriate special queries        
        $("#upcoming-live-music").click(function(){
          special_query('special_query=upcoming_live_music');
          return false;
        });
        $("#drink-deals-now").click(function(){
          special_query('special_query=drink_deals_now');
          return false;
        });
        
        //difference of adjusted center to original center is (0.0183, 0)
        eventMap.setCenter(new google.maps.LatLng(37.4443, -122.17));
        //eventMap.setZoom(20);
        //bounds.extend(searchNearLatLngObj);
        //bounds.extend(new google.maps.LatLng(37.91, -122.2728));
        //eventMap.fitBounds(bounds);

      }     
      //else if we have results, then handle
      else if(latLngs.length > 0){
        //If we have at least 1 result, bring up the next and previous buttons
        var resultOrResults = ' results';
        if(latLngs.length == 1){
          resultOrResults = ' result';
        }
        $("#page").append('<div id="prev-next-result-container"><div id="prev-next-result">'+
         ' <input type="submit" id="prev-result" value="prev" />'+
          '<input type="submit" id="next-result" value="next" />'+
          '<p>' + '#<span id="current-result-num">1</span> of '+latLngs.length + resultOrResults + '</p></div></div>');
        
        //make the map markers and event handlers
        //initialize the current marker index and previous marker index to 0, result number one.
        //the pre marker index is needed for simplifying the z-index resetting.
        curMarkerIndex = 0;
        preMarkerIndex = 0;
        for (var i = 0; i < latLngs.length; i++){
          //var markerImage = new google.maps.MarkerImage('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(i+1)+'.png');
          var marker = new google.maps.Marker({
            position: latLngs[i],
            map: eventMap,
            title: hosttext[i],
            icon: '/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(i+1)+'.png'
          });
          marker.setZIndex(-1*i);
          markerArray[i] = marker;
          //using a closure to add event handlers for each marker
          (function(i, marker) {
            google.maps.event.addListener(marker, 'click', function(){
              //if we currently have selected a different marker, close the infobubble and dehighlight the marker
              if(curMarkerIndex != i){                
                infoBubble.close();
                //if one of the other result markers is currently highlighted, dehighlight it
                if(curMarkerIndex != -1){
                  markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');                  
                  this.setZIndex(markerArray[curMarkerIndex].getZIndex() + 1);
                }
                //otherwise the searchNearMarker is highlighted, so dehightlight it.
                else{
                  searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');                  
                  //searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png');                  
                  this.setZIndex(searchNearMarker.getZIndex() + 1);
                }
                //reset the content of the infobubble
                infoBubble.setContent(infoBubbleResultContent[i]);
                preMarkerIndex = curMarkerIndex;
                curMarkerIndex = i;
              }
              // I took the following lines out of the if statement because clicking
              // on the map also dehighlights the markers and closes their infobubbles
              infoBubble.open(eventMap, marker);
              this.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_'+(i+1)+'.png');
              //set "x" on the "x of y results" summary
              $('#current-result-num').text(curMarkerIndex+1);
            });
          })(i, marker); //end closure
        }
        //extend the bounds by the searchNearMarker and then fit the window to the bounds
        bounds.extend(searchNearLatLngObj);
        eventMap.fitBounds(bounds);
        
        //initially (if we have any results), open and highlight the first result.
        infoBubble.setContent(infoBubbleResultContent[0]);
        infoBubble.open(eventMap, markerArray[0]);
        markerArray[0].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_1.png');
        
        //rezoom to fit all the markers
        //this funky code was necessary because fitBounds is asynchronous. see
        //http://stackoverflow.com/questions/4523023/using-setzoom-after-using-fitbounds-with-google-maps-api-v3
        zoomChangeBoundsListener = 
          google.maps.event.addListenerOnce(eventMap, 'bounds_changed', function() {
            this.setZoom(this.getZoom()-1);
            //this.setCenter(latLngs[0]);
          });
        setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);


        //(If we have results) add one version of the searchNearMarker event handler:
        //When the searchNearMarker is clicked, highlight it and unhighlight
        // the result markers. Also open infobubble on the searchNearMarker
        google.maps.event.addListener(searchNearMarker, 'click', function(){
          if(curMarkerIndex != -1){
            infoBubble.close();
            infoBubble.setContent(searchNearContBeg+searchNearContEnd);
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');
            this.setZIndex(markerArray[curMarkerIndex].getZIndex() + 1);
            preMarkerIndex = curMarkerIndex;          
            curMarkerIndex = -1;          
          }
          // I took the following lines out of the if statement because clicking
          // on the map also dehighlights the markers and closes infobubbles
          infoBubble.open(eventMap, searchNearMarker);
          this.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');
          //this.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');
          //set "x" on the "x of y results" summary
          $('#current-result-num').text(curMarkerIndex+1);
        });

        //when the map is clicked outside of a marker, close infobubble and dehighlight
        //the currently highlighted marker.
        google.maps.event.addListener(eventMap, 'click', function(){
          infoBubble.close();
          if(curMarkerIndex > -1){
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');          
          }
          else{
            searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');
            //searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png');
          }
          //set "x" on the "x of y results" summary
          //$('#current-result-num').text('0');
        });
        
        //handle when previous and next buttons are clicked
        $('#prev-result').click(function(){
          //de focus on buttons and close the current infobubble
          $(this).blur();          
          infoBubble.close(); 
          //if the searchnearmarker is currently selected, go to the last result
          if(curMarkerIndex == -1){
            searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');
            //searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png');
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = latLngs.length - 1;
            markerArray[curMarkerIndex].setZIndex(searchNearMarker.getZIndex() + 1);
            infoBubble.setContent(infoBubbleResultContent[curMarkerIndex]);
            infoBubble.open(eventMap, markerArray[curMarkerIndex]);
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_'+(curMarkerIndex+1)+'.png');           
          }
          //if the first result is selected, go to the searchnearmarker
          else if(curMarkerIndex == 0 ){
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');                                                
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = -1;            
            searchNearMarker.setZIndex(markerArray[preMarkerIndex].getZIndex() + 1);
            infoBubble.setContent(searchNearContBeg+searchNearContEnd);
            infoBubble.open(eventMap, searchNearMarker);
            searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');
            //searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');
          }
          //if any other result is selected, go to the previous result
          else{
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');                                                
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = curMarkerIndex - 1;            
            markerArray[curMarkerIndex].setZIndex(markerArray[preMarkerIndex].getZIndex() + 1);
            infoBubble.setContent(infoBubbleResultContent[curMarkerIndex]);
            infoBubble.open(eventMap, markerArray[curMarkerIndex]);
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_'+(curMarkerIndex+1)+'.png');           
          }
          //set "x" on the "x of y results" summary
          $('#current-result-num').text(curMarkerIndex+1);
          return false;
        });
        $('#next-result').click(function(){
          //de focus on buttons and close the current infobubble
          $(this).blur();
          infoBubble.close();
          //if the searchnearmarker is currently selected, go to the first result
          if(curMarkerIndex == -1 ){
            searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');                  
            //searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png');                  
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = 0;            
            markerArray[curMarkerIndex].setZIndex(searchNearMarker.getZIndex() + 1);
            infoBubble.setContent(infoBubbleResultContent[curMarkerIndex]);
            infoBubble.open(eventMap, markerArray[curMarkerIndex]);
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_'+(curMarkerIndex+1)+'.png');           
          }
          //if any but the searchnearmarker or last marker are clicked, go to the next result
          else if(curMarkerIndex < latLngs.length - 1 ){
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');                  
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = curMarkerIndex + 1;
            markerArray[curMarkerIndex].setZIndex(markerArray[preMarkerIndex].getZIndex() + 1);
            infoBubble.setContent(infoBubbleResultContent[curMarkerIndex]);
            infoBubble.open(eventMap, markerArray[curMarkerIndex]);
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_'+(curMarkerIndex+1)+'.png');           
          }
          //if the last result is selected, go to the searchnearmarker
          else{
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');                  
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = -1;
            searchNearMarker.setZIndex(markerArray[preMarkerIndex].getZIndex() + 1);
            infoBubble.setContent(searchNearContBeg+searchNearContEnd);
            infoBubble.open(eventMap, searchNearMarker);
            searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');
            //searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');
          }
          //set "x" on the "x of y results" summary
          $('#current-result-num').text(curMarkerIndex+1);
          return false;
        });
      }      
      //else if we have no results, set no results content in the searchNearMarker and highlight it.
      //Also add the simple event handler specific to no results
      else if($('#edit-distance-search-distance').attr('value')*1){
        preMarkerIndex = curMarkerIndex;
        curMarkerIndex = -1;
        
        searchNearContBeg = '<div id="noResultsContent">'+
          '<div id="searchnear-infobub-loc"> Sorry, no events were found ';
        infoBubble.setContent(searchNearContBeg+searchNearContEnd);
        infoBubble.open(eventMap, searchNearMarker);
        searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');
        //searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');

        google.maps.event.addListener(searchNearMarker, 'click', function(){
          infoBubble.open(eventMap, searchNearMarker);
          this.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');
          //this.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');
        });

        //when the map is clicked outside of a marker, close infobubble and dehighlight
        //the currently highlighted marker.
        google.maps.event.addListener(eventMap, 'click', function(){
          infoBubble.close();
          if(curMarkerIndex > -1){
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');          
          }
          else{
            searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/blue_dot.png');
            //searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png');
          }
        });
        
        $("#switchviewbutton").hide();
      }
      
      

      
      //using user-entered address and google geocoder (api 3) to fill the longitude
      //and latitude fields in the exposed form
      var geocoder_api3;
      $('#fake-search').click(function(){        //update the exposed time filters with custom values
        var dateFromStringArray = $('#date-from-day').val().split(' ');
        var dateFromYear = $('#date-from-day option:selected').attr('data-hidden-year');
        var timeArrayHour = $('#date-from-time').val().split(':');
        var timeArrayMinAP = timeArrayHour[1].split(' ');
        $('#edit-date-filter-value-year').val(dateFromYear);
        $('#edit-date-filter-value-month').val(monthArray[dateFromStringArray[1]]);
        $('#edit-date-filter-value-day').val(dateFromStringArray[2]*1);
        $('#edit-date-filter-value-hour').val(time_convert_12_24(timeArrayHour[0],timeArrayMinAP[1]));        
        $('#edit-date-filter-value-minute').val(timeArrayMinAP[0]);

        //do the same for exposed to-time filters
        var dateToStringArray = $('#date-to-day').val().split(' ');
        var dateToYear = $('#date-to-day option:selected').attr('data-hidden-year');
        var timeArrayHourTo = $('#date-to-time').val().split(':');
        var timeArrayMinAPTo = timeArrayHourTo[1].split(' ');
        $('#edit-date-filter-1-value-year').val(dateToYear);
        $('#edit-date-filter-1-value-month').val(monthArray[dateToStringArray[1]]);
        $('#edit-date-filter-1-value-day').val(dateToStringArray[2]*1);        
        $('#edit-date-filter-1-value-hour').val(time_convert_12_24(timeArrayHourTo[0],timeArrayMinAPTo[1]));
        $('#edit-date-filter-1-value-minute').val(timeArrayMinAPTo[0]);        
        
        //set the additional options
        $("#edit-rid").val('All');
        if($("#additional-options-select").val() == 'faves'){
          $("#edit-fave").val('1');
          $("#edit-friend").val('All');          
          $("#edit-fave-fave-or-friend").val('All');
          $("#edit-friend-fave-or-friend").val('All');          
        }
        else if($("#additional-options-select").val() == 'friends'){
          $("#edit-fave").val('All');
          $("#edit-friend").val('1');           
          $("#edit-fave-fave-or-friend").val('All');
          $("#edit-friend-fave-or-friend").val('All');          
        }
        else if($("#additional-options-select").val() == 'faves-or-friends'){
          $("#edit-fave").val('All');
          $("#edit-friend").val('All');           
          $("#edit-fave-fave-or-friend").val('1');
          $("#edit-friend-fave-or-friend").val('1');          
        }
        else{
          $("#edit-fave").val('All');
          $("#edit-friend").val('All');
          $("#edit-fave-fave-or-friend").val('All');
          $("#edit-friend-fave-or-friend").val('All');          
        }
        
        
        //save entered address in a form field with memory!
        $('[name="full_address"]').attr('value', $('#address-entered').val());
        //geocode the address and then submit
        $("#invalid-address").remove();
        var address_entered = $('#address-entered').val();
        if(address_entered.toLowerCase() == 'current location'){
          if( navigator.geolocation ){
            // Call getCurrentPosition with success and failure callbacks
            navigator.geolocation.getCurrentPosition( success, fail );
          }
          else{
            $("#views-exposed-form-frontmap-page-1 .views-exposed-widgets.clearfix").before('<span id="invalid-address"> Current location unavailable. Enter address </span>');
          }
        }
        else{
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
              $('#edit-distance-search-distance').attr('value',$('#search-within-select').val());
              $('#views-exposed-form-frontmap-page-1').submit();
            }
            else{
              $("#views-exposed-form-frontmap-page-1 .views-exposed-widgets.clearfix").before('<span id="invalid-address"> Enter valid address or "Current Location" </span>');
            }
          });
        }
        return false;
      });
      
      
      //remove default submission when pressing enter in text fields
      $('#address-entered, #edit-title').keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
          $(this).blur();
          e.preventDefault();
        }
      });
      
      //Remove no results message from attached lists, 
      $(".view-display-id-page_1 .view-empty").html('');
      
      //Numbering the attached lists      
      $(".view-display-id-page_1 .views-row").each(function (i) {
        $(this).prepend('<div class="event-list-number">'+
          '<img src="/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(i+1)+'.png" alt='+(i+1)+'</div>');
          //'<img src="/sites/all/modules/custom/tinbully_glue/google map markers/mapito dark/darkblue'+(i+1)+'.png" alt='+(i+1)+'</div>');
          //'<img src="/sites/all/modules/gmap/markers/number'+(i+1)+'.png" alt='+(i+1)+'</div>');
      });

    }
  };
}) (jQuery);
