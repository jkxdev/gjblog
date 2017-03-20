/**
 * 
 */
BlogModule.factory('ChatData','$websocket', '$location', function($websocket,$location) {
    // Open a WebSocket connection
	var chatpath  = 'ws://' + $location.host() + '/chat';
	console.log(chatpath);
    var dataStream = $websocket(chatpath);

    var collection = [];

    dataStream.onMessage(function(message) {
      collection.push(JSON.parse(message.data));
    });

    var methods = {
      collection: collection,
      get: function() {
        dataStream.send(JSON.stringify({ action: 'get' }));
      }
    };

    return methods;
});
		
		
BlogModule.controller('chatController', ['$scope','$location','BakBakService', function($scope,$location,BakBakService) {
	$scope.MyChat = [];
	
	$scope.connectToChatserver = function()
    {
		console.log("char COntroller start");
        if ("WebSocket" in window)
        {
           // Let us open a web socket
           ws = new WebSocket(BakBakService.getHomePath("ws") + "/chat");
			
           ws.onopen = function()
           {
              // Web Socket is connected, send data using send()
              ws.send("Message to send");
              console.log("Message is sent...");
           };
           
           ws.onmessage = function (evt) 
           { 
              var received_msg = evt.data; 
              console.log(received_msg);
              $scope.MyChat.push(received_msg);
              $scope.$digest();
              //$scope.MyChat = collection;
           };
			
           ws.onclose = function()
           { 
        	   console.log("Connection is closed..."); 
           };
        }
        
        else
        {
           // The browser doesn't support WebSocket
        	console.log("WebSocket NOT supported by your Browser!");
        }
    }
	
	$scope.$watch(function(scope) 
		{ return scope.MyChat },
		function(newValue, oldValue) {
			$scope.myMsg=null;
	});
	
	$scope.sendchat = function()	{
		var user = localStorage.getItem("id");
		console.log($scope.myMsg);
		console.log(user);
		
		if ($scope.myMsg != "") {
			ws.send("user: "+user+" message: "+$scope.myMsg);   
		} 
	}
	$scope.connectToChatserver();
}]);
	

