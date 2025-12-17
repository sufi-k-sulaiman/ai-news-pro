import TestFunctions from './pages/TestFunctions';
import DashboardComponents from './pages/DashboardComponents';
import Template from './pages/Template';
import ResumeBuilder from './pages/ResumeBuilder';
import SearchResults from './pages/SearchResults';
import Comms from './pages/Comms';
import ContactUs from './pages/ContactUs';
import News from './pages/News';
import NotFound from './pages/NotFound';
import StockComparison from './pages/StockComparison';
import __Layout from './Layout.jsx';


export const PAGES = {
    "TestFunctions": TestFunctions,
    "DashboardComponents": DashboardComponents,
    "Template": Template,
    "ResumeBuilder": ResumeBuilder,
    "SearchResults": SearchResults,
    "Comms": Comms,
    "ContactUs": ContactUs,
    "News": News,
    "NotFound": NotFound,
    "StockComparison": StockComparison,
}

export const pagesConfig = {
    mainPage: "News",
    Pages: PAGES,
    Layout: __Layout,
};