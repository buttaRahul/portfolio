import { Grid, Typography } from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import resumeData from '../../utils/resumeData'
import './contact.css'

const Contact = () => (
  <Grid container className='section pt_45 pb_45' id='contact'>
    <Grid item className='section_title mb_30'>
      <span></span>
      <h6 className='txt'>Contact Me</h6>
    </Grid>
    <Grid item xs={12}>
      <Typography className='contactInfo_item'>
        <EmailOutlinedIcon fontSize='small' />
        <span>E-mail: </span>
        <a href={`mailto:${resumeData.email}`}>{resumeData.email}</a>
      </Typography>
      <Typography className='contactInfo_item'>
        <LinkedInIcon fontSize='small' />
        <span>LinkedIn: </span>
        <a href={resumeData.links.LinkedIn.link} target='_blank' rel='noopener noreferrer'>
          {resumeData.links.LinkedIn.text}
        </a>
      </Typography>
    </Grid>
  </Grid>
)

export default Contact
