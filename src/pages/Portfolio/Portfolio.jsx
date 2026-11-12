import { useState } from 'react';
import './portfolio.css';
import { Box, Grid, Grow, Tab, Tabs, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { FaKaggle } from 'react-icons/fa6';
import resumeData, { projectTabs } from '../../utils/resumeData';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const linkIcons = {
  github: <GitHubIcon fontSize="small" />,
  kaggle: <FaKaggle />,
  paper: <ArticleOutlinedIcon fontSize="small" />,
};

const Portfolio = () => {
  const [tabvalue, setTabValue] = useState('all');
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

  const visibleProjects = resumeData.projects.filter(
    (prj) => tabvalue === 'all' || prj.tabs.includes(tabvalue)
  );

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
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Project categories"
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          {projectTabs.map((tab) => (
            <Tab
              label={tab.label}
              key={tab.id}
              value={tab.id}
              id={`project-tab-${tab.id}`}
              aria-controls="project-tabpanel"
              className={tabvalue === tab.id ? 'customTabs_item active' : 'customTabs_item'}
            />
          ))}
        </Tabs>
      </Grid>

      <Grid item xs={12} id="project-tabpanel" role="tabpanel" aria-labelledby={`project-tab-${tabvalue}`}>
        <Grid container spacing={3}>
          {visibleProjects.map((prj) => (
            <Grid item xs={12} sm={6} md={6} key={prj.title} style={{ display: 'flex' }}>
              <Grow in timeout={2000} style={{ width: '100%' }}>
                <Box className="customCard" style={{ flex: 1 }}>
                  <motion.div
                    className="cardContainer"
                    onMouseMove={(e) => handleMouseMove(e, prj)}
                    onMouseLeave={handleMouseLeave}
                    style={{ perspective: 800, transformStyle: 'preserve-3d' }}
                  >
                    <motion.div
                      className="cardInner"
                      style={{
                        rotateX: hoveredCard === prj ? rotateX : 0,
                        rotateY: hoveredCard === prj ? rotateY : 0,
                        transformStyle: 'preserve-3d',
                        perspective: 1000,
                      }}
                      transition={{ velocity: 0 }}
                    >
                      <motion.article className="cardContent" whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 400 }}>
                        <Typography component="h3" className="customCard_title">
                          {prj.title}
                        </Typography>
                        <Typography variant="body2" className="customCard_label">
                          {prj.label}
                        </Typography>
                        {prj.role && (
                          <Typography variant="body2" className="customCard_role">
                            {prj.role}
                          </Typography>
                        )}
                        {prj.summary && (
                          <Typography variant="body2" className="customCard_summary">
                            {prj.summary}
                          </Typography>
                        )}
                        {prj.bullets.length > 0 && (
                          <ul className="customCard_bullets">
                            {prj.bullets.map((point) => (
                              <li key={point}>
                                <Typography variant="body2">{point}</Typography>
                              </li>
                            ))}
                          </ul>
                        )}
                        <Box className="customCard_footer">
                          {prj.tags.length > 0 && (
                            <Box className="customCard_tags">
                              {prj.tags.map((item) => (
                                <Box className="customCard_tag" key={item}>
                                  <Typography variant="body2">{item}</Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                          {prj.links.length > 0 && (
                            <Box className="customCard_links">
                              {prj.links.map((link) => (
                                <a
                                  key={link.url}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="customCard_link"
                                  aria-label={`${link.label}: ${prj.title} (opens in a new tab)`}
                                >
                                  {linkIcons[link.type]}
                                  <span>{link.label}</span>
                                </a>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </motion.article>
                    </motion.div>
                  </motion.div>
                </Box>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Portfolio;
