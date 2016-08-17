var ba = chrome.browserAction;
var intervalTime = Math.random() * 3000 * 60;

var baseUrl = 'https://review-api.udacity.com';
var token = 'your_api_key_here';

var data;

chrome.browserAction.onClicked.addListener(function(tab) {
	var destination = 'https://review.udacity.com/#!/submissions/dashboard';
	chrome.tabs.create({ url: destination });
});

function getRecentProjects() {

	var request = new XMLHttpRequest();
	request.open('GET', baseUrl + '/api/v1/me/certifications', true);
	request.setRequestHeader('Authorization', token)

	request.onload = function() {
		data = JSON.parse(request.responseText);
		if (request.status >= 200 && request.status < 400) {
			for (i = 0; i < data.length; i++) {
				if (isCertified() && isActiveProject()) {
					logListenProjects(data);
					changeNotificationStatus();
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

function removeCounterBadge() {
	ba.setBadgeBackgroundColor({color: [0, 255, 0, 128]});
	ba.setBadgeText({text: ''});
}

function addCounterBadge(itemCount) {
	ba.setBadgeBackgroundColor({color: [255, 0, 0, 128]});
	ba.setBadgeText({text: '' + itemCount});
}

function logListenProjects(data) {
	var msg = "listening project " + data[i].project['name'] + " with " 
				+ data[i].project['awaiting_review_count'] + " audit pending";
	console.log(msg);
}

function changeNotificationStatus() {
	if (hasAwaitingReviews())
		addCounterBadge(data.length);
	else if (haveNotAvailableReviews())
		removeCounterBadge();
}

function isCertified(status) {
	return data[i]['status'] == 'certified';
}

function isActiveProject() {
	return data[i]['active'];
}

function hasAwaitingReviews() {
	return data[i]['awaiting_review_count'] > 0;
}

function haveNotAvailableReviews(){
	return data[i]['awaiting_review_count'] == 0;
}

getRecentProjects();





