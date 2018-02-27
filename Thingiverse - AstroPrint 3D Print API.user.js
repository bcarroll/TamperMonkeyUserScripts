// ==UserScript==
// @name         Thingiverse - AstroPrint 3D Print API
// @namespace    https://github.com/bcarroll/TamperMonkeyUserScripts
// @version      0.1
// @description  AstroPrint 3D Print API for Thingiverse STL files
// @author       Brett Carroll
// @match        https://www.thingiverse.com/thing*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $('body').append('<script type="text/javascript" src="https://cloud.astroprint.com/js/min/lib/astroprint.import.js"></script>');
    var thingfiles = $('.thing-file-download-link');
    for (var index=0;index < thingfiles.length; index++){
        $(thingfiles[index]).after($('<button style="position:relative;top:5px;left:75px;" class="astroprint-import" data-ap-download-url="' + thingfiles[index].href + '" data-ap-name="' + $(thingfiles[index]).attr("data-file-name") + '">Print with AstroPrint</button>'));
    }
})();