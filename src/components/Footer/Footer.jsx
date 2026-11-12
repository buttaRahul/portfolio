import React from 'react'
import './footer.css'
import { Box, Typography } from '@mui/material'
import resumeData from '../../utils/resumeData'


const Footer = () => {
  return (
    <Box className = 'footer'>
       <Box className='footer_left'>
          <Typography className='footer_name'>{resumeData.name}</Typography>
       </Box>
       <Box className='footer_left'>
          <Typography className='footer_credits'>Developed by <a href='https://www.linkedin.com/in/rahul-aditya/' target='_blank'>Rahul Aditya</a> 
          
          </Typography>
       </Box>
    </Box>
  )
}

export default Footer 