import React, { Component } from "react";
import Layout from "../hoc/layout/Layout";
import BurgerBuilder from "../containers/BurgerBuilder/BurgerBuilder";
import Logout from "../containers/Auth/Logout/Logout";
import * as actions from "../store/actions/index";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import asyncComponent from "../hoc/asyncComponent/asyncComponent";

const asyncCheckout = asyncComponent(() => {
  return import("./Checkout/Checkout");
});

const asyncOrder = asyncComponent(() => {
  return import("./Orders/Orders");
});

const asyncAuth = asyncComponent(() => {
  return import("./Auth/Auth");
});

class App extends Component {
  // state = {
  //   show: true,
  // };

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.setState({ show: false });
  //   }, 5000);
  // }

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    let router = (
      <Switch>
        <Route path="/auth" component={asyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      router = (
        <Switch>
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" component={asyncOrder} />
          <Route path="/auth" component={asyncAuth} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <div>
        {/* <Layout>{this.state.show ? <BurgerBuilder /> : null}</Layout>
         */}
        <Layout>
          {router}
          {/* <Checkout /> */}
        </Layout>
      </div>
    );
  }
}

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
