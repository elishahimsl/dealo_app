import Home from './pages/Home';
import Snap from './pages/Snap';
import Library from './pages/Library';
import Preview from './pages/Preview';
import AIAssistant from './pages/AIAssistant';
import Compare from './pages/Compare';
import Profile from './pages/Profile';
import Splash from './pages/Splash';
import MyCart from './pages/MyCart';
import More from './pages/More';
import Achievements from './pages/Achievements';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Snap": Snap,
    "Library": Library,
    "Preview": Preview,
    "AIAssistant": AIAssistant,
    "Compare": Compare,
    "Profile": Profile,
    "Splash": Splash,
    "MyCart": MyCart,
    "More": More,
    "Achievements": Achievements,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};