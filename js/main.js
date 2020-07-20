// Article Class: Represent an Article Class
class Article{
    constructor(title, url){
        this.title = title;
        this.url = url;
    }
}

// UI Class: Handle UI task
class UI{
    static displayArticle(){
        const articles = Store.getArticle();

        articles.forEach((article) => UI.addArticleToList(article));
    }

    static addArticleToList(article){
        const list = document.querySelector('#article-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${article.title}</td>
            <td><a href="${article.url}" target="_blank">${article.url}</a></td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteArticle(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.classList = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#article-form');
        container.insertBefore(div, form);

        // vanish in 3 secs
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#article').value = '';
    }
}

// Store Class: Handle Storage
class Store{
    static getArticle(){
        let articles;

        if(localStorage.getItem('articles') == null){
            articles = [];
        }
        else{
            articles = JSON.parse(localStorage.getItem('articles'));
        }

        return articles;
    }

    static addArticle(article){
        const articles = Store.getArticle();

        articles.push(article);

        localStorage.setItem('articles', JSON.stringify(articles));
    }

    static removeArticle(url){
        const articles = Store.getArticle();

        articles.forEach((article, index) => {
            if(article.url === url){
                articles.splice(index, 1);
            }

            localStorage.setItem('articles', JSON.stringify(articles));
        })
    }
}

// Events: Displays Article
document.addEventListener('DOMContentLoaded', UI.displayArticle);

// Events: Add Articles
document.querySelector('#article-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Get Form Value
    let title = document.querySelector('#title').value;
    let url = document.querySelector('#article').value;

    // validate
    if(title == "" || url == ""){
        UI.showAlert("please Fill all fields", 'danger');
    }
    else{
        // Instantiate Article
        const article = new Article(title, url);

        // Add Article to UI
        UI.addArticleToList(article);

        // Add Article to Store
        Store.addArticle(article);

        // Show Success Message
        UI.showAlert("Article Added", 'success');

        // Clear fields
        UI.clearFields();
    }
})

// Events: Remove Books

document.querySelector('#article-list').addEventListener('click', (e) => {
    // Remove UI
    UI.deleteArticle(e.target)

    // Remove From localStorage
    Store.removeArticle(e.target.parentElement.previousElementSibling.textContent);

    // Show Success Message
    UI.showAlert("Article Removed", 'success');
});