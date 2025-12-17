import News from './pages/News';
import ArticleView from './pages/ArticleView';
import __Layout from './Layout.jsx';


export const PAGES = {
    "News": News,
    "ArticleView": ArticleView,
}

export const pagesConfig = {
    mainPage: "News",
    Pages: PAGES,
    Layout: __Layout,
};