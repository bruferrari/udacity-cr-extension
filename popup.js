var ba = chrome.browserAction;
var intervalTime = Math.random() * 5000 * 60; // variable time between 0-5 minutes

chrome.browserAction.onClicked.addListener(function(tab) {
	var destination = 'https://review.udacity.com/#!/submissions/dashboard';
	chrome.tabs.create({ url: destination });
});

function getRecentProjects() {
	var baseUrl = 'https://review-api.udacity.com';
	var token = 'api-key';

	var request = new XMLHttpRequest();
	request.open('GET', baseUrl+'/api/v1/me/submissions/assigned.json', true);
	request.setRequestHeader('Authorization', token)

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			console.log(data);
			if (data.length == 0) {
				setNoAvailableAuditNotification();
			} else if (data.length > 0) {
				setAvailableAuditNotification(data.length);
			}
		} else {
			// TODO: handle error
			console.log(data);
		}
	};

	request.onerror = function() {
		console.log(data);
	};

	request.send();

	setTimeout(getRecentProjects, intervalTime);
}

function setNoAvailableAuditNotification() {
	ba.setBadgeBackgroundColor({color: [255, 0, 0, 128]});
	ba.setBadgeText({text: ' '}); // remove the badge
}

function setAvailableAuditNotification(itemCount) {
	ba.setBadgeBackgroundColor({color: [255, 0, 0, 128]});
	ba.setBadgeText({text: '' + itemCount});
}

getRecentProjects();





