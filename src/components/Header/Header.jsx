import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { NavLink, useLocation } from "react-router-dom"
import { HomeRounded, Telegram } from '@mui/icons-material';
import { Box } from '@mui/material';
import resumeData from '../../utils/resumeData';
import CustomButton from '../Button/CustomButton';
import './header.css'

const CV_URL = '/assets/resume/Rahul_Aditya_Butta_ML_Engineer.pdf';

const Header = () => {
  const navigateTo = useNavigate();

  const pathName = useLocation().pathname;
  const handleClick = () => {
    if (pathName !== '/') {
      navigateTo('/');
    }
    setTimeout(() => {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };


  return (
    <Navbar expand="lg" sticky="top" className="header">
      <Nav.Link as={NavLink} to='/' className='header_navlink' aria-label='Home'>
        <Navbar.Brand className='header_home'>
        <HomeRounded/>
        </Navbar.Brand>
      </Nav.Link>
      <Navbar.Toggle/>
      <Navbar.Collapse>
        <Nav className='header_left'>
          <Nav.Link as={NavLink} to='/' className = {pathName == "/" ? "header_link_active" : "header_link"}>Portfolio</Nav.Link>
          <Nav.Link href={CV_URL} target='_blank' rel='noopener noreferrer' className='header_link'>Resume</Nav.Link>
        </Nav>

        <Box className='header_right'>
            {Object.keys(resumeData.links).map(
              (key) =>(
                <a href={resumeData.links[key].link} target='_blank' rel='noopener noreferrer' aria-label={key} key={resumeData.links[key].link}>{resumeData.links[key].icon}</a>
              )
            )}


        </Box>
            <CustomButton text={'Contact Me'} icon={<Telegram/>} onClick={handleClick} />
      </Navbar.Collapse>
    </Navbar>


  );
};

export default Header;
