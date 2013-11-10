'use strict';

myApp.controller('ToDoListCtrl', function ToDoListCtrl($scope, PubNub) {
	$scope.items = [{ name: 'Photo Gallery'}, 
								{ name: 'To Do List'}, 
								{ name: 'Contacts List'}];
	$scope.editItem = function(item) {
		item.editMode = item.editMode ? false : true;
	}
	$scope.setCompletion = function(item) {
		item.completed = item.completed ? false : true;
	}
	$scope.removeItem = function(item) {
		$scope.items.splice($scope.items.indexOf(item), 1);
	}
	$scope.addItem = function(item) {
		$scope.items.push({name: item});
		$scope.newName = "";
		$scope.publish(item);
	}

	$scope.publish = function(newMessage) {
		var messageObject = {text: newMessage, from: $scope.myID};
	  PubNub.publish({
	    channel: $scope.selectedChannel,
	    message: messageObject
	  });
	  return $scope.newMessage = '';
	};

	$scope.subscribe = function() {
	  if (!$scope.newChannel) {
	    return;
	  }

	  $scope.channels.push($scope.newChannel);

	  PubNub.subscribe({
	    channel: $scope.channels.join(","),
	    message: function(message, env, channel) {
	      return $scope.$apply(function() {
	      	if (message.from != $scope.myID) {
	        	return $scope.items.push({name: message.text});
	        }
	        return;
	      });
	    }
	  });
	  $scope.selectedChannel = $scope.newChannel;
	  $scope.myID = $scope.makeID();
	  return $scope.newChannel = '';
	};

	$scope.select = function(channel) {
	  console.log('select', channel);
	  return $scope.selectedChannel = channel;
	};

	$scope.makeID = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
	}

	$scope.channels = [];
	$scope.messages = [];
	$scope.newChannel = $scope.selectedChannel = 'my_channel';
	$scope.subscribe();
});