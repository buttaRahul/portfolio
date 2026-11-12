import { Container, Grid, Paper } from "@mui/material"
import Profile from "./components/Profile/Profile"
import Portfolio from "./pages/Portfolio/Portfolio"
import About from "./components/About/About"
import Contact from "./components/Contact/Contact"

import Footer from "./components/Footer/Footer"
import './app.css'


import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import Header from "./components/Header/Header"

function App() {
  return (
    <Container >
      <Grid container spacing={6} className="p_container">
        <Grid item xs={12} sm={6} md={4} lg={3}   >
          <Profile />
        </Grid>

        <Grid item xs sx={{ minWidth: 0 }}>
          <Router>
            <Header />
            <Paper className='main-content' elevation={24} >
              <Routes>
                <Route path="/" element={<><About /><Portfolio /><Contact /></>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Paper>

          </Router>

          <Footer />
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
