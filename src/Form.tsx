import { Box, TextField, Typography } from '@material-ui/core';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const styles = makeStyles(() => ({
  input: {
    width: '60%',
    marginBottom: '1rem',
  },
}));

import Button from './Button';

const Form = () => {
  const classes = styles();

  const [secretWord, setSecretWord] = useState('');

  const history = useHistory();
  return (
    <Box>
      <Typography align="center" variant="h4">
        Enter secret word
      </Typography>
      <Box mb={2}>
        <Typography align="center" variant="h5">
          to generate bitcoin keys{' '}
        </Typography>
      </Box>
      <Box mb={2} display="flex" flexDirection="column" alignItems="center">
        <TextField
          label="Secret"
          variant="outlined"
          value={secretWord}
          className={classes.input}
          onChange={({ target: { value } }) => setSecretWord(value)}
        />

        <Button
          variant="contained"
          color="primary"
          disabled={!secretWord}
          onClick={() => history.push('/wallet', { secretWord })}
        >
          Proceed to wallet
        </Button>
      </Box>
    </Box>
  );
};

export default Form;
