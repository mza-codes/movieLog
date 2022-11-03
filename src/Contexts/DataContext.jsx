import { createContext, useState } from "react";

export const DataContext = createContext(null);

function DataContextProvider({ children }) {
    const [movieLog, setMovieLog] = useState([]);
    return (
        <DataContext.Provider value={{ movieLog, setMovieLog }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;