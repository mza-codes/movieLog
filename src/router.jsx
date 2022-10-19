import { useRoutes } from "react-router-dom";

import React from 'react'
import Home from "./Components/Home/Home";
import SearchResult from "./Components/Search/SearchResult";
import SearchResultIMDB from "./Components/Search/SearchResultIMDB";

export default function Router() {

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
        
        // {
        //     path: '/',
        //     element: <LogoOnlyLayout />,
        //     children: [
        //         { path: '/', element: <Navigate to="/dashboard/products" /> },
        //         { path: '404', element: <NotFound /> },
        //         { path: '*', element: <Navigate to="/404" /> },
        //     ],
        // },
        // {
        //     path: '*',
        //     element: <Navigate to="/404" replace />,
        // },
    ]);
}
