import { Navigate, useRoutes } from "react-router-dom";
// import Home from "./Components/Home/Home";
import SearchResult from "./Components/Search/SearchResult";
import SearchResultIMDB from "./Components/Search/SearchResultIMDB";
import { Login } from './Components/Auth/Login';
import { Register } from './Components/Auth/Register';
import { lazy, Suspense, useContext } from "react";
import { AuthContex } from "./Contexts/AuthContext";
import ErrorLogo from "./Constants/Error/ErrorLogo";
import Profile from "./Pages/Profile/Profile";
import EmailLinkLogin from "./Pages/EmailLinkLogin/EmailLinkLogin";
import AddItem from "./Pages/AddItem/AddItem";
import WatchLog from "./Pages/WatchLog/WatchLog";
import EditItem from "./Pages/EditItem/EditItem";
import HomePage2 from "./Pages/Home2/HomePage2";
import Loader from "./Pages/Loader/Loader";

const ViewPage = lazy(() => import("./Pages/ViewPage/ViewPage"));

export default function Router() {
    const { user } = useContext(AuthContex);

    let watchLogRoute = <Navigate to="/register" replace />;
    if (user) { watchLogRoute = <WatchLog /> };

    const Protected = ({ user, children }) => {
        if (!user) {
            return children;
        } else {
            return <Navigate to="/" replace />;
        }
    };

    const UserRoute = ({ user, children }) => {
        if (!user) {
            return <Navigate to="/register" replace />;
        } else {
            return children;
        }
    };

    return useRoutes([
        {
            path: '/',
            element: <HomePage2 />,
            // children: [
            //     { path: 'app', element: <DashboardApp /> },
            //     { path: 'user', element: usersRoute },
            //     { path: 'products', element: <Products /> },
            //     { path: 'blog', element: <Blog /> },
            //     { path: 'viewproduct/:id', element: <ProductView /> },
            //     { path: 'create', element: createPost },
            //     { path: 'result', element: resultRoute },
            //     { path: 'profile', element: profileRoute },
            //     // { path: 'editProfile', element: editProfile },
            // ],
        },
        { path: 'myposts', element: 'element here' },
        { path: 'search/:query', element: <SearchResult /> },
        { path: 'searchv2/:query', element: <SearchResultIMDB /> },
        { path: 'login', element: <Protected user={user}> <Login /> </Protected> },
        { path: 'register', element: <Protected user={user}> <Register /> </Protected> },
        { path: 'addItem', element: <UserRoute user={user}> <AddItem /> </UserRoute> },
        { path: 'profile', element: <UserRoute user={user}> <Profile /> </UserRoute> },
        { path: 'emailLinkLogin', element: <Protected user={user}> <EmailLinkLogin /> </Protected> },
        { path: 'watchLog', element: watchLogRoute },
        { path: 'editItem/:id', element: <UserRoute user={user}> <EditItem /> </UserRoute> },
        { path: 'movie/:id', element: <Suspense fallback={<Loader page />}> <ViewPage /> </Suspense> },
        // emailLinkLogin

        // {
        //     path: '/',
        //     element: <LogoOnlyLayout />,
        //     children: [
        //         { path: '/', element: <Navigate to="/dashboard/products" /> },
        //         { path: '404', element: <NotFound /> },
        //         { path: '*', element: <Navigate to="/404" /> },
        //     ],
        // },
        {
            path: '*',
            element: <ErrorLogo />,
        },
    ]);
}
