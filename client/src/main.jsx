import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './Pages/HomePage.jsx'
import SingleNews from './Pages/SingleNews.jsx'
import Authorization from './Pages/Authorization.jsx'
import { ToastContainer } from 'react-toastify'
import CreatePost from './Pages/Journalist/CreatePost.jsx'
import AdminPanel from './Pages/Admin/AdminPanel.jsx'
import AuthorizationGuard from './auth/RouteProtector.jsx'
import NewsController from './Pages/Admin/NewsController.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Routes>

        {/* Public routes */}
        <Route path='/' element={<Authorization />} />
        <Route path='/homepage/news/:newsID/:categoryID' element={<SingleNews />} />

        {/* Protected routes */}
        <Route path='/homepage' element={
          <AuthorizationGuard >
            <HomePage />
          </AuthorizationGuard>} />
        {/* admin routes */}
        <Route path='/AdminPanel/users' element={
          <AuthorizationGuard allowedRoles={['admin']}>
            <AdminPanel />
          </AuthorizationGuard>
        } />

        <Route path='/AdminPanel/dashboard' element={
          <AuthorizationGuard allowedRoles={['admin']}>
            <AdminPanel />
          </AuthorizationGuard>
        } />

        <Route path='/adminpanel/news' element={
          <AuthorizationGuard allowedRoles={['admin']}>
            <NewsController />
          </AuthorizationGuard>
        } />

        {/* journalist route */}
        <Route path='/createpost' element={
          <AuthorizationGuard allowedRoles={['journalist','admin']}>
            <CreatePost />
          </AuthorizationGuard>} />

      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
