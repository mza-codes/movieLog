import { Navigate, useRoutes } from "react-router-dom";
import Home from "./Components/Home/Home";
import SearchResult from "./Components/Search/SearchResult";
import SearchResultIMDB from "./Components/Search/SearchResultIMDB";
import { Login } from './Components/Auth/Login';
import { Register } from './Components/Auth/Register';
import { useContext } from "react";
import { AuthContex } from "./Contexts/AuthContext";
import ErrorLogo from "./Constants/Error/ErrorLogo";

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
