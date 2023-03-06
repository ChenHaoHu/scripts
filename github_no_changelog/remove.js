// ==UserScript==
// @name         github no changelog
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove useless github changelog
// @author       You
// @match        https://github.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var targetNode = document.getElementsByClassName("team-left-column")[1];

    // Create a MutationObserver instance
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            console.log(mutation)
            var changlogDom = document.getElementsByClassName("dashboard-changelog")[0];
            if (changlogDom != undefined){
                changlogDom.remove()
            }
        });
    });

    // Configure MutationObserver Listener
    var config = { childList: true };

    // Start listening for changes in DOM elements
    observer.observe(targetNode, config);
})();