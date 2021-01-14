import React from 'react';
import { AppBar as MuiAppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = makeStyles((theme: any) => ({
  title: {
    fontSize: 24,
  },
  header: {
    padding: '1rem 2rem',
  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
}));

const AppAppBar = () => {
  const classes = styles();

  return (
    <MuiAppBar elevation={0} position="static" className={classes.header}>
      <Typography variant="h6" color="inherit" className={classes.title}>
        Bitcoin keys generation
      </Typography>
    </MuiAppBar>
  );
};

export default AppAppBar;
