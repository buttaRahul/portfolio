import { Grid, Typography } from '@mui/material'
import resumeData from '../../utils/resumeData'
import './about.css'

const About = () => (
  <Grid container className='section pb_45 pt_45'>
    <Grid item className='section_title mb_30'>
      <span></span>
      <h6 className='txt'>About Me</h6>
    </Grid>
    <Grid item xs={12}>
      <Typography className='aboutme_txt'>{resumeData.about}</Typography>
    </Grid>
  </Grid>
)

export default About
