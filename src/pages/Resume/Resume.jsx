import React, { useEffect, useState } from 'react'
import './resume.css'
import { Alert, Box, Card, Grid, Paper, Snackbar, TextField, Typography } from '@mui/material'
import resumeData from '../../utils/resumeData'
import CustomTimeline, { CustomTimelineSeparator } from '../../components/Timeline/CustomTimeline'
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import SendIcon from '@mui/icons-material/Send';
import MuiAlert from '@mui/material/Alert';
// import.meta.env
// import process from 'process'


import { TimelineContent, TimelineDot, TimelineItem } from '@mui/lab'
import CustomButton from '../../components/Button/CustomButton'
import { useLocation } from 'react-router-dom'




const Resume = () => {

  // console.log(import.meta.env.VITE_API_KEY)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(false)

  const [respMessage, setRespMessage] = useState('')
  const [severity, setSeverity] = useState('success')

  const handleClose = (event) => {
    setOpen(false)
    setRespMessage('')
    // setSeverity('')

  }

  const hadleSendFrom = async () => {

    const apiKey = import.meta.env.VITE_API_KEY



    if (name == '') {
      setRespMessage("Name Cannot Be Blank")
      setOpen(true)
      setSeverity("error")
      return
    }
    if (email == '') {
      setRespMessage("Email Cannot Be Blank")
      setOpen(true)
      setSeverity("error")
      return
    }
    if (message == '') {
      setRespMessage("Message Cannot Be Blank")
      setOpen(true)
      setSeverity("error")
      return
    }


    const body = {
      "name": name,
      "email": email,
      "message": message,
      "access_key": apiKey,
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),

    }
    const resp = await fetch('https://api.web3forms.com/submit', options)
    const jsonData = await resp.json()


    if (resp.status == 200) {
      setOpen(true)
      setRespMessage(jsonData.message)
      setSeverity("success")

    }
    else {
      setRespMessage(jsonData.message)
      setOpen(true)
      setSeverity("error")
    }
  }


  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }
  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <Box>

      <Grid container className='section pb_45 pt_45'>
        <Grid item className='section_title mb_30'>
          <span></span>
          <h6 className='txt'>About Me</h6>
        </Grid>
        <Grid item xs={12}>
          <Typography className='aboutme_txt' >{resumeData.about}</Typography>
        </Grid>
      </Grid>

      <Grid container className='section'>
        <Grid item className='section_title mb_30'>
          <span></span>
          <h6 className='txt'>Resume</h6>
        </Grid>

        <Grid item xs={12}>
          <Grid container className='resumeTimeline'>

            <Grid item sm={12} md={6}>
              <CustomTimeline title='Work Experience' icon={<WorkIcon />}>
                {resumeData.experiences.map(experience => (
                  <TimelineItem key={experience.title}>
                    <CustomTimelineSeparator />
                    <TimelineContent className='timeline_content'>
                      <Typography className='timeline_title'>{experience.title}</Typography>
                      <Typography variant='caption' className='timeline_date'>{experience.date}</Typography>
                      <ul className='timeline_description'>
                        {experience.description.split('\n').map((point, index) => (
                          <li key={index}>
                            <Typography variant='body2'>{point}</Typography>
                          </li>
                        ))}
                      </ul>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </CustomTimeline>
            </Grid>

            <Grid item sm={12} md={6}>
              <CustomTimeline title='Education' icon={<SchoolIcon />}>
                {resumeData.education.map(uni => (
                  <TimelineItem key={uni.course}>
                    <CustomTimelineSeparator />
                    <TimelineContent className='timeline_content'>
                      <Typography className='timeline_title'>{uni.title}</Typography>
                      <Typography variant='caption' className='timeline_date'>{uni.date}</Typography>
                      <Typography variant='body2' className='timeline_description'>{uni.course}</Typography>
                      <Typography variant='body2' className='timeline_description'>{uni.grade}</Typography>
                    </TimelineContent>

                  </TimelineItem>
                ))}
              </CustomTimeline>
            </Grid>
          </Grid>
        </Grid>
      </Grid>


      <Grid container className='section graybg pb_45 pb_50' >
        <Grid item className='section_title mb_30'>
          <span></span>
          <h6 className='txt'>Skills</h6>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {
              resumeData.skills.map(skill => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={skill.title} >
                  <Card className='skill' sx={{ "&:hover": { boxShadow: 15 } }} >
                    <Typography variant='h6' className='skill_title'>
                      {skill.title}
                    </Typography>
                    {skill.description.map(element => (
                      <Typography key={element} variant='body2' className='skill_description'>
                        <TimelineDot variant='outlined' className='timeline_dot' />
                        {element}
                      </Typography>
                    ))}
                  </Card>
                </Grid>
              ))
            }
          </Grid>
        </Grid>

      </Grid>

      <Grid container spacing={6} className='section contactbar pt_45 pb_45'>

        <Grid item xs={12} lg={7}>
          <Grid container id='contact'>
            <Grid item className='section_title mb_30'>
              <span></span>
              <h6 className='txt'>Contact Me</h6>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name='name' label='Name' onChange={handleNameChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name='email' label='E-mail' onChange={handleEmailChange} />
                </Grid>
                <Grid item xs={12} >
                  <TextField fullWidth name='message' label='Message' multiline rows={5} onChange={handleMessageChange} />
                </Grid>
                <Grid item xs={12}>
                  <CustomButton text='Submit' icon={<SendIcon />} onClick={hadleSendFrom} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Grid container className='contactInfo'>
            <Grid item className='section_title mb_30'>
              <span></span>
              <h6 className='txt'>Contact Information</h6>
            </Grid>
            <Grid item xs={12}>
              <Grid container >
                <Grid item xs={12}>

                  <Typography className='contactInfo_item'>
                    <span>Address: </span> {resumeData.address}.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography className='contactInfo_item'>
                    <span>Phone: </span> {resumeData.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography className='contactInfo_item'>
                    <span>E-mail: </span> {resumeData.email}.
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Grid container className='contactInfo_linksContainer'>
                    {
                      Object.keys(resumeData.links).map(key => (
                        <Grid item className='contactInfo_link' key={key}>
                          <a href={resumeData.links[key].link}>{resumeData.links[key].icon}</a>
                        </Grid>
                      ))
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} >
        <MuiAlert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '600px' }}>
          {respMessage}
        </MuiAlert>
      </Snackbar>

    </Box>
  )
}

export default Resume