var ba = chrome.browserAction;
var intervalTime = Math.random() * 3000 * 60;

var baseUrl = 'https://review-api.udacity.com';
var token = 'api-key-here';

var data;
var notificated = [];

function Project(id, name, rate, quantity, lang) {
		this.id = id;
		this.name = name;
		this.rate = rate;
		this.quantity = quantity;
		this.lang = lang;
	}

chrome.browserAction.onClicked.addListener(function(tab) {
	var destination = 'https://review.udacity.com/#!/submissions/dashboard';
	chrome.tabs.create({ url: destination });
});

function getRecentProjects() {
	var availableReviews = 0;
	var request = new XMLHttpRequest();

	request.open('GET', baseUrl + '/api/v1/me/certifications', true);
	request.setRequestHeader('Authorization', token)

	request.onload = function() {
		data = JSON.parse(request.responseText);
		if (request.status >= 200 && request.status < 400) {
			for (i = 0; i < data.length; i++) {
				var project = data[i].project;
				if (isCertified() && isActiveProject()) {
					availableReviews += getAwaitingReviewCountByLanguage(project, 'pt-br');
					logListeningProjects(data);
					notify(project, 'pt-br');
				}
			}
			updateNotificationStatus(availableReviews);
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

function getAwaitingReviewCountByLanguage(project, lang) {
	var count = project['awaiting_review_count_by_language'][lang];
	return count > 0 ? count : 0;
}

function notify(project, lang) {
	if (project['awaiting_review_count_by_language'][lang] > 0) {
		var id = project['project_id'];
		var name = project['name'];
		var rate = project['price'];
		var qty = project['awaiting_review_count_by_language'][lang];
		var lang = lang;

		var proj = new Project(id, name, rate, qty, lang);

		createNotification(proj);
	}			
}

function isAlreadyNotificated(project) {
	for (i = 0; i < notificated.lenght; i++) {
		var obj = notificated[i];

		if (project.id == obj.id) {
			return true;
		}
		return false;
	}
}

function createNotification(project) {
	var opt = {
	  type: "basic",
	  title: "Awaiting Review",
	  message: project.name + " Rate: $" + parseInt(project.rate, 10) 
	  		+ '\nQuantity: ' + project.quantity + ' Language: ' + project.lang,
	  iconUrl: "icon.png"
	}

	chrome.notifications.create("example", opt, function callback(){
		console.log("Notification created!");
	});
}

function removeCounterBadge() {
	ba.setBadgeBackgroundColor({color: [0, 255, 0, 128]});
	ba.setBadgeText({text: ''});
}

function addCounterBadge(itemCount) {
	ba.setBadgeBackgroundColor({color: [255, 0, 0, 128]});
	ba.setBadgeText({text: '' + itemCount});
}

function logListeningProjects(data) {
	var formattedDateTime = formatDateTime(new Date());

	var ptReviews = data[i].project['awaiting_review_count_by_language']['pt-br'];
	var enReviews = data[i].project['awaiting_review_count_by_language']['en-us'];
	var chReviews = data[i].project['awaiting_review_count_by_language']['zh-cn'];
	var msg = formattedDateTime + " listening project " + data[i].project['name'] + " with " 
				+ data[i].project['awaiting_review_count'] + " reviews pending globally \n" 
				+ checkReviewsByLanguage(ptReviews) + " review(s) in pt-br\n"
				+ checkReviewsByLanguage(enReviews) + " review(s) in en-us\n"
				+ checkReviewsByLanguage(chReviews) + " review(s) in zh-cn\n";
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

function formatDateTime(date) {
	var hours = date.getHours();
	var formattedHours = hours % 12 || 12;
	var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	var seconds = date.getSeconds();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	var now = formattedHours + ':' + minutes + ':' + seconds +  ' ' + ampm;

	return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' at ' + now;
}

getRecentProjects();





