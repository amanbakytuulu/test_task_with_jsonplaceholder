const postsElement = document.getElementById('posts');
const select = document.getElementsByName('search')[0];
const input = document.getElementById('searching');
const pagination = document.getElementById('paginate');

postsElement.addEventListener('click', postDetails);
select.addEventListener('change', () => input.value = "");
input.addEventListener('keyup', searchBy);
pagination.addEventListener('click', changePage);

let posts = [];
let filterPosts = [];
let usersLength = [];


if (!localStorage.getItem('posts')) {
    // remove currentId and previousId from localStorage
    localStorage.removeItem('currentId');
    localStorage.removeItem('previousId');
    // remove currentId and previousId from localStorage
    fetchData()
        // pagination
        .then(() => usersLength.map((userId) => renderPage(userId)));
} else {
    // remove currentId and previousId from localStorage
    localStorage.removeItem('currentId');
    localStorage.removeItem('previousId');
    // remove currentId and previousId from localStorage
    posts = (JSON.parse(localStorage.getItem('posts')));
    // creating pagination by users id
    usersLength = JSON.parse(localStorage.getItem('usersLength'));
    filterPosts = posts;

    for (let i = 0; i < 10; i++) {
        renderPost(filterPosts[i]);
    }
    // pagination
    usersLength.map((userId) => renderPage(userId));
}

//function that takes data from users(author,name,email and phone) and adds it to posts
// that is, combines data
function matchUsersToPost(data, users) {
    let posts = data.map((post) => {
        let user = users.filter((user) => {
            return user.id === post.userId;
        })[0];
        return {
            ...post,
            author: user.name,
            name: user.username,
            email: user.email,
            phone: user.phone
        }
    });
    return posts;
}

// function for fetching all posts from jsonplaceholder
async function fetchData() {

    const response_1 = await fetch('https://jsonplaceholder.typicode.com/posts');
    const response_2 = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response_1.json();
    const users = await response_2.json();

    posts = matchUsersToPost(data, users);
    // saving posts to localStorage
    localStorage.setItem('posts', JSON.stringify(posts));
    // saving users for pagination to localStorage
    localStorage.setItem('usersLength', JSON.stringify(users.map((user) => user.id)));

    filterPosts = posts;

    for (let i = 0; i < 10; i++) {
        renderPost(filterPosts[i]);
    }
    // creating pagination by users id
    usersLength = users.map((user) => user.id);
}
// function for fetching all posts from jsonplaceholder


// function for switching to another link
function postDetails(event) {
    if (event.target.closest('.post')) {
        const postId = event.target.closest('.post').getAttribute('id');
        // if you clicked the button then delete the post
        if (event.target.closest('button')) {
            deletePost(postId)
        }
        else {
            // else follow the link
            const postId = event.target.closest('.post').getAttribute('id');
            const post = posts.filter((post) => post.id === Number(postId));
            localStorage.setItem('post', JSON.stringify(post[0]));
            location.href = "file:///C:/Users/bakyt/Desktop/test_task/postDetails.html";
        }

    }
}

// function for searching by author, title and body
function searchBy(e) {
    // deleting data from the page
    postsElement.innerHTML = "";

    if (e.target.value !== "") {
        value = e.target.value.toLowerCase();
        switch (select.options[select.selectedIndex].value) {
            case 'author':
                filterPosts = posts.filter((post) => post.author.toLowerCase().includes(value));
                filterPosts.map((post) => renderPost(post));
                break;
            case 'title':
                filterPosts = posts.filter((post) => post.title.toLowerCase().includes(value));
                filterPosts.map((post) => renderPost(post));
                break;
            case 'body':
                filterPosts = posts.filter((post) => post.body.toLowerCase().includes(value));
                filterPosts.map((post) => renderPost(post));
                break;
            default:
                return;
        }
    } else {
        const previousId = JSON.parse(localStorage.getItem('previousId')) || 0;
        const currentId = JSON.parse(localStorage.getItem('currentId')) || 10;

        filterPosts = posts.filter((post) => post.id > (previousId * 10) && post.id <= (currentId * 10));
        filterPosts.map((post) => renderPost(post));
    }
}

function changePage(event) {
    for (let page of pagination.children) {
        page.classList.remove('active');
    }
    // if clicked exactly tag a then change posts in the page
    if (event.target.closest('a')) {
        event.target.closest('a').classList.add('active');
        const previousId = event.target.closest('a').previousElementSibling ?
            event.target.closest('a').previousElementSibling.getAttribute('id')
            : '0';
        const currentId = event.target.closest('a').getAttribute('id');
        changePosts(previousId, currentId);
    }
}

function changePosts(previousId, currentId) {
    // deleting data from the page
    postsElement.innerHTML = "";
    // previosId is adding localStorage
    localStorage.setItem('previousId', JSON.stringify(previousId));
    localStorage.setItem('currentId', JSON.stringify(currentId));
    // previosId is adding localStorage
    for (let i = (previousId * 10); i < (currentId * 10); i++) {
        renderPost(filterPosts[i]);
    }
}

function deletePost(id) {
    // deleting data from the page
    postsElement.innerHTML = "";
    filterPosts = filterPosts.filter((post) => post.id !== Number(id));

    // rendering new changed post
    for (let i = 0; i < 10; i++) {
        renderPost(filterPosts[i]);
    }
    localStorage.setItem('posts', JSON.stringify(filterPosts));

}

// function for rendering page by users
function renderPage(page) {
    pageHTML = `
        <a href="#" 
        id="${page}"
        class="${page === 1 ? 'active' : ''}">
            ${page}
        </a>
    `

    pagination.innerHTML += pageHTML;
}

// function for rendering post
function renderPost(post) {
    postHTML = `
    <div id="${post.id}" class="post">
    <button type="button" id="delete">&#10006;</button>
    <h4 class="post__title">
        ${post.title}
    </h4>
    <p class="post__body">
        ${post.body}
    </p>
    <p class="post__author">
        <span>Author:</span>
        ${post.author}
    </p>
    </div>
    `

    postsElement.innerHTML += postHTML;
}

