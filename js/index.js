/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    database_init();
    },
};
var scanner = function(){
    $("#Dev_ID").val("");
	cordova.plugins.barcodeScanner.scan(
		 function (result) {
          /*alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);*/
         $("#Dev_ID").val(result.text);
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
	);
};
var SelUcChange = function(){
    var index = $("#Dev_UC").val();
    $("#Dev_CC").val(index);
    $("#Dev_CC").css({'font-size':60});
    $("#Dev_CC").selectmenu('refresh');
    $("#Dev_CC").css({'font-size':60});
    UcOrCcChange() ;
    
};
var SelCcChange = function(){
    var index = $("#Dev_CC").val();
    $("#Dev_UC").val(index);
    $("#Dev_UC").selectmenu('refresh');
    UcOrCcChange() ;
};
