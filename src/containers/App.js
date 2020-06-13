import React, { useEffect, Suspense } from "react";
import Layout from "../hoc/layout/Layout";
import BurgerBuilder from "../containers/BurgerBuilder/BurgerBuilder";
import Logout from "../containers/Auth/Logout/Logout";
import * as actions from "../store/actions/index";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const Checkout = React.lazy(() => {
  return import("./Checkout/Checkout");
});

const Order = React.lazy(() => {
  return import("./Orders/Orders");
});

const Auth = React.lazy(() => {
  return import("./Auth/Auth");
});

const App = (props) => {
  useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  let router = (
    <Switch>
      <Route path="/auth" render={(props) => <Auth {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );

  if (props.isAuthenticated) {
    router = (
      <Switch>
        <Route path="/checkout" render={(props) => <Checkout {...props} />} />
        <Route path="/orders" render={(props) => <Order {...props} />} />
        <Route path="/auth" render={(props) => <Auth {...props} />} />
        <Route path="/logout" component={Logout} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div>
      <Layout>
        <Suspense fallback={<p>loading...</p>}>{router}</Suspense>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
