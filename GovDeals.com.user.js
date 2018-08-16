// ==UserScript==
// @name         GovDeals.com
// @namespace    https://github.com/bcarroll/TamperMonkeyUserScripts
// @version      0.1
// @description  GovDeals.com enhancements
// @author       Brett Carroll
// @match        https://www.govdeals.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==
var $ = window.jQuery;
(function() {
    'use strict';

    var zipcode = '26101';// Zipcode to use for location search
    var radius = '100';// Radius (miles) to search from provided zipcode

    var url = window.location.href;

    if (url == 'https://www.govdeals.com/'){
        /*
        * Redirect to search by location page
        */
        window.location.replace('https://www.govdeals.com/index.cfm?fa=Main.AdvSearchResultsNew&zipcode=' + zipcode + '&miles=' + radius + '&milesKilo=miles&category=00&kWordSelect=2&locationType=miles&kWord=&country=&btn_submit=Submit&searchpg=location');
    } else if (url.includes('https://www.govdeals.com/index.cfm?fa=Main.Item&itemID=')){
        /*
        * Automatically click the first thumbnail image to open the slideshow
        $('#thumb1').click();
        */
        
        /*
        * Show fullsize images on Advanced Search results
        */
        var images = $('body').find('img');
        // If there are more than one items the first item image is at index 6
        var start = 6;
        // If there are only one items the first item image is at index 5
        if (images.length == 13){
            start = 5;
        }
        for ( var image=start; image < images.length - 7; image++){
            $(images)[image].src = $(images)[image].src.replace('/Thumbnails','');
        }
    } else if (url.indexOf('https://www.govdeals.com/index.cfm?fa=Main.ZipSearch') != -1){
        /*
        * Show fullsize images and the first page of items by location (ZipSearch)
        */
        var location_list = $("[title='click to view assets']");
        for (var index=0;index < location_list.length; index++){
            // get background color of current row
            var tr_bgcolor = $(location_list[index]).parent().parent().attr('bgcolor');
            // get URL of current row
            var listing_url = location_list[index].href;
            var listing_contents = '<tr bgcolor="' + tr_bgcolor + '"><td colspan="4"><table width="100%" id="list_' + index + '"></table></td></tr>';
            // add the new row after the current row
            $(location_list[index]).parent().parent().after(listing_contents);
            // get the contents of the page linked to by the current row and add all the items to the new row
            get(listing_url, 'list_' + index);
        }
    } else if (url.indexOf('https://www.govdeals.com/index.cfm?fa=Main.AdvSearchResults') != 1){
        /*
        * Show fullsize images on Advanced Search results
        */
        var images = $('body').find('img');
        // If there are more than one items the first item image is at index 6
        var start = 6;
        // If there are only one items the first item image is at index 5
        if (images.length == 13){
            start = 5;
        }
        for ( var image=start; image < images.length - 7; image++){
            $(images)[image].src = $(images)[image].src.replace('/Thumbnails','');
        }
    }


    function get(listing_url, id){
        $.ajax({
            url: listing_url,
            type: "GET",
            timeout: 5000,
            datattype: "html",
            success: function(data) {
                var content = $.parseHTML(data);
                var table = $(content).find('tbody')[0];
                var rows = $(table).find('tr');
                var x;
                for (var index=1; index < rows.length; index++){
                    var tr_content = $(table).find('tr')[index].innerHTML;
                    var listing_info = '';
                    for (var col=0; col < $(tr_content).length; col++){
                        var row_data = $(tr_content)[col].innerHTML;
                        if (row_data){
                        } else {
                            continue;
                        }
                        var image;
                        try {
                            image = $(row_data).find('img')[0];
                            if (image){
                                $(image).attr('src', $(image).attr('src').replace('/Thumbnails',''));
                                row_data += '<td><img src="' + $(image).attr('src') + '"></img></td>';
                            }
                        } catch(err) {}

                        listing_info += '<td>' + row_data + '</td>';

                    }
                    x += '<tr>' + listing_info + '</tr>';
                }
                $('#' + id).html(x);
            },
        });
    }
})();

