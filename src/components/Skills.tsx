"use client";
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, SvgIcon } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import JavaIcon from './icons/JavaIcon';
import ReactIcon from './icons/ReactIcon';
import NodejsIcon from './icons/NodejsIcon';
import TypeScriptIcon from './icons/TypeScriptIcon';
import NextjsIcon from './icons/NextjsIcon';
import MongoIcon from './icons/MongoIcon';
import GraphQLIcon from './icons/GraphQLIcon';
import ExpressJsIcon from './icons/ExpressJsIcon';
import MySQLIcon from './icons/MySQLIcon';
import GitIcon from './icons/GitIcon';
import LinuxIcon from './icons/LinuxIcon';
import PHPIcon from './icons/PHPIcon';
import SanityIcon from './icons/SanityIcon';

const hoverAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: scale(1.1);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const SkillsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const SkillCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: theme.spacing(2),
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    animation: `${hoverAnimation} 0.3s forwards`,
  },
}));

const SkillIcon = styled('div')(({ theme }) => ({
  fontSize: 78, // Adjust icon size
  color: theme.palette.primary.main,
}));

const SkillTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.2rem',
  color: theme.palette.text.primary,
}));

const skills = [
  { title: 'PHP', icon: <PHPIcon /> },
  { title: 'React', icon: <ReactIcon /> },
  { title: 'Node.js', icon: <NodejsIcon /> },
  { title: 'TypeScript', icon: <TypeScriptIcon /> },
  { title: 'Next.js', icon: <NextjsIcon /> },
  { title: 'Java', icon: <JavaIcon /> },
  { title: 'MongoDB', icon: <MongoIcon /> },
  { title: 'Sanity CMS', icon: <SanityIcon /> },
  { title: 'Express.js', icon: <ExpressJsIcon /> },
  { title: 'MySQL', icon: <MySQLIcon /> },
  { title: 'Git', icon: <GitIcon /> },
  { title: 'Linux', icon: <LinuxIcon /> },
];

const Skills = () => {
  return (
    <SkillsSection id='skills'>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        My Skills
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {skills.map((skill, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <SkillCard>
              <SkillIcon>{skill.icon}</SkillIcon>
              <CardContent>
                <SkillTitle>{skill.title}</SkillTitle>
              </CardContent>
            </SkillCard>
          </Grid>
        ))}
      </Grid>
    </SkillsSection>
  );
};

export default Skills;
