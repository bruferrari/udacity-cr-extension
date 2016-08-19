var ba = chrome.browserAction;
var intervalTime = Math.random() * 3000 * 60;

var baseUrl = 'https://review-api.udacity.com';
var token = 'api-key-here';

var data;
var avaiableProjectsPtBr = 0;

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
					if (data[i].project['awaiting_review_count_by_language']['pt-br'] > 0)
						avaiableProjectsPtBr ++;
				}
			}
			updateNotificationStatus(avaiableProjectsPtBr);
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
	var ptReviews = data[i].project['awaiting_review_count_by_language']['pt-br'];
	var enReviews = data[i].project['awaiting_review_count_by_language']['en-us'];
	var chReviews = data[i].project['awaiting_review_count_by_language']['ch-zn'];
	var msg = "listening project " + data[i].project['name'] + " with " 
				+ data[i].project['awaiting_review_count'] + " reviews pending globally \n" 
				+ checkReviewsByLanguage(ptReviews) + " review(s) in pt-br\n"
				+ checkReviewsByLanguage(enReviews) + " review(s) in en-us\n"
				+ checkReviewsByLanguage(chReviews) + " review(s) in ch-zn\n";
	console.log(msg);
}

function updateNotificationStatus(qty) {
	if (qty == 0)
		removeCounterBadge();
	else if (qty > 0)
		addCounterBadge(qty);
}

function checkReviewsByLanguage(reviews) {
	if (typeof(reviews) == 'undefined') {
		return 0;
	} else {
		return reviews;
	}
}

function isCertified(status) {
	return data[i]['status'] == 'certified';
}

function isActiveProject() {
	return data[i]['active'];
}

function hasAwaitingReviews() {
	return data[i].project['awaiting_review_count'] > 0;
}

function hasAwaitingReviewsInPtBr() {
	return data[i].project['awaiting_review_count_by_language']['pt-br'] > 0;
}

function haveNotAvailableReviews(){
	return data[i]['awaiting_review_count'] == 0;
}

getRecentProjects();





