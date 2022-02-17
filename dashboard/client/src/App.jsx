import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import { Navbar, Home } from './components';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/navbar' element={<Navbar />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;