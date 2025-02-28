import { Box, Container, Grid, Paper } from "@mui/material"
import Profile from "./components/Profile/Profile"
// import Header from "./components/Header"
import Portfolio from "./pages/Portfolio/Portfolio"
// import Resume from "./pages/Resume"

import Footer from "./components/Footer/Footer"
import './app.css'


import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom"
import Header from "./components/Header/Header"
import { useContext } from "react"
import Resume from "./pages/Resume/Resume"

function App() {
  return (
    // <BrowserRouter>
    <Container >
      <Grid container gap={3} className="p_container">
        <Grid item xs={12} sm={5} md={4} lg={3}   >
          <Profile />
        </Grid>

        <Grid item xs sx={{
          // backgroundColor: 'red',
          // margin: '0 8px',
        }}>
          <Router>
            <Header />
            <Paper className='main-content' elevation={24} >
              <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/resume" element={<Resume />} />
              </Routes>
            </Paper>

          </Router>

          <Footer />
        </Grid>
      </Grid>
    </Container>
    // </BrowserRouter>
  )
}

export default App
