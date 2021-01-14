import { Switch, Route, Redirect } from 'react-router-dom';
import AppBar from './AppBar';
import styled from 'styled-components';

import Form from './Form';
import Info from './Info';
import { Box } from '@material-ui/core';

const App = () => {
  return (
    <>
      <Box mb={4}>
        <AppBar />
      </Box>
      <Switch>
        <Route exact path="/form">
          <Container boxShadow={2}>
            <Form />
          </Container>
        </Route>
        <Route exact path="/wallet">
          <Container boxShadow={2}>
            <Info />
          </Container>
        </Route>
        <Redirect from="/*" to="/form" />
      </Switch>
    </>
  );
};

const Container = styled(Box)`
  width: 80%;
  min-width: 600px;
  margin: 0 auto;
  padding: 2em;
`;

export default App;
