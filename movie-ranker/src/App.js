import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AddPage } from './components/AddPage/AddPage';
import { Movielist } from './components/Movielist/Movielist';
import { Layout } from './components/Layout/Layout';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { Friends } from './components/Friends/Friends';

import { GlobalProvider } from './context/GlobalState';
import { AuthProvider} from './context/AuthState'

function App() {
  return (  
    <AuthProvider>
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Movielist/>}/>            
            <Route path='/add' element={<AddPage/>}/>  
            <Route path='/login' element={<Login/>}/>  
            <Route path='/register' element={<Register/>}/>  
            <Route path='/friends' element={<Friends/>}/>        
          </Route>
        </Routes>    
      </BrowserRouter>
    </GlobalProvider>      
    </AuthProvider>
  );
}

export default App;
