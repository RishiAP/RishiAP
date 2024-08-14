"use client";
import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, IconButton, Link } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import DescriptionIcon from '@mui/icons-material/Description';

// Keyframes for the hover animation
const hoverAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: scale(1.05);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

// Styled Card with hover animation
const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    animation: `${hoverAnimation} 0.3s forwards`,
  },
  width: '200px', // Set card width
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

// Styled Link to stretch across the entire card
const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  height: '100%',
}));

const Contact = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }} id="contact">
      <Typography variant="h4" component="h2" gutterBottom style={{ textAlign: 'center' }}>
        Contact Me
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <AnimatedCard>
            <StyledLink href="https://drive.google.com/file/d/1-7S_0BhmMqNOxA6Pud2C1cCTbrLKZHx_/view?usp=sharing" target="_blank" rel="noopener noreferrer">
              <CardContent>
                <IconButton color="primary">
                  <DescriptionIcon style={{fontSize:"2rem"}}/>
                </IconButton>
                <Typography variant="h6">Resume</Typography>
              </CardContent>
            </StyledLink>
          </AnimatedCard>
        </Grid>
        <Grid item>
          <AnimatedCard>
            <StyledLink href="https://github.com/RishiAP" target="_blank" rel="noopener noreferrer">
              <CardContent>
                <IconButton color="primary">
                  <GitHubIcon style={{fontSize:"2rem"}}/>
                </IconButton>
                <Typography variant="h6">GitHub</Typography>
              </CardContent>
            </StyledLink>
          </AnimatedCard>
        </Grid>
        <Grid item>
          <AnimatedCard>
            <StyledLink href="https://linkedin.com/in/rishi-the-programmer" target="_blank" rel="noopener noreferrer">
              <CardContent>
                <IconButton color="primary">
                  <LinkedInIcon style={{fontSize:"2rem"}}/>
                </IconButton>
                <Typography variant="h6">LinkedIn</Typography>
              </CardContent>
            </StyledLink>
          </AnimatedCard>
        </Grid>
        <Grid item>
          <AnimatedCard>
            <StyledLink href="https://instagram.com/rishi_the_programmer" target="_blank" rel="noopener noreferrer">
              <CardContent>
                <IconButton color="primary">
                  <InstagramIcon style={{fontSize:"2rem"}}/>
                </IconButton>
                <Typography variant="h6">Instagram</Typography>
              </CardContent>
            </StyledLink>
          </AnimatedCard>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Contact;
