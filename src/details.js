const postElement = document.getElementById('post');
const btn = document.getElementById('btn');

btn.addEventListener('click', toBack);

let post = {};

if (localStorage.getItem('post')) {
    post = JSON.parse(localStorage.getItem('post'));
    renderPost(post);
}

function renderPost(post) {
    postHTML = `
    <h4 class="post__title">
        ${post.title}
    </h4>
    <p class="post__body">
        ${post.body}
    </p>
    <p class="post__name">
        <span>Name:</span>
        ${post.name}
    </p>
    <p class="post__author">
        <span>Author:</span>
        ${post.author}
    </p>
    <p class="post__email">
    <span>Email:</span>
    <a href="mailto:">${post.email}</a>
    </p>
    `

    postElement.insertAdjacentHTML('afterbegin', postHTML);
}

// function to return the page back
function toBack() {
    location.href = "file:///C:/Users/bakyt/Desktop/test_task/index.html"
}
