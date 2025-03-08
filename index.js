// Initialisation
const markdownLinkPattern = /\[(.*?)\]\((.*?)\)/;
const urlPattern =
    /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;

class Link {
    constructor(url, title = "Source") {
        this.url = url;
        this.title = title;
    }

    ToMarkdown() {
        return `[${this.title}](${this.url})`;
    }
    ToMarkdown(value) {
        return `[${value ?? Title}](${Url})`;
    }
}

// Enum Category en JavaScript (supposée pour l'exemple)
const Category = {
    Youtube: "Youtube",
    Articles: "Articles",
    Tools: "Tools",
    Podcast: "Podcast",
    Livre: "Livre",
    PutAside: "PutAside",
};

// Classe Article en JavaScript
class Article {
    // Constructeur privé simulé en JavaScript
    constructor(title, description, urls, category) {
        this.title = title;
        this.description = description;
        this.urls = urls;
        this.category = category;
        this.categoryMd = this.toCategoryString(category)
    }

    toCategoryString(category) {
      switch (category) {
        case 'Youtube':
          return '🎞️ Youtube';
        case 'Articles':
          return '📖 Articles';
        case 'Tools':
          return '🛠️ Tools';
        case 'Podcast':
          return '🎧 Podcasts';
        case 'Livre':
          return '📚 Livres';
        default:
          return 'Autre';
      }
    }
    // Méthode statique pour créer une instance de Article
    static create(title, description, urls, category) {
        return new Article(title, description, urls, category);
    }
}

function convertToArticle(article) {
    var urls = extractRegexPattern(article.content, markdownLinkPattern);
    var descriptionWithoutLinks = removeRegexPattern(
        article.description,
        markdownLinkPattern
    );

    var otherUrls = extractRegexPattern(
        article.description,
        markdownLinkPattern
    );
    var descriptionWithoutUrls = removeRegexPattern(
        descriptionWithoutLinks,
        urlPattern
    );

    var item = Article.create(
        article.content,
        cleanText(descriptionWithoutUrls),
        removeDoublon(urls.concat(otherUrls)),
        convertToCategory(article.section)
    );
    return item;
}

function extractRegexPattern(input, pattern) {
    if (!input) {
        return [];
    }

    const matches = [...input.matchAll(new RegExp(pattern, "g"))];
    const links = [];

    matches.forEach((match) => {
        if (match.length === 1) {
            links.push(new Link(removeLastCharIfIsPoint(match[0])));
        } else if (match.length > 2) {
            links.push(new Link(removeLastCharIfIsPoint(match[2]), match[1]));
        }
    });

    return links;
}

function removeRegexPattern(input, pattern) {
    if (!input) {
        return "";
    }

    const regex = new RegExp(pattern, "g");
    return input.replace(regex, "");
}

function removeLastCharIfIsPoint(input) {
    return input.endsWith(".") ? input.slice(0, -1) : input;
}

function cleanText(input) {
    if (input.length === 1) {
        return "";
    }
    return input.replace(/\n/g, "").replace(/- /g, "").replace(/-/g, "");
}

function removeDoublon(links) {
    const uniqueLinksMap = new Map();

    links.forEach((link) => {
        uniqueLinksMap.set(link.url, link);
    });

    return Array.from(uniqueLinksMap.values());
}

function convertToCategory(content) {
    // Utiliser un objet pour mapper les entiers aux catégories
    const categoryMap = {
        181074705: Category.Youtube,
        179438112: Category.Articles,
        181074629: Category.Tools,
        184011119: Category.Podcast,
        184719314: Category.Livre,
    };

    // Retourner la catégorie correspondante ou PutAside par défaut
    return categoryMap[content] || Category.PutAside;
}

function healthCheck() {
    console.log("OK");
    return "OK";
}

function testToto(data){
    return data;
}

function convertToArticles(params) {
    var articles = params.map((item) => {
        return convertToArticle(item); // item.json
    });

    return articles;
}

module.exports = { convertToArticles, healthCheck, testToto };