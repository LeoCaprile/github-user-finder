import './styles.css';
import './js/jqueryPlugins';

const fetchUsersURL = (name) => `https://api.github.com/search/users?q=${name}&per_page=9`;

const userCardTemplate = (profileImg, name, followers, repos = 0) =>
	` <div class="card"> 

<img class="card-image" src="${profileImg}">
<div  class="title card-title">${name}</div>

<div class="card-item-container">
    <div class="card-item">
        <div class=""><i class="fas fa-users"></i>Follows</div>
        <div class="">${followers}</div>
    </div>

    <div class="card-item">
        <div><i class="fas fa-book"></i>Repos</div>
        <div>${repos}</div>
    </div>


</div>

</div>

`;

const loadingSpinerTemplate = `<div class="spinner"></div>`;

const displayCards = (name) => {
	$.get(fetchUsersURL(name), (data) => {
		const usersList = data.items;
		$('.card-container').html(loadingSpinerTemplate);
		for (let user of usersList) {
			const userName = user.login;

			$.get(`https://api.github.com/users/${userName}`, (userData) => {
				const a = $.create('a');
				const div = $.create('div');
				const userProfileImg = userData.avatar_url;
				const userRepos = userData.public_repos;
				const userFollowers = userData.followers;
				a.setAttribute('href', user.html_url);
				a.setAttribute('target', '__blank');
				a.innerHTML = userCardTemplate(userProfileImg, userName, userFollowers, userRepos);
				$('.card-container').append(a);
			}).done(() => $('.spinner').remove());
		}
	});
};

const conditionToDisplay = () => {
	const inputTextValue = $('.text-input').val();
	if (inputTextValue.length >= 4 && !/\W|_/g.test(inputTextValue)) {
		$('.card-container').empty();
		displayCards(inputTextValue);
	} else {
		$('.text-input').addTemporaryClass('text-input-invalid', 1500);
		$('.hidden-caption').addTemporaryClass('unhide', 2500);
	}
};

const searchUsers = () => {
	$('.button').click(() => {
		conditionToDisplay();
	});

	$('.text-input').keyup((e) => {
		if (e.keyCode == '13') {
			conditionToDisplay();
		}
	});
};

searchUsers();
