import { user, category, posts, trendingPosts } from './dummy.js';

window.onload = function () {
  //
  //
  let isSearchOpen = false;
  let isLoggedIn = false;

  /**
   * Login Functionalities
   */
  // Get Saved User Email and Password
  let localStorage = window.localStorage;
  let localEmail = localStorage.getItem('email');
  let localPassword = localStorage.getItem('password');

  let navigation = document.getElementById('navigation');
  let navNoLogin = document.getElementById('nav-action-nologin');
  let navLogin = document.getElementById('nav-action-login');
  let navGetStarted = document.getElementById('get-started');
  let navUserProfile = document.getElementById('nav-user-profile');

  // localStorage.clear();

  // Check Login First
  if (isUserLoggedIn()) {
    showLoggedInNavigation();
    initLogoutFunction();
    isLoggedIn = true;
  } else {
    showNotLogInNavigation();
    isLoggedIn = false;

    let getStarted = document.getElementById('get-started');
    getStarted.onclick = function () {
      showLoginModal();
    };
  }

  // Search
  let search = document.getElementById('search');
  let searchBox = document.getElementById('search-box');
  search.onclick = function () {
    if (!isSearchOpen) {
      searchBox.style.display = 'block';
    } else {
      searchBox.style.display = 'none';
    }
    isSearchOpen = !isSearchOpen;
  };

  window.onkeyup = function (event) {
    if (isSearchOpen && event.keyCode === 13) {
      let searchInput = document.getElementById('input-search');
      let searchText = searchInput.value;

      let searchedPosts = posts.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
      // console.log(searchedPosts);
      createPosts(searchedPosts);
    }
  };

  let modal = document.getElementById('loginModal');
  let signIn = document.getElementById('signIn');
  let close = document.getElementsByClassName('close')[0];

  // Show modal when click sign in
  signIn.onclick = function () {
    showLoginModal();
  };

  // Close modal when click x
  close.onclick = function () {
    hideLoginModal();
  };

  // Hide modal when click any part of it
  window.onclick = function (event) {
    if (event.target == modal) {
      hideLoginModal();
    }
  };

  // Login functionalities
  let btnLogin = document.getElementById('btnLogin');
  let email = document.getElementById('email');
  let password = document.getElementById('password');
  let error = document.getElementById('login-error');

  btnLogin.onclick = function () {
    if (user.email == email.value && user.password == password.value) {
      saveToLocalStorage(email.value, password.value);
      hideLoginModal();
      window.location.reload();
    } else {
      showLoginErrorMessage();
    }
  };
  // Make the Header Sticky
  let nav = document.getElementById('navigation');
  let btnGetStarted = document.getElementById('get-started');
  let sticky = nav.offsetTop;

  window.onscroll = function () {
    if (window.pageYOffset > sticky) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }

    if (window.pageYOffset > 379) {
      nav.classList.add('change-background');
      if (!isLoggedIn) {
        btnGetStarted.classList.add('get-started');
      }
    } else {
      nav.classList.remove('change-background');
      if (!isLoggedIn) {
        btnGetStarted.classList.remove('get-started');
      }
    }
  };

  // Create Trending Post From Mock Data
  let trendingPostsLayout = document.getElementById('trending-posts');

  trendingPosts.forEach((item, position) => {
    // Declare item
    const postReadMinute = getElement('span', ['tr-item-read'], '');
    const postDate = getElement('span', ['tr-item-postdate'], '');
    const postRead = getElement('p', ['half-opacity'], '');
    const postTitle = getElement('h4', ['pointer'], '');

    const userBlog = getElement('span', ['tr-item-userblog', 'pointer'], '');
    const userIn = getElement('span', ['half-opacity'], '');
    const userName = getElement('p', ['tr-item-username', 'bold', 'pointer']);
    const userImage = getElement('img', [], '');
    const trendingItemUser = getElement('div', [], 'tr-item-user');

    const trendingItemRight = getElement('div', [], 'tr-item-right');
    const trendingItem = getElement('div', ['trending-item'], 'trending-item');
    const trendingItemPosition = getElement('h1', ['half-opacity'], '');

    // Add Values
    postReadMinute.textContent = ` ${item.readMin}`;
    postDate.textContent = `${item.date} .`;
    postTitle.textContent = item.title;

    userBlog.textContent = item.user.blogName;
    userIn.textContent = ' in ';
    userName.textContent = item.user.name;
    userImage.setAttribute('src', item.user.photoUrl);

    trendingItemPosition.textContent = `0${position + 1}`;

    // Append
    trendingPostsLayout.appendChild(trendingItem);

    trendingItem.appendChild(trendingItemPosition);
    trendingItem.appendChild(trendingItemRight);

    trendingItemRight.appendChild(trendingItemUser);
    trendingItemRight.appendChild(postTitle);
    trendingItemRight.appendChild(postRead);

    trendingItemUser.appendChild(userImage);
    trendingItemUser.appendChild(userName);

    if (item.user.blogName) {
      userName.appendChild(userIn);
    }
    userName.appendChild(userBlog);

    postRead.appendChild(postDate);
    postRead.appendChild(postReadMinute);
  });

  // Creating posts from mock data
  let randomPost = document.getElementById('random-post');
  createPosts(posts);

  // Create Category
  let categoryLayout = document.getElementById('category-layout');
  category.forEach((item) => {
    // let categoryClass = item.replace(' ', '-').toLowerCase();
    let category = getElement('h4', ['category'], '');
    category.textContent = item;
    categoryLayout.appendChild(category);
  });

  let oldElement = null;

  window.onclick = function (event) {
    if (event.target.classList.contains('category')) {
      toggleCategory(event);
      let mCategory = event.target.textContent.toString();

      if (mCategory == 'All') {
        createPosts(posts);
      } else {
        let filteredPosts = posts
          .filter((element) =>
            element.category.some((categoryItem) => categoryItem == mCategory)
          )
          .map((element) => {
            return Object.assign({}, element, {
              category: element.category.filter(
                (categoryItem) => categoryItem == mCategory
              ),
            });
          });

        createPosts(filteredPosts);
      }
    }
  };

  /*
      All functions are place here
  */

  function toggleCategory(event) {
    if (oldElement) {
      oldElement.style.backgroundColor = '';
      oldElement.style.color = '';
      event.target.style.backgroundColor = 'black';
      event.target.style.color = 'white';
    } else {
      event.target.style.backgroundColor = 'black';
      event.target.style.color = 'white';
    }
    oldElement = event.target;
  }

  function createPosts(data) {
    randomPost.innerHTML = '';
    data.forEach((item) => {
      let postReadMin = getElement('span', ['post-item-read'], '');
      let postDate = getElement('span', ['post-item-date']);
      let postRead = getElement('p', ['half-opacity', 'post-read'], '');
      let postBody = getElement('p', ['post-body'], '');
      let postTitle = getElement('h1', [], '');
      let userBlog = getElement('span', ['tr-item-userblog', 'pointer'], '');
      let userIn = getElement('span', ['half-opacity'], '');
      let userName = getElement(
        'p',
        ['tr-item-username', 'bold', 'pointer'],
        ''
      );
      let userPhoto = getElement('img', [], '');
      let userLayout = getElement('div', [], 'tr-item-user');

      let postImage = getElement('img', [], '');
      let postLeft = getElement('div', [], 'post-left');
      let post = getElement('div', [], 'post');

      // Assign values
      postReadMin.textContent = item.readMin;
      postDate.textContent = `${item.date} . `;
      postBody.textContent = item.body;
      postTitle.textContent = item.title;
      userBlog.textContent = item.user.blogName;
      userIn.textContent = ' in ';
      userName.textContent = item.user.name;

      postImage.setAttribute('width', '200');
      postImage.setAttribute('height', '134');
      postImage.setAttribute('src', item.postImage);
      userPhoto.setAttribute('src', item.user.photoUrl);

      // Append
      randomPost.appendChild(post);
      post.appendChild(postLeft);
      post.appendChild(postImage);

      postLeft.appendChild(userLayout);
      postLeft.appendChild(postTitle);
      postLeft.appendChild(postBody);
      postLeft.appendChild(postRead);

      userLayout.appendChild(userPhoto);
      userLayout.appendChild(userName);
      if (item.user.blogName) {
        userName.appendChild(userIn);
      }
      userName.appendChild(userBlog);

      postRead.appendChild(postDate);
      postRead.appendChild(postReadMin);
    });
  }

  function initLogoutFunction() {
    // Logout
    let btnLogout = document.getElementById('logout');
    btnLogout.onclick = function () {
      localStorage.clear();
      window.location.reload();
    };
  }
  function isUserLoggedIn() {
    return localEmail && localPassword;
  }

  function showLoggedInNavigation() {
    navNoLogin.style.display = 'none';
    navLogin.style.display = 'flex';
    navigation.style.backgroundColor = 'white';

    navGetStarted.innerHTML = 'Upgrade';
    navGetStarted.id = 'upgrade';
    navUserProfile.display = 'block';
  }

  function showNotLogInNavigation() {
    navNoLogin.style.display = 'flex';
    navLogin.style.display = 'none';
    navUserProfile.remove();
  }

  function saveToLocalStorage(email, password) {
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
  }

  function showLoginErrorMessage() {
    error.style.display = 'block';
    setTimeout(function () {
      error.style.display = 'none';
    }, 2000);
  }

  function showLoginModal() {
    modal.style.display = 'flex';
  }

  function hideLoginModal() {
    modal.style.display = 'none';
  }

  // Create HTML Elements with class and id
  function getElement(elementName, elementClass, elementId) {
    let element = document.createElement(elementName);

    elementClass.forEach((item) => {
      element.classList.add(item);
    });

    if (elementId) {
      element.id = elementId;
    }

    return element;
  }
};
