import { Box, Button, TextField } from '@material-ui/core';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Form = () => {
  const [secretWord, setSecretWord] = useState('');

  const history = useHistory();
  return (
    <Box>
      form is here
      <TextField
        value={secretWord}
        onChange={({ target: { value } }) => setSecretWord(value)}
      />
      <Button onClick={() => history.push('/wallet', { secretWord })}>
        Proceed to wallet
      </Button>
    </Box>
  );
};

export default Form;
