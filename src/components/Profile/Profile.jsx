
import { Box, Paper, Typography } from '@mui/material'
import React from 'react'
import './Profile.css'
// import profilePic from '../../assets/images/profilepic.jpg'
import profilePic from '../../../public/assets/images/pic.jpg'

import CustomTimeline from '../Timeline/CustomTimeline'
// import PersonIcon from '@mui/icons-material/Person';
// import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import resumeData from '../../utils/resumeData'
import { TimelineContent, TimelineItem } from '@mui/lab'
import { CustomTimelineSeparator } from '../Timeline/CustomTimeline'
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import CustomButton from '../Button/CustomButton'


const CustomTimelineItem = ({ title, text, link }) => (
  <TimelineItem>
    <CustomTimelineSeparator />
    <TimelineContent  className='content'>
      {
        link ? (<Typography className='timelineItem_text'><span>{title}:</span>{" "} <a href={link} target='_blank'>{text}</a></Typography>) : (
          <Typography className='timelineItem_text'><span>{title}: </span> {text}</Typography>
        )
      }
    </TimelineContent>


  </TimelineItem>
)





const Profile = () => {


  const handleDownloadCv = () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = 'public/assets/resume/resume_latest_6.pdf';
    downloadLink.download = 'resume-RahulAditya.pdf';
    downloadLink.click();
  };

  return (
    
    <Paper elevation={10} className='profile container_shadow '>
      <Box className='profile_name'>
        <Typography className='name'>{resumeData.name}</Typography>
        <Typography className='title'>{resumeData.title}</Typography>

      </Box>

      <figure className='profile_img'>
        <img src={profilePic} alt='' />
      </figure>

      <Box className='profile_info'>
        <CustomTimeline icon={<PersonOutlineIcon />} >
          <CustomTimelineItem title='Name' text={resumeData.name} />
          <CustomTimelineItem title='Title' text={resumeData.title} />
          <CustomTimelineItem title='Email' text={resumeData.email} />

          {Object.keys(resumeData.links).map(key => (
            <CustomTimelineItem key={resumeData.links[key].text} title={key} text={resumeData.links[key].text} link={resumeData.links[key].link} />
          ))}
        </CustomTimeline>
        <Box className='btn_cnt'>

        <CustomButton text={'Download Cv'} icon={<GetAppRoundedIcon/>} onClick={() => (handleDownloadCv())} />
        </Box>
      </Box>

    </Paper>
    
  )
}

export default Profile