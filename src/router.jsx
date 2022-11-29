import { Navigate, useRoutes } from "react-router-dom";
import { Login } from './Components/Auth/Login';
import { Register } from './Components/Auth/Register';
import { lazy, Suspense, useContext } from "react";
import { AuthContex } from "./Contexts/AuthContext";
import Loader from "./Pages/Loader/Loader";
// Lazy loading
const SearchResult = lazy(() => import("./Components/Search/SearchResult"));
const SearchResultIMDB = lazy(() => import("./Components/Search/SearchResultIMDB"));
const ErrorLogo = lazy(() => import("./Constants/Error/ErrorLogo"));
const Profile = lazy(() => import("./Pages/Profile/Profile"));
const AddItem = lazy(() => import("./Pages/AddItem/AddItem"));
const WatchLog = lazy(() => import("./Pages/WatchLog/WatchLog"));
const EditItem = lazy(() => import("./Pages/EditItem/EditItem"));
const HomePage2 = lazy(() => import("./Pages/Home/HomePage"));
const ViewPage = lazy(() => import("./Pages/ViewPage/ViewPage"));

export default function Router() {
    const { user } = useContext(AuthContex);

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
            element:
                <Suspense fallback={<Loader page />}>
                    <HomePage2 />
                </Suspense>,
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
        {
            path: 'search/:query', element:
                <Suspense fallback={<Loader page />}>
                    <SearchResult />
                </Suspense>
        },
        {
            path: 'searchv2/:query', element:
                <Suspense fallback={<Loader page />}>
                    <SearchResultIMDB />
                </Suspense>
        },
        {
            path: 'login', element:
                <Protected user={user}>
                    <Suspense fallback={<Loader page />}>
                        <Login />
                    </Suspense>
                </Protected>
        },
        {
            path: 'register', element:
                <Protected user={user}>
                    <Suspense fallback={<Loader page />}>
                        <Register />
                    </Suspense>
                </Protected>
        },
        {
            path: 'addItem', element:
                <UserRoute user={user}>
                    <Suspense fallback={<Loader page />}>
                        <AddItem />
                    </Suspense>
                </UserRoute>
        },
        {
            path: 'profile', element:
                <UserRoute user={user}>
                    <Suspense fallback={<Loader page />}>
                        <Profile />
                    </Suspense>
                </UserRoute>
        },
        {
            path: 'watchLog', element:
                <UserRoute user={user}>
                    <Suspense fallback={<Loader page />}>
                        <WatchLog />
                    </Suspense>
                </UserRoute>
        },
        {
            path: 'editItem/:id', element:
                <UserRoute user={user}>
                    <Suspense fallback={<Loader page />}>
                        <EditItem />
                    </Suspense>
                </UserRoute>
        },
        {
            path: 'movie/:id', element:
                <Suspense fallback={<Loader page />}>
                    <ViewPage />
                </Suspense>
        },
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
