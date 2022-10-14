import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter } from 'react-router-dom'
import Router from './router';

function App() {

  return (
    <BrowserRouter>
      {/* NAVBAR GOES HERE */}
      <Router />
    </BrowserRouter>
  );
}

export default App;
