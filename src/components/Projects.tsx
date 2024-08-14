"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardMedia, Link } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Keyframes for hover animation
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
}));

// Styled Link to stretch across the entire card and inherit text color
const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary, // Set link color to theme's text primary color
  display: 'block',
  height: '100%',
  width: '100%',
}));

const RepoName = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main, // Set color to theme's primary color
  textDecoration: 'underline',       // Add underline decoration
}));

const Projects = () => {
    const [repos, setRepos] = useState<any[]>([]);

    useEffect(() => {
        axios.get('https://api.github.com/users/RishiAP/repos')
            .then((response) => {
                const sortedRepos = response.data.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
                setRepos(sortedRepos);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <Container maxWidth="lg" sx={{ paddingY: 4 }} id="projects">
            <Typography variant="h4" component="h2" gutterBottom style={{textAlign:"center"}}>
                Projects
            </Typography>
            <Grid container spacing={4}>
                {repos.map((repo: any) => (
                    <Grid item xs={12} sm={6} md={4} key={repo.id}>
                        <AnimatedCard>
                            <StyledLink href={repo.html_url} target="_blank" rel="noopener">
                                <CardContent>
                                    <RepoName variant="h6">
                                        {repo.name}
                                    </RepoName>
                                    <Typography variant="body2" color="text.secondary">
                                        {repo.description || 'No description available'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                        Last updated: {new Date(repo.updated_at).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                {repo.language && (
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            height: 140,
                                            backgroundColor: '#f5f5f5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            Language: {repo.language}
                                        </Typography>
                                    </CardMedia>
                                )}
                            </StyledLink>
                        </AnimatedCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Projects;
