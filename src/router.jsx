import { Navigate, useRoutes } from "react-router-dom";
import Home from "./Components/Home/Home";
import SearchResult from "./Components/Search/SearchResult";
import SearchResultIMDB from "./Components/Search/SearchResultIMDB";
import { Login } from './Components/Auth/Login';
import { Register } from './Components/Auth/Register';
import { useContext } from "react";
import { AuthContex } from "./Contexts/AuthContext";
import ErrorLogo from "./Constants/Error/ErrorLogo";
import Profile from "./Pages/Profile/Profile";

export default function Router() {
    const { user } = useContext(AuthContex);
    const Protected = ({ user, children }) => {
        console.log('PROTECTED ROUTE =>', user);
        if (!user) {
            return children;
        } else {
            return <Navigate to="/" replace />;
        }
    };

    const UserRoute = ({ user, children }) => {
        console.log('USerRoute ROUTE =>', user);
        if (!user) {
            return <Navigate to="/" replace />;
        } else {
            return children;
        }
    };

    return useRoutes([
        {
            path: '/',
            element: <Home />,
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
        { path: 'profile', element: <UserRoute user={user}> <Profile /> </UserRoute> },

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
