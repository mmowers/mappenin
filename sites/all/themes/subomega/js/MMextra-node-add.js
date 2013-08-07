/**
 * @file MMextra-node-add.js
 * 
 * Provides my javascript for the front page for switching between map view and list view
 */
(function ($) {
  Drupal.behaviors.MMextra_node_add = { 
    attach: function(context,settings) {
      
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
      
      function time_convert_24_12(hour_24){
        var hour = hour_24*1;
        var arrayOut = [];
        if (hour < 12){
          arrayOut['ampm'] = "am";
        }
        else{
          arrayOut['ampm'] = "pm";
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
//      if( $('#edit-field-location-und-0-street').val()=="" || $('#edit-field-location-und-0-street').val()== null){
//        $('#edit-field-location').prepend('<div id="empty-location-warning" class="form-required">'+
//          'To enter or change your normal location, go to</div>');
//      }

      $('#edit-field-event-type-und option[value="_none"]').text('Select');
      
      $("#edit-field-time .fieldset-legend").html('<strong>Event Start</strong>');
      
      //Add custom start date select box
      $('.form-item-field-time-und-0-value-hour').before('<select id="date-from-day"></select>');
      var iDateOptionCount;
      for(iDateOptionCount=1;iDateOptionCount<=360;iDateOptionCount++){
        $('#date-from-day').append('<option data-hidden-year="hidden-year">'+iDateOptionCount+'</option>');
      }


      //Initialize custom start date select box options, and initialize selection
      var fromDateInit=new Date();
      $('#date-from-day option').each(function(){
        $(this).text(getDayArray[fromDateInit.getDay()]+' '+getMonthArray[fromDateInit.getMonth()]+' '+fromDateInit.getDate());
        $(this).attr('data-hidden-year',fromDateInit.getFullYear());
        fromDateInit.setDate(fromDateInit.getDate()+1);
      });
      var fromDateSel=new Date($('#edit-field-time-und-0-value-month option:selected').text() + ' '+$('#edit-field-time-und-0-value-day').val()+' '+$('#edit-field-time-und-0-value-year').val()+' '+$('#edit-field-time-und-0-value-hour').val()+':'+$('#edit-field-time-und-0-value-minute').val()+' '+$('#edit-field-time-und-0-value-ampm').val());
      $('#date-from-day').val(getDayArray[fromDateSel.getDay()]+' '+getMonthArray[fromDateSel.getMonth()]+' '+fromDateSel.getDate());


      //Add event end text and date summary
      $('.form-item-field-time-und-0-value2-hour').before(
      '<div id="event-end-label"><strong>Event End</strong></div>');

      //Add custom start-time select box and initialize
      var iTime;
      var startTimeDate=new Date('Jan 1 2000');
      var startTimeHourArray = [];
      var startTimeMinutes = 0;
      $('#edit-field-time-und-0-value-ampm').after('<select id="start-time"></select>');
      for(iTime=1;iTime<=96;iTime++){
        startTimeHourArray = time_convert_24_12(startTimeDate.getHours());
        startTimeMinutes = (startTimeDate.getMinutes() < 10) ? '0' + startTimeDate.getMinutes() : startTimeDate.getMinutes();
        $('#start-time').append('<option value="'+startTimeHourArray['hour']+':'+startTimeMinutes+' '+startTimeHourArray['ampm']+'">'+startTimeHourArray['hour']+':'+startTimeMinutes+' '+startTimeHourArray['ampm']+'</option>');
        startTimeDate.setMinutes(startTimeDate.getMinutes()+15);
      }
      $('#start-time').val($('#edit-field-time-und-0-value-hour').val()+':'+$('#edit-field-time-und-0-value-minute').val()+' '+$('#edit-field-time-und-0-value-ampm').val());
      
      //Add custom end-time select box. initialization for this happens later,
      //triggered by $('#edit-field-time-und-0-value-hour').change()
      $('#edit-field-time-und-0-value2-ampm').after('<select id="end-time"></select>');
      for(iTime=1;iTime<=95;iTime++){
        $('#end-time').append('<option value="'+iTime+'">'+iTime+'</option>');
      }
      

      //change the original from-date and to-date select boxes and to-date summary text when custom from-date select-box changes.
      $('#date-from-day').change(function(){ 
        //first update the original from-date boxes
        var dateFromStringArray = $('#date-from-day').val().split(' ');
        var dateFromYear = $('#date-from-day option:selected').attr('data-hidden-year');
        $('#edit-field-time-und-0-value-year').val(dateFromYear);
        $('#edit-field-time-und-0-value-month').val(monthArray[dateFromStringArray[1]]);
        $('#edit-field-time-und-0-value-day').val(dateFromStringArray[2]*1);

        var endTimeSel = $('#end-time').val();
        var fromDateSel=new Date($('#edit-field-time-und-0-value-month option:selected').text() + ' '+$('#edit-field-time-und-0-value-day').val()+' '+$('#edit-field-time-und-0-value-year').val()+' '+$('#edit-field-time-und-0-value-hour').val()+':'+$('#edit-field-time-und-0-value-minute').val()+' '+$('#edit-field-time-und-0-value-ampm').val());
        var endTimeHourArray = [];
        var endTimeMinutes = 0;
        var eventLength = '';
        var eventLengthHrs = 0;
        var eventLengthMin = 15;
        $('#end-time option').each(function(i){
          fromDateSel.setMinutes(fromDateSel.getMinutes()+15);
          endTimeHourArray = time_convert_24_12(fromDateSel.getHours());
          endTimeMinutes = (fromDateSel.getMinutes() < 10) ? '0' + fromDateSel.getMinutes() : fromDateSel.getMinutes();
          $(this).attr('value',endTimeHourArray['hour']+':'+endTimeMinutes+' '+endTimeHourArray['ampm']);

          eventLength = '';
          if(((i+1) % 4) == 0){
            eventLengthHrs++;
            eventLengthMin = 0;
          }
          eventLength = ' ('+eventLengthHrs+'hr '+eventLengthMin+'min)';
          eventLengthMin = eventLengthMin + 15;
          $(this).text(getDayArray[fromDateSel.getDay()]+' '+ getMonthArray[fromDateSel.getMonth()] +' '+ fromDateSel.getDate()+', '+endTimeHourArray['hour']+':'+endTimeMinutes+' '+endTimeHourArray['ampm']+eventLength);
        });
        $('#end-time').val(endTimeSel);
        //
        //make end date equal to start date if to-time is later than from-time.  otherwise
        //make end date one day later than start date
        var fromDate = new Date($('#edit-field-time-und-0-value-month option:selected').text() + ' '+$('#edit-field-time-und-0-value-day').val()+' '+$('#edit-field-time-und-0-value-year').val()+' '+$('#edit-field-time-und-0-value-hour').val()+':'+$('#edit-field-time-und-0-value-minute').val()+' '+$('#edit-field-time-und-0-value-ampm').val());
        var toDate = new Date($('#edit-field-time-und-0-value-month option:selected').text() + ' '+$('#edit-field-time-und-0-value-day').val()+' '+$('#edit-field-time-und-0-value-year').val()+' '+$('#edit-field-time-und-0-value2-hour').val()+':'+$('#edit-field-time-und-0-value2-minute').val()+' '+$('#edit-field-time-und-0-value2-ampm').val());
        if(toDate <= fromDate){
          toDate.setDate(fromDate.getDate()+1);
        }
        //update original to-date select boxes and to-date summary text
        $('#edit-field-time-und-0-value2-year').val(toDate.getFullYear());
        $('#edit-field-time-und-0-value2-month').val(toDate.getMonth()+1);
        $('#edit-field-time-und-0-value2-day').val(toDate.getDate());
      });

      //change selection options for custom end-time select boxes when original to-date select boxes change
//      $('#edit-field-time-und-0-value-hour, #edit-field-time-und-0-value-minute, #edit-field-time-und-0-value-ampm,').change(function(){      
      $('#start-time').change(function(){
        var timeArrayHour = $(this).val().split(':');
        var timeArrayMinAP = timeArrayHour[1].split(' ');
        $('#edit-field-time-und-0-value-hour').val(timeArrayHour[0]);
        $('#edit-field-time-und-0-value-minute').val(timeArrayMinAP[0]);
        $('#edit-field-time-und-0-value-ampm').val(timeArrayMinAP[1]);
      
        var fromDateSel=new Date($('#edit-field-time-und-0-value-month option:selected').text() + ' '+$('#edit-field-time-und-0-value-day').val()+' '+$('#edit-field-time-und-0-value-year').val()+' '+$('#edit-field-time-und-0-value-hour').val()+':'+$('#edit-field-time-und-0-value-minute').val()+' '+$('#edit-field-time-und-0-value-ampm').val());
        var endTimeHourArray = [];
        var endTimeMinutes = 0;
        var eventLength = '';
        var eventLengthHrs = 0;
        var eventLengthMin = 15;
        $('#end-time option').each(function(i){
          fromDateSel.setMinutes(fromDateSel.getMinutes()+15);
          endTimeHourArray = time_convert_24_12(fromDateSel.getHours());
          endTimeMinutes = (fromDateSel.getMinutes() < 10) ? '0' + fromDateSel.getMinutes() : fromDateSel.getMinutes();
          $(this).attr('value',endTimeHourArray['hour']+':'+endTimeMinutes+' '+endTimeHourArray['ampm']);

          eventLength = '';
          if(((i+1) % 4) == 0){
            eventLengthHrs++;
            eventLengthMin = 0;
          }
          eventLength = ' ('+eventLengthHrs+'hr '+eventLengthMin+'min)';
          eventLengthMin = eventLengthMin + 15;
          $(this).text(getDayArray[fromDateSel.getDay()]+' '+ getMonthArray[fromDateSel.getMonth()] +' '+ fromDateSel.getDate()+', '+endTimeHourArray['hour']+':'+endTimeMinutes+' '+endTimeHourArray['ampm']+eventLength);
        });
        
        //if full start date is greater than end date or if start date is 24 hours or more less than end date, make end date equal to start date plus 1 hour.
        var fromDate = new Date($('#edit-field-time-und-0-value-month option:selected').text() + ' '+$('#edit-field-time-und-0-value-day').val()+' '+$('#edit-field-time-und-0-value-year').val()+' '+$('#edit-field-time-und-0-value-hour').val()+':'+$('#edit-field-time-und-0-value-minute').val()+' '+$('#edit-field-time-und-0-value-ampm').val());
        var toDate = new Date($('#edit-field-time-und-0-value2-month option:selected').text() + ' '+$('#edit-field-time-und-0-value2-day').val()+' '+$('#edit-field-time-und-0-value2-year').val()+' '+$('#edit-field-time-und-0-value2-hour').val()+':'+$('#edit-field-time-und-0-value2-minute').val()+' '+$('#edit-field-time-und-0-value2-ampm').val());
        var toDateMod = new Date($('#edit-field-time-und-0-value2-month option:selected').text() + ' '+$('#edit-field-time-und-0-value2-day').val()+' '+$('#edit-field-time-und-0-value2-year').val()+' '+$('#edit-field-time-und-0-value2-hour').val()+':'+$('#edit-field-time-und-0-value2-minute').val()+' '+$('#edit-field-time-und-0-value2-ampm').val());
        toDateMod.setHours(toDateMod.getHours() - 24);
        if(toDate <= fromDate || toDateMod >= fromDate){
          toDate = new Date($('#edit-field-time-und-0-value-month option:selected').text() + ' '+$('#edit-field-time-und-0-value-day').val()+' '+$('#edit-field-time-und-0-value-year').val()+' '+$('#edit-field-time-und-0-value-hour').val()+':'+$('#edit-field-time-und-0-value-minute').val()+' '+$('#edit-field-time-und-0-value-ampm').val());
          toDate.setHours(toDate.getHours()+1);
        }
        //update to-date select boxes and to-date summary text
        $('#edit-field-time-und-0-value2-year').val(toDate.getFullYear());
        $('#edit-field-time-und-0-value2-month').val(toDate.getMonth()+1);
        $('#edit-field-time-und-0-value2-day').val(toDate.getDate());
        endTimeHourArray = time_convert_24_12(toDate.getHours());
        endTimeMinutes = (toDate.getMinutes() < 10) ? '0' + toDate.getMinutes() : toDate.getMinutes();
        $('#edit-field-time-und-0-value2-hour').val(endTimeHourArray['hour']);
        $('#edit-field-time-und-0-value2-minute').val(endTimeMinutes);
        $('#edit-field-time-und-0-value2-ampm').val(endTimeHourArray['ampm']);
        $('#end-time').val($('#edit-field-time-und-0-value2-hour').val()+':'+$('#edit-field-time-und-0-value2-minute').val()+' '+$('#edit-field-time-und-0-value2-ampm').val());
      });
      //throw an initial change on the from hour
      $('#start-time').change();
      
      
      
      //update original to-time select boxes when custom end-time select box changes
      $('#end-time').change(function(){
        var timeArrayHour = $(this).val().split(':');
        var timeArrayMinAP = timeArrayHour[1].split(' ');
        $('#edit-field-time-und-0-value2-hour').val(timeArrayHour[0]);
        $('#edit-field-time-und-0-value2-minute').val(timeArrayMinAP[0]);
        $('#edit-field-time-und-0-value2-ampm').val(timeArrayMinAP[1]);
        
        var fromDate = new Date($('#edit-field-time-und-0-value-month option:selected').text() + ' '+$('#edit-field-time-und-0-value-day').val()+' '+$('#edit-field-time-und-0-value-year').val()+' '+$('#edit-field-time-und-0-value-hour').val()+':'+$('#edit-field-time-und-0-value-minute').val()+' '+$('#edit-field-time-und-0-value-ampm').val());
        var toDate = new Date($('#edit-field-time-und-0-value-month option:selected').text() + ' '+$('#edit-field-time-und-0-value-day').val()+' '+$('#edit-field-time-und-0-value-year').val()+' '+$('#end-time').val());
        if(toDate <= fromDate){
          toDate.setDate(fromDate.getDate()+1);
        }
        //update to-date select boxes and to-date summary text
        $('#edit-field-time-und-0-value2-year').val(toDate.getFullYear());
        $('#edit-field-time-und-0-value2-month').val(toDate.getMonth()+1);
        $('#edit-field-time-und-0-value2-day').val(toDate.getDate());
      });
      
      
     
      //add a new date spacer because i am hiding the regular ones because they
      //screwed up my floats
//      $(".form-item-field-time-und-0-value-hour").after('<span id="from-date-colon">:</span>');
//      $(".form-item-field-time-und-0-value2-hour").after('<span id="to-date-colon">:</span>');
      
      //this right here is some buuuuuuullllllshit i had to add because the ampm selectboxes
      //were magically dropping down one line on chrome and safari. then i realized that
      //setting display to none on the date-spacer did the trick. so i just
      //needed a new date spacer then (above)
/*
      $('#date-from-day').after($("#edit-field-time-und-0-value-ampm"));
      $('#date-from-day').after($("#edit-field-time-und-0-value-minute"));
      $('#date-from-day').after('<span id="from-date-colon">:</span>');
      $('#date-from-day').after($("#edit-field-time-und-0-value-hour"));
      $('#time-to-date-summary').after($("#edit-field-time-und-0-value2-ampm"));
      $('#time-to-date-summary').after($("#edit-field-time-und-0-value2-minute"));
      $('#time-to-date-summary').after('<span id="to-date-colon">:</span>');
      $('#time-to-date-summary').after($("#edit-field-time-und-0-value2-hour"));
*/
      //for recurring events, add the summary for the date of the last event
      $('#edit-field-recur-number-und').after('<span id="event-series-end-date"> </span>');
      
      //when from-date changes or number of recurrances changes, change the summary
      //text for the last event
      $('#edit-field-recur-number-und, #date-from-day').change(function(){
        var dateFromStringArray = $('#date-from-day').val().split(' ');
        var dateFromYear = $('#date-from-day option:selected').attr('data-hidden-year');
        var endDate = new Date(dateFromYear*1,monthArray[dateFromStringArray[1]]*1-1, dateFromStringArray[2]*1+($('#edit-field-recur-number-und').val()-1)*7);
        $('#event-series-end-date').text(' (last event is '+getMonthArray[endDate.getMonth()] +' '+ endDate.getDate() +', '+ endDate.getFullYear() + ')');      
      });
      $('#edit-field-recur-number-und').change();

      //hide the total number of events div until the recur checkbox is checked
      if($('#edit-field-recur-und:checked').length == 0){
        $('.form-item-field-recur-number-und').hide();        
      }
      $('#edit-field-recur-und').change(function(){
        if($('#edit-field-recur-und:checked').length){
          $('.form-item-field-recur-number-und').show();
        }
        else{
          $('.form-item-field-recur-number-und').hide();
        }
      });

      //remove default submission when pressing enter in text fields
      $('input[type="text"]').keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
          $(this).blur();
          $(this).change();
          e.preventDefault();
        }
      });

      //add a google map to check location of event
      
      $('#edit-field-location').after('<div id="addEventMap"></div>');
      var addEventMap = new google.maps.Map(document.getElementById('addEventMap'),{
        zoom: 14,
        //center of berkeley is (37.8717, -122.2728)
        //center of stanford is (37.426, -122.17)
        center: new google.maps.LatLng(37.426, -122.17),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        draggable: false
      });
      var searchNearMarker = new google.maps.Marker({
        position: new google.maps.LatLng(37.426, -122.17),
        map: addEventMap
      });
      
      
      //update map if location fields change
     
      var geocoder_api3;
      $('#edit-field-location-und-0-street, #edit-field-location-und-0-city, #edit-field-location-und-0-province').change(function(){ 
        var address_entered = $('#edit-field-location-und-0-street').val()+','+$('#edit-field-location-und-0-city').val()+','+$('#edit-field-location-und-0-province').val();
        if(!geocoder_api3) {
          geocoder_api3 = new google.maps.Geocoder();
        }
        var geocoderRequest = {
          address: address_entered
        }
        geocoder_api3.geocode(geocoderRequest, function(results, status) {
          $("#invalid-address").remove();
          if (status == google.maps.GeocoderStatus.OK) {
            var address_lat = results[0].geometry.location.lat();
            var address_lng = results[0].geometry.location.lng();
            addEventMap.setCenter(new google.maps.LatLng(address_lat, address_lng));
            searchNearMarker.setPosition(new google.maps.LatLng(address_lat, address_lng));
          }
          else{
            $("#edit-field-location").after('<div id="invalid-address"> This location is not valid </div>');            
          }
        });
      });
      //trigger change event on a location field to initialize map
      $('#edit-field-location-und-0-city').change();
      
      
      //hide the obviated fields
      $("#edit-field-time-und-0-value-month, #edit-field-time-und-0-value-day, #edit-field-time-und-0-value-year, #edit-field-time-und-0-value-hour, #edit-field-time-und-0-value-minute, #edit-field-time-und-0-value-ampm").hide();
      $("#edit-field-time-und-0-value2-month, #edit-field-time-und-0-value2-day, #edit-field-time-und-0-value2-year, #edit-field-time-und-0-value2-hour, #edit-field-time-und-0-value2-minute, #edit-field-time-und-0-value2-ampm").hide();
      
      //move required stars
      $("label[for='edit-field-time-und-0-value'] .form-required").appendTo("#edit-field-time .fieldset-legend");
      $("label[for='edit-field-time-und-0-value2'] .form-required").appendTo("#event-end-label");
      $("label[for='edit-field-time-und-0-value']").hide();
      $("label[for='edit-field-time-und-0-value2']").hide();
      
      $("label[for='edit-field-location-und-0-street']").html('Name of place/Address <span class="form-required" title="This field is required.">*</span>');
      
      $(".form-item-field-time-und-0-value-year, .form-item-field-time-und-0-value2-year").next(".date-spacer").html('&nbsp')
      
      //hide the text filtering section
      $("#edit-body-und-0-format").hide();
      
      //hide the delete location field
      $(".form-item-field-location-und-0-delete-location").hide();
      
      //hide the location legend
      $("#edit-field-location-und-0 legend").hide();
    }
  };
}) (jQuery);
