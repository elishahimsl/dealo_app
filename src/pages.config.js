import Home from './pages/Home';
import Snap from './pages/Snap';
import Library from './pages/Library';
import Preview from './pages/Preview';
import AIAssistant from './pages/AIAssistant';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Snap": Snap,
    "Library": Library,
    "Preview": Preview,
    "AIAssistant": AIAssistant,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};