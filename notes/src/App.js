import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './components/Features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './components/Features/auth/Welcome'
import NotesList from './components/Features/notes/NotesList'
import UsersList from './components/Features/users/UsersList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="dash" element={<DashLayout />} >

          <Route index element={<Welcome />} />

          <Route path='notes'>
            <Route index element={<NotesList />} />
          </Route>

          <Route path='users'>
            <Route index element={<UsersList />} />
          </Route>

        </Route>{/* End Dash */}
      </Route>
    </Routes>
  )
}

export default App;
