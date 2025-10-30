import Home from './pages/Home';
import Snap from './pages/Snap';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Snap": Snap,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};