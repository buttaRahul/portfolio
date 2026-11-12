import React, { useState } from 'react';
import './portfolio.css';
import { Box, CardActionArea, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Grow, Tab, Tabs, Typography } from '@mui/material';
import resumeData from '../../utils/resumeData';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';

const Portfolio = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const [tabvalue, setTabValue] = useState('All');
  const [prjDialog, setPrjDialog] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useTransform(cardY, [-300, 300], [10, -10]);
  const rotateY = useTransform(cardX, [-300, 300], [-10, 10]);

  const handleMouseMove = (event, prj) => {
    const offsetX = event.clientX - window.innerWidth / 2;
    const offsetY = event.clientY - window.innerHeight / 2;

    cardX.set(offsetX);
    cardY.set(offsetY);

    setHoveredCard(prj);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
    setHoveredCard(null);
  };

  return (
    <Grid container spacing={1} className="section pb_45 pt_45">
      <Grid item className="section_title mb_20">
        <span></span>
        <h6 className="txt">Portfolio</h6>
      </Grid>

      <Grid item xs={12}>
        <Tabs
          value={tabvalue}
          indicatorColor="white"
          className="customTabs"
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          <Tab label="All" value="All" className={tabvalue === 'All' ? 'customTabs_item active' : 'customTabs_item'} />
          {[...new Set(resumeData.projects.map((item) => item.tag))].map((tag) => (
            <Tab
              label={tag}
              key={tag}
              value={tag}
              className={tabvalue === tag ? 'customTabs_item active' : 'customTabs_item'}
            />
          ))}
        </Tabs>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3}>
          {resumeData.projects.map((prj) =>
            tabvalue === prj.tag || tabvalue === 'All' ? (
              <Grid item xs={12} sm={6} md={6} key={prj.title} style={{ display: 'flex' }}>
                <Grow in timeout={2000} style={{ width: '100%' }}>
                  <Box className="customCard" onClick={() => setPrjDialog(prj)} style={{ flex: 1 }}>
                    <CardActionArea>
                      <motion.div
                        className="cardContainer"
                        onMouseMove={(e) => handleMouseMove(e, prj)}
                        onMouseLeave={handleMouseLeave}
                        style={{ perspective: 800, transformStyle:"preserve-3d"}}
                      >
                        <motion.div
                          className="cardInner"
                          style={{
                            rotateX: hoveredCard === prj ? rotateX : 0,
                            rotateY: hoveredCard === prj ? rotateY : 0,
                            transformStyle: "preserve-3d",
                            perspective : 1000
                          }}
                          transition={{ velocity: 0 }}
                        >
                          <motion.div className="cardContent" whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 400 }}>
                            <Typography variant="body2" className="customCard_title">
                              {prj.title}
                            </Typography>
                            <CardMedia className="customCard_image" component="img" image={prj.image} />
                            <Box className="customCard_tags">
                              {prj.tech.map((item, i) => (
                                <Box className="customCard_tag" key={i}>
                                  <Typography variant="body2">{item}</Typography>
                                </Box>
                              ))}
                            </Box>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </CardActionArea>
                  </Box>
                </Grow>
              </Grid>
            ) : null
          )}
        </Grid>
      </Grid>

      <Dialog maxWidth="lg" fullWidth open={!!prjDialog} onClose={() => setPrjDialog(false)} className="projectDialog">
        <DialogTitle className="title">{prjDialog.title}</DialogTitle>
        <img src={prjDialog.image} alt="" className="projectDialog_image" />
        <DialogContent className="digcontent">
          <Typography className="projectDialog_description">{prjDialog.description}</Typography>
        </DialogContent>
        <DialogActions className="projectDialog_actions">
          {prjDialog?.links?.map((link) => (
            <a key={link.link} href={link.link} target="_blank" rel="noopener noreferrer" className="projectDialog_icon">
              {link.icon}
            </a>
          ))}
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Portfolio;
