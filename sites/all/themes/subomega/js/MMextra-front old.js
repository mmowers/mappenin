/**
 * @file MMextra-front.js
 * 
 * Provides my javascript for the front page for switching between map view and list view
 */
(function ($) {
  Drupal.behaviors.MMextra_front = { 
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
        if (am_pm == "AM"){
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
      
      //my own implementation of google maps. much easier than gmap!:
      $("#page").append('<div id="eventMap"></div>');
      var eventMap = new google.maps.Map(document.getElementById('eventMap'),{
        zoom: 13,
        center: new google.maps.LatLng(42.03, -93.62),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false
      });
      
      //appending map to div id=page and positioning. Had to take the map out of its
      //original location because it needs to be absolutely positioned with respect to
      //the browser window
      $("#views-exposed-form-frontmap-page-1").appendTo($("#page"));
      
      //Switching views between map view and list view
      $(".view-display-id-page_1").hide();
      $("#switchviewbutton").attr('value','List');
      $("#switchviewbutton").toggle(function(){
        $("#eventMap").hide();
        $("#prev-next-result-container").hide();
        $(".view-display-id-page_1").show();
        $(this).attr('value','Map');
        return false;
      },function(){
        $("#eventMap").show();
        $("#prev-next-result-container").show();
        $(".view-display-id-page_1").hide();
        $(this).attr('value','List');
        return false;
      });
 
      //showing or hiding the exposed search form
      var gmap_was_visible = 1;
      $("#views-exposed-form-frontmap-page-1").hide();
//      $("#searchoptions").attr('value','New Search');
      $('#searchoptions').click(function(){
        $('#searchoptions').hide();
          $("#views-exposed-form-frontmap-page-1").show();
          $("#switchviewbutton").hide();
          if($("#eventMap").is(":visible")){
            gmap_was_visible = 1;
            $("#eventMap").hide();
            $("#prev-next-result-container").hide();
          }        
          else{
            gmap_was_visible = 0;
            $(".view-display-id-page_1").hide();
          }
        return false;
      });

      


      //adding custom date select boxes
      $('#edit-date-filter-wrapper').before(
      '<div id="from-date-custom-select">'+
        '<strong>Search time range</strong> <br /> from:'+
      '<select id="date-from-day"></select> &nbsp'+
      '<select id="date-from-hour">'+
        '<option>1</option><option>2</option><option>3</option>'+
        '<option>4</option><option>5</option><option>6</option><option>7</option>'+
        '<option>8</option><option>9</option><option>10</option><option>11</option><option>12</option>'+
      '</select>'+
      '<strong>:</strong>'+
      '<select id="date-from-min">'+
        '<option>00</option><option>15</option><option>30</option><option>45</option>'+
      '</select>'+
      '<select id="date-from-a-p">'+
        '<option>AM</option><option>PM</option>'+
      '</select></div>');
      var iDateOptionCount;
      for(iDateOptionCount=1;iDateOptionCount<=60;iDateOptionCount++){
        $('#date-from-day').append('<option data-hidden-year="hidden-year">'+iDateOptionCount+'</option>');
      }
      
      $('#edit-date-filter-1-wrapper').before(
      '<div id="to-date-custom-select"> to: &nbsp; &nbsp;'+
       '<select id="date-to-day"></select> &nbsp'+
      '<select id="date-to-hour">'+
        '<option>1</option><option>2</option><option>3</option>'+
        '<option>4</option><option>5</option><option>6</option><option>7</option>'+
        '<option>8</option><option>9</option><option>10</option><option>11</option><option>12</option>'+
      '</select>'+
      '<strong>:</strong>'+
      '<select id="date-to-min">'+
        '<option>00</option><option>15</option><option>30</option><option>45</option>'+
      '</select>'+
      '<select id="date-to-a-p">'+
        '<option>AM</option><option>PM</option>'+
      '</select></div>'+
      '<div class="frontmap-search-descriptions">happenings that overlap this time range are returned</div>'
      );
      for(iDateOptionCount=1;iDateOptionCount<=60;iDateOptionCount++){
        $('#date-to-day').append('<option data-hidden-year="hidden-year">'+iDateOptionCount+'</option>');
      }
      
      
      //when showing exposed search form, initialize custom date filter select boxes (defined above)
      //as follows: If drupal's from exposed filter is a lesser time than the current time rounded
      //down to the nearest 15 mins, than make the custom from date filters equal to the current time
      //rounded down. Otherwise, make the custom filters equal to drupal's exposed filter. Do the same
      //for the custom to-filters, except use 15 minutes later than now rounded down.
      $("#searchoptions").one("click",function(){
        
        //first use the values of the exposed filters to form a date, and use these
        //as the custom select box values if that date is later than now rounded
        //down to the nearest 15 mins. Otherwise, use now rounded down as the custom
        //select box values
        var fromDateInit=new Date($('#edit-date-filter-value-year').val()*1,$('#edit-date-filter-value-month').val()*1-1,$('#edit-date-filter-value-day').val()*1,$('#edit-date-filter-value-hour').val()*1,$('#edit-date-filter-value-minute').val()*1);
        var refDate = new Date();
        var min = refDate.getMinutes();
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
        refDate.setMinutes(min);
        if(fromDateInit < refDate){
          fromDateInit=refDate;
        }
        //in any case, use now rounded down to the nearest 15 mins (refDate) as the select
        //box options for #date-from-day
        var fromDateSel = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), refDate.getHours(), refDate.getMinutes());
        $('#date-from-day option').each(function(){
          $(this).text(getDayArray[fromDateSel.getDay()]+' '+getMonthArray[fromDateSel.getMonth()]+' '+fromDateSel.getDate());
          $(this).attr('data-hidden-year',fromDateSel.getFullYear());
          fromDateSel.setDate(fromDateSel.getDate()+1);
        });
        
        //set the currently selected option for date-from-day with fromDateInit
        $('#date-from-day').val(getDayArray[fromDateInit.getDay()]+' '+getMonthArray[fromDateInit.getMonth()]+' '+fromDateInit.getDate());
        
        //now set hours, minutes, and am/pm values with fromDateInit
        var hour_12_array = time_convert_24_12(fromDateInit.getHours()*1);
        $('#date-from-hour').val(hour_12_array['hour']);
        $('#date-from-a-p').val(hour_12_array['ampm']);
        var date_min = (fromDateInit.getMinutes() < 10) ? '0' + fromDateInit.getMinutes() : fromDateInit.getMinutes();
        $('#date-from-min').val(date_min);

        //Do the same process as above for toDate.  This time, refDate is just
        //15 minutes greater than it was, making the process simpler.
        var toDateInit=new Date($('#edit-date-filter-1-value-year').val()*1,$('#edit-date-filter-1-value-month').val()*1-1,$('#edit-date-filter-1-value-day').val()*1,$('#edit-date-filter-1-value-hour').val()*1,$('#edit-date-filter-1-value-minute').val()*1);
        refDate.setMinutes(refDate.getMinutes()+15);
        if(toDateInit < refDate){
          toDateInit=refDate;
        }
        
        //base the date-to-day selection options on date-from-day's current selection
        var dateFromStringArray = $('#date-from-day').val().split(' ');
        var dateFromYear = $('#date-from-day option:selected').attr('data-hidden-year');
        var toDateSel = new Date(dateFromStringArray[1]+' '+dateFromStringArray[2]*1+' '+dateFromYear);
        $('#date-to-day option').each(function(){
          $(this).text(getDayArray[toDateSel.getDay()]+' '+getMonthArray[toDateSel.getMonth()]+' '+toDateSel.getDate());
          $(this).attr('data-hidden-year',toDateSel.getFullYear());
          toDateSel.setDate(toDateSel.getDate()+1);
        });
        
        //set the currently selected option for date-to-day with toDateInit
        $('#date-to-day').val(getDayArray[toDateInit.getDay()]+' '+getMonthArray[toDateInit.getMonth()]+' '+toDateInit.getDate());
        
        //now set hours, minutes, and am/pm values with toDateInit
        hour_12_array = time_convert_24_12(toDateInit.getHours()*1);
        $('#date-to-hour').val(hour_12_array['hour']);
        $('#date-to-a-p').val(hour_12_array['ampm']);               
        date_min = (toDateInit.getMinutes() < 10) ? '0' + toDateInit.getMinutes() : toDateInit.getMinutes();
        $('#date-to-min').val(date_min);
      });

      
      //when custom from date select boxes change, change the custom to date day select
      //box *options* and, if full from time is greater than to time, change
      //the to time custom select boxes.
      $('#date-from-day, #date-from-hour, #date-from-a-p, #date-from-min, #date-to-day').change(function(){ 
        var dateFromStringArray = $('#date-from-day').val().split(' ');
        var dateFromYear = $('#date-from-day option:selected').attr('data-hidden-year');
        
        //store the from and to date objects for comparison later
        var fromDate = new Date(dateFromYear*1,
                                monthArray[dateFromStringArray[1]]*1-1,
                                dateFromStringArray[2]*1,
                                time_convert_12_24($('#date-from-hour').val(),$('#date-from-a-p').val())*1,
                                $('#date-from-min').val()*1);
                                
        var dateToStringArray = $('#date-to-day').val().split(' ');
        var dateToYear = $('#date-to-day option:selected').attr('data-hidden-year');
        
        var toDate = new Date(dateToYear*1,
                              monthArray[dateToStringArray[1]]*1-1,
                              dateToStringArray[2]*1,
                              time_convert_12_24($('#date-to-hour').val(),$('#date-to-a-p').val())*1,
                              $('#date-to-min').val()*1);
        
        if($(this).attr('id') == 'date-from-day'){
          //update the custom to date select box options so that dates earlier than the from date are not allowed
          var dateToString = $('#date-to-day').val();
          var toDateSel = new Date(dateFromStringArray[1]+' '+dateFromStringArray[2]*1+' '+dateFromYear);
          $('#date-to-day option').each(function(){
            $(this).text(getDayArray[toDateSel.getDay()]+' '+getMonthArray[toDateSel.getMonth()]+' '+toDateSel.getDate());
            $(this).attr('data-hidden-year',toDateSel.getFullYear());
            toDateSel.setDate(toDateSel.getDate()+1);
          });
          if(fromDate <= toDate){
            $('#date-to-day').val(dateToString); //this seems a little awkward...
          }
            
        }

        //if full from time is set higher than to time, update to time select boxes.
        //else reset to date to its initial value
        if(fromDate > toDate){
          $('#date-to-day').val($('#date-from-day').val());
          $('#date-to-hour').val($('#date-from-hour').val());
          $('#date-to-min').val($('#date-from-min').val());
          $('#date-to-a-p').val($('#date-from-a-p').val());
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
        '</select></div>');
      
      $("#additional-options-select").val("none");
      if($("#edit-requester-id-current").val()=="1"){
        $("#additional-options-select").val("faves");
      }
      else{
        $("#additional-options-select").val("none");
      }
      
      $("#edit-rid-wrapper, #edit-requester-id-current-wrapper").hide();      

      //add cancel button to exposed form
      $("#edit-submit-frontmap").after(
      '<div> <input type="submit" id="fake-search" value="Search!" />'+
      '<input type="submit" id="cancel-search" value="Cancel" /> </div>');
      $('#cancel-search').click(function(){
        $("#views-exposed-form-frontmap-page-1").hide();
        $("#searchoptions").show();
        $("#switchviewbutton").show();
        if(gmap_was_visible == 1){
          $("#eventMap").show();
          $("#prev-next-result-container").show();
        }
        else{
          $(".view-display-id-page_1").show();            
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
      $(".view-display-id-page_1 .views-row").each(function(i){
        latLngObj = new google.maps.LatLng($(this).children(".views-field-latitude").text(),$(this).children(".views-field-longitude").text());
        latLngs.push(latLngObj);
        titles.push('<div id="map-marker-title">'+$(this).children(".views-field-title").children(".field-content").html()+'</div>');
        hosts.push('<div id="map-marker-host">'+$(this).children(".views-field-name").children(".field-content").html()+'</div>');
        times.push('<div id="map-marker-time">'+$(this).children(".views-field-field-time").text()+'</div>');
        titletext.push($(this).children(".views-field-title").children(".field-content").text());
        hosttext.push($(this).children(".views-field-name").children(".field-content").text());
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
        icon: '/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png',
        zIndex: -50
      });
      
      //the content of the searchNearMarker infobubble is mostly summarizing what was selected.
      //however, the content is slightly different for with results and without results.
      //see the no results section for the different beginning.
      var searchNearContBeg = '<div id="withResultsContent">'+
        '<div id="searchnear-infobub-loc"> Searched ';

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
      var searchedFromTimeArray = time_convert_24_12($('#edit-date-filter-value-hour').val()*1);
      var searchedToTimeArray = time_convert_24_12($('#edit-date-filter-1-value-hour').val()*1);
      var addOptsBubbleDiv = '<br /><div id="searchnear-infobub-opts">Additional options: '+$("#additional-options-select option:selected").text()+'. </div>';
      if($("#additional-options-select").val()=="none"){
        addOptsBubbleDiv = '';
      }
      var keywordBubbleDiv = '<br /> <div id="searchnear-infobub-keyword">Keywords: '+$("#edit-title").val()+'.</div>';
      if($("#edit-title").val()==""){
        keywordBubbleDiv ='';
      }
      var mileOrMiles = " miles";
      if($('#edit-distance-search-distance').attr('value') == 1){
        mileOrMiles = " mile";
      }     
      var searchNearContEnd = 'within '+
        $('#edit-distance-search-distance').attr('value') + mileOrMiles+
        ' of here. </div><br /><div id="searchnear-infobub-time-range">Time range: <br />'+
        getMonthArray[$('#edit-date-filter-value-month').val()*1-1]+' '+$('#edit-date-filter-value-day').val()*1+' '+searchedFromTimeArray['hour']+':'+$('#edit-date-filter-value-minute').val()+searchedFromTimeArray['ampm']+
        ' to '+getMonthArray[$('#edit-date-filter-1-value-month').val()*1-1]+' '+$('#edit-date-filter-1-value-day').val()*1+' '+searchedToTimeArray['hour']+':'+$('#edit-date-filter-1-value-minute').val()+searchedToTimeArray['ampm']+
        '</div><br /><div id="searchnear-infobub-eventtypes">Event types: <br />'+eventTypesChecked+'</div>'+
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
      if(latLngs.length > 0){
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
              if(curMarkerIndex != i){                
                infoBubble.close();
                //if one of the other result markers is highlighted, dehighlight it
                if(curMarkerIndex != -1){
                  markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');                  
                  this.setZIndex(markerArray[curMarkerIndex].getZIndex() + 1);
                }
                //otherwise the searchNearMarker is highlighted, so dehightlight it.
                else{
                  searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png');                  
                  this.setZIndex(searchNearMarker.getZIndex() + 1);
                }
                infoBubble.setContent(titles[i] + hosts[i]+ times[i]);
                preMarkerIndex = curMarkerIndex;
                curMarkerIndex = i;
              }
              // I took the following lines out of the if statement because clicking
              // on the map also dehighlights the markers and closes their infobubbles
              infoBubble.open(eventMap, marker);
              this.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_'+(i+1)+'.png');
            });
          })(i, marker); //end closure
        }
        //extend the bounds by the searchNearMarker and then fit the window to the bounds
        bounds.extend(searchNearLatLngObj);
        eventMap.fitBounds(bounds);
        
        //initially, if we have any results, open and highlight the first result.
        infoBubble.setContent(titles[0] + hosts[0] + times[0]);
        infoBubble.open(eventMap, markerArray[0]);
        markerArray[0].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_1.png');
        
        //this funky code was necessary because fitBounds is asynchronous. see
        //http://stackoverflow.com/questions/4523023/using-setzoom-after-using-fitbounds-with-google-maps-api-v3
        zoomChangeBoundsListener = 
          google.maps.event.addListenerOnce(eventMap, 'bounds_changed', function() {
            this.setZoom(this.getZoom()-1);
            //this.setCenter(latLngs[0]);
          });
        setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);


        //If we have results, add one version of the searchNearMarker event handler:
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
          this.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');
        });

      }      
      //If we have no results, set no results content in the searchNearMarker and highlight it.
      //Also add the simple event handler specific to no results
      else if($('#edit-distance-search-distance').attr('value')*1){
        preMarkerIndex = curMarkerIndex;
        curMarkerIndex = -1;
        
        searchNearContBeg = '<div id="noResultsContent">'+
          '<div id="searchnear-infobub-loc"> Sorry, no events were found ';
        infoBubble.setContent(searchNearContBeg+searchNearContEnd);
        infoBubble.open(eventMap, searchNearMarker);
        searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');

        google.maps.event.addListener(searchNearMarker, 'click', function(){
          infoBubble.open(eventMap, searchNearMarker);
          this.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');
        });

      }
      //if we haven't yet serached, then bring up some helpful text
      else {
        preMarkerIndex = curMarkerIndex;
        curMarkerIndex = -1;
        
        searchNearContBeg = '<div id="introContent">'+
          '<div id="searchnear-infobub-loc"> <strong>Welcome!</strong> Press "<strong>New Search</strong>" above to begin searching, or press'+
          ' the <span class="green-arrow-color"><strong>green</strong></span> arrow in the upper right to navigate around the site. Remember to <a href="/user/register">register</a> or <a href="/user">login</a> to search your favorite venues!';
        infoBubble.setContent(searchNearContBeg);
        infoBubble.open(eventMap, searchNearMarker);
        searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');

        google.maps.event.addListener(searchNearMarker, 'click', function(){
          infoBubble.open(eventMap, searchNearMarker);
          this.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');
        });

      }
      
      
      //If we have at least 1 result, bring up the next and previous buttons and
      //handle when these are clicked
      if(latLngs.length > 0){
        var resultOrResults = ' results';
        if(latLngs.length == 1){
          resultOrResults = ' result';
        }
        $("#page").append('<div id="prev-next-result-container"><div id="prev-next-result">'+
         ' <input type="submit" id="prev-result" value="<<prev" />'+
          '<input type="submit" id="next-result" value="next>>" />'+
          '<p>Showing ' + latLngs.length + resultOrResults + '</p></div></div>');
        
        $('#prev-result').click(function(){
          $(this).blur();
          infoBubble.close(); 
          if(curMarkerIndex == -1){
            searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png');
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = latLngs.length - 1;
            markerArray[curMarkerIndex].setZIndex(searchNearMarker.getZIndex() + 1);
            infoBubble.setContent(titles[curMarkerIndex] + hosts[curMarkerIndex] + times[curMarkerIndex]);
            infoBubble.open(eventMap, markerArray[curMarkerIndex]);
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_'+(curMarkerIndex+1)+'.png');           
          }
          else if(curMarkerIndex == 0 ){
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');                                                
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = -1;            
            searchNearMarker.setZIndex(markerArray[preMarkerIndex].getZIndex() + 1);
            infoBubble.setContent(searchNearContBeg+searchNearContEnd);
            infoBubble.open(eventMap, searchNearMarker);
            searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');
          }
          else{
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');                                                
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = curMarkerIndex - 1;            
            markerArray[curMarkerIndex].setZIndex(markerArray[preMarkerIndex].getZIndex() + 1);
            infoBubble.setContent(titles[curMarkerIndex] + hosts[curMarkerIndex] + times[curMarkerIndex]);
            infoBubble.open(eventMap, markerArray[curMarkerIndex]);
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_'+(curMarkerIndex+1)+'.png');           
          }
          return false;
        });
        $('#next-result').click(function(){
          $(this).blur();
          infoBubble.close();
          if(curMarkerIndex == -1 ){
            searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png');                  
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = 0;            
            markerArray[curMarkerIndex].setZIndex(searchNearMarker.getZIndex() + 1);
            infoBubble.setContent(titles[curMarkerIndex]+ hosts[curMarkerIndex] + times[curMarkerIndex]);
            infoBubble.open(eventMap, markerArray[curMarkerIndex]);
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_'+(curMarkerIndex+1)+'.png');           
          }
          else if(curMarkerIndex < latLngs.length - 1 ){
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');                  
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = curMarkerIndex + 1;
            markerArray[curMarkerIndex].setZIndex(markerArray[preMarkerIndex].getZIndex() + 1);
            infoBubble.setContent(titles[curMarkerIndex]+ hosts[curMarkerIndex] + times[curMarkerIndex]);
            infoBubble.open(eventMap, markerArray[curMarkerIndex]);
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/number_'+(curMarkerIndex+1)+'.png');           
          }
          else{
            markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');                  
            preMarkerIndex = curMarkerIndex;
            curMarkerIndex = -1;
            searchNearMarker.setZIndex(markerArray[preMarkerIndex].getZIndex() + 1);
            infoBubble.setContent(searchNearContBeg+searchNearContEnd);
            infoBubble.open(eventMap, searchNearMarker);
            searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/White/symbol_almost.png');
          }
          return false;
        });
      }

      //when the map is clicked outside of a marker, close infobubble and dehighlight
      //the currently highlighted marker.
      google.maps.event.addListener(eventMap, 'click', function(){
        infoBubble.close();
        if(curMarkerIndex > -1){
          markerArray[curMarkerIndex].setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Dark/number_'+(curMarkerIndex+1)+'.png');          
        }
        else{
          searchNearMarker.setIcon('/sites/all/modules/custom/tinbully_glue/google map markers/Light/symbol_almost.png');
        }
      });
      
      //using user-entered address and google geocoder (api 3) to fill the longitude
      //and latitude fields in the exposed form
      var geocoder_api3;
      $('#fake-search').click(function(){        //update the exposed time filters with custom values
        var dateFromStringArray = $('#date-from-day').val().split(' ');
        var dateFromYear = $('#date-from-day option:selected').attr('data-hidden-year');
        $('#edit-date-filter-value-year').val(dateFromYear);
        $('#edit-date-filter-value-month').val(monthArray[dateFromStringArray[1]]);
        $('#edit-date-filter-value-day').val(dateFromStringArray[2]*1);
        $('#edit-date-filter-value-hour').val(time_convert_12_24($('#date-from-hour').val(),$('#date-from-a-p').val()));        
        $('#edit-date-filter-value-minute').val($('#date-from-min').val());

        //do the same for exposed to-time filters
        var dateToStringArray = $('#date-to-day').val().split(' ');
        var dateToYear = $('#date-to-day option:selected').attr('data-hidden-year');
        $('#edit-date-filter-1-value-year').val(dateToYear);
        $('#edit-date-filter-1-value-month').val(monthArray[dateToStringArray[1]]);
        $('#edit-date-filter-1-value-day').val(dateToStringArray[2]*1);        
        $('#edit-date-filter-1-value-hour').val(time_convert_12_24($('#date-to-hour').val(),$('#date-to-a-p').val()));
        $('#edit-date-filter-1-value-minute').val($('#date-to-min').val());        
        
        //set the additional options
        $("#edit-rid").val('All');
        if($("#additional-options-select").val() == 'faves'){
          $("#edit-requester-id-current").val('1');          
        }
        else{
          $("#edit-requester-id-current").val('All');
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

      function success(position){
        $('#edit-distance-latitude').attr('value',position.coords.latitude);
        $('#edit-distance-longitude').attr('value',position.coords.longitude);
        $('#edit-distance-search-distance').attr('value',$('#search-within-select').val());
        $('#views-exposed-form-frontmap-page-1').submit();
      }
      function fail(){
        $("#views-exposed-form-frontmap-page-1 .views-exposed-widgets.clearfix").before('<span id="invalid-address"> Current location unavailable. Enter address </span>');
      }

    }
  };
}) (jQuery);
