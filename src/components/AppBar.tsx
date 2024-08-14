"use client";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

const sections = ['Intro', 'Skills', 'Projects', 'Contact'];

function ResponsiveAppBar() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ py: 2, backgroundColor: theme.palette.primary.main }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h4"
              noWrap
              component="a"
              href="#home"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: theme.palette.common.white,
                textDecoration: 'none',
              }}
            >
              Portfolio
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleOpenDrawer}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#home"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: theme.palette.common.white,
                textDecoration: 'none',
              }}
            >
              Portfolio
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              {sections.map((section) => (
                <Button
                  key={section}
                  sx={{ my: 2, color: theme.palette.common.white, display: 'block', fontSize: '1.2rem' }}
                  href={`#${section.toLowerCase()}`}
                >
                  {section}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={handleCloseDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box
          sx={{
            width: 240,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(2),
          }}
        >
          {sections.map((section) => (
            <Button
              key={section}
              onClick={() => handleCloseDrawer()}
              sx={{ my: 1, color: theme.palette.text.primary }}
              href={`#${section.toLowerCase()}`}
            >
              {section}
            </Button>
          ))}
        </Box>
      </Drawer>
    </>
  );
}

export default ResponsiveAppBar;
