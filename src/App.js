import { Switch, Route, Redirect } from 'react-router-dom';

import Form from './Form';
import Info from './Info';

const App = () => {
  return (
    <Switch>
      <Route exact path="/form">
        <Form />
      </Route>
      <Route exact path="/wallet">
        <Info />
      </Route>
      <Redirect from="/*" to="/form" />
    </Switch>
  );
};

export default App;
