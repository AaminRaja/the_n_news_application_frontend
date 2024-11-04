import appStyle from './App.module.css';
import TopNavBar from './Components/TopNavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import News from './Components/News';
import AllNews from './Components/AllNews';
import SingleNewsCommon from './Components/SingleNewsCommon';
import { AppContext, AppProvider } from './Components/AppProvider';
import NewsHome from './Components/NewsHome';
import SingleCategory from './Components/SingleCategory';
import { useContext, useEffect, useRef, useState } from 'react';
import UserUpdate from './Components/UserUpdate';
import Admin from './Components/Admin';
import AdminHome from './Components/AdminHome';
import AdminSingleCategory from './Components/AdminSingleCategory';
import AdminSingleNewsCommon from './Components/AdminSingleNewsCommon';
import AdminNewsEditor from './Components/AdminNewsEditor';
import NotFound from './Components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <TopNavBar />
        <Routes>
          <Route path='/' element={<AllNews />} />
          <Route path='/news' element={<News />}>
            <Route index element={<NewsHome />} />
            <Route path='home' element={<NewsHome />} />
            <Route path=':id' element={<SingleNewsCommon />} />
            <Route path='politics' element={<SingleCategory />} />
            <Route path='economy' element={<SingleCategory />} />
            <Route path='world' element={<SingleCategory />} />
            <Route path='security' element={<SingleCategory />} />
            <Route path='law' element={<SingleCategory />} />
            <Route path='science' element={<SingleCategory />} />
            <Route path='society' element={<SingleCategory />} />
            <Route path='culture' element={<SingleCategory />} />
            <Route path='sports' element={<SingleCategory />} />
            <Route path='entertainment' element={<SingleCategory />} />
            <Route path='editorspick' element={<SingleCategory />} />
            <Route path='savednews' element={<SingleCategory />} />
            <Route path='updateuser' element={<UserUpdate />} />
            <Route path='home/allNews' element={<AllNews />} />
          </Route>

          <Route path='/admin' element={<Admin />}>
            <Route index element={<AdminHome />} />
            <Route path='home' element={<AdminHome />} />
            <Route path='/admin/:id' element={<AdminSingleNewsCommon />} />
            <Route path='allnews' element={<AdminSingleCategory />} />
            <Route path='editorspick' element={<AdminSingleCategory />} />
            <Route path='breakingnews' element={<AdminSingleCategory />} />
            <Route path='topten' element={<AdminSingleCategory />} />
            <Route path='deletednews' element={<AdminSingleCategory />} />
            <Route path='politics' element={<AdminSingleCategory />} />
            <Route path='economy' element={<AdminSingleCategory />} />
            <Route path='world' element={<AdminSingleCategory />} />
            <Route path='security' element={<AdminSingleCategory />} />
            <Route path='law' element={<AdminSingleCategory />} />
            <Route path='science' element={<AdminSingleCategory />} />
            <Route path='society' element={<AdminSingleCategory />} />
            <Route path='culture' element={<AdminSingleCategory />} />
            <Route path='sports' element={<AdminSingleCategory />} />
            <Route path='entertainment' element={<AdminSingleCategory />} />
            <Route path='newseditor/:id' element={<AdminNewsEditor />} />
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/:id' element={<SingleNewsCommon />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AppProvider>
    </BrowserRouter >
  );
}

export default App;
