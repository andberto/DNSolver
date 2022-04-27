import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.jsx'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path="/login" element={ <Login/> }></Route>
            <Route exact path="/dashboard" element={ <PrivateRoute> <Dashboard/> </PrivateRoute> }/>
            <Route exact path="/" element={ <Login/> }/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
