"use client";
import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import TypeWriter from 'typewriter-effect';
import Image from 'next/image';

const ProfileSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
}));

const LeftContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  zIndex: 2,
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontWeight: 700,
  fontSize: '2.25rem',
  letterSpacing: '.2rem',
  color: theme.palette.primary.main,
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingBottom: '100%',
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.shadows[4],
}));

const Profile = () => {
  return (
    <ProfileSection id="intro">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} display={"flex"}>
            <LeftContent>
              <Typography variant="h2" component="h1" gutterBottom>
                {`Hi, I'm Debjyoti Mondal`}
              </Typography>
              <TitleText variant='h3'>
                <TypeWriter
                  options={{
                    strings: ['Web Dev','Full Stack','Java','Node.js', 'React', 'TypeScript', 'Next.js', 'Express.js', 'MongoDB', 'GraphQL', 'REST APIs'],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                  }}
                />
              </TitleText>
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                Welcome to my profile page! Here, {`you'll`} find information about my skills, experience, and projects. I specialize in creating responsive and dynamic web and mobile applications.
              </Typography>
            </LeftContent>
          </Grid>
          <Grid item xs={12} md={6}>
            <ImageContainer>
              <Image
                src="/My_Pic.jpg" // Path to your image
                alt="Debjyoti Mondal"
                layout="fill" // Make image fill container
                objectFit="cover" // Cover the container
              />
            </ImageContainer>
          </Grid>
        </Grid>
      </Container>
    </ProfileSection>
  );
};

export default Profile;
