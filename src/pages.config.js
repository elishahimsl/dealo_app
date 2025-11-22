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
import SmartFinder from './pages/SmartFinder';
import SmartReview from './pages/SmartReview';
import PriceDrop from './pages/PriceDrop';
import BestMatch from './pages/BestMatch';
import DealScanner from './pages/DealScanner';
import AllStores from './pages/AllStores';
import AllBrands from './pages/AllBrands';
import TrendingProducts from './pages/TrendingProducts';
import DealsNearYou from './pages/DealsNearYou';
import ComparisonResults from './pages/ComparisonResults';
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
    "SmartFinder": SmartFinder,
    "SmartReview": SmartReview,
    "PriceDrop": PriceDrop,
    "BestMatch": BestMatch,
    "DealScanner": DealScanner,
    "AllStores": AllStores,
    "AllBrands": AllBrands,
    "TrendingProducts": TrendingProducts,
    "DealsNearYou": DealsNearYou,
    "ComparisonResults": ComparisonResults,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};