import { createRoot } from 'react-dom/client';
import App from './App';
import AuthContexProvider from './Contexts/AuthContext';
import DataContextProvider from './Contexts/DataContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <DataContextProvider>
    <AuthContexProvider>
      <App />
    </AuthContexProvider>
  </DataContextProvider>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals