var ba = chrome.browserAction;
var intervalTime = Math.random() * 5000 * 60; // variable time between 0-5 minutes

chrome.browserAction.onClicked.addListener(function(tab) {
	var destination = 'https://review.udacity.com/#!/submissions/dashboard';
	chrome.tabs.create({ url: destination });
});

function getRecentProjects() {
	var baseUrl = 'https://review-api.udacity.com';
	var token = 'replace_by_your_api';

	var request = new XMLHttpRequest();
	var data;
	request.open('GET', baseUrl+'/api/v1/me/certifications', true);
	request.setRequestHeader('Authorization', token)

	request.onload = function() {
		data = JSON.parse(request.responseText);
		if (request.status >= 200 && request.status < 400) {
			for (i = 0; i < data.length; i++) {
				if (data[i]['status'] == 'certified' && data[i]['active']) {
					logListenProjects(data);
					if (data[i]['awaiting_review_count'] > 0)
						setAvailableAuditNotification(data.length);
					else if (data[i]['awaiting_review_count'] == 0)
						setNoAvailableAuditNotification();
				}
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
	ba.setBadgeBackgroundColor({color: [0, 255, 0, 128]});
	ba.setBadgeText({text: ''}); // remove the badge
}

function setAvailableAuditNotification(itemCount) {
	ba.setBadgeBackgroundColor({color: [255, 0, 0, 128]});
	ba.setBadgeText({text: '' + itemCount});
}

function logListenProjects(data) {
	console.log("listening project " + data[i].project['name'] + " with " 
									+ data[i].project['awaiting_review_count'] + " audit pending");
}

getRecentProjects();





