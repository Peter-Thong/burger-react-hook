import React, { useState, useEffect } from "react";
import Aux from "../../hoc/Auxility/Auxility";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
export const BurgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    props.onInitIngredient();
  }, []);

  const updatePurchaseState = (ingredient) => {
    const sum = Object.keys(ingredient)
      .map((igKey) => {
        return ingredient[igKey];
      })
      .reduce((sum, el) => sum + el, 0);
    return sum > 0;
  };

  const purchaseHandler = () => {
    if (props.isAuthenticated) {
      setPurchasing(true);
    } else {
      props.onSetAuthRedirectPath("/checkout");
      props.history.push("/auth");
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    props.onPurchaseInit();
    props.history.push("/checkout");
  };

  const disableInformation = { ...props.ings };
  for (let key in disableInformation) {
    disableInformation[key] = disableInformation[key] <= 0;
  }

  let burger = props.error ? <p>Ingredients cannot loaded</p> : <Spinner />;

  let orderSummary = null;

  if (props.ings) {
    burger = (
      <Aux>
        <Burger ingredient={props.ings} />
        <BuildControls
          isAuth={props.isAuthenticated}
          ingredientAdded={props.onAddIngredient}
          ingredientRemoved={props.onRemoveIngredient}
          disabled={disableInformation}
          price={props.price}
          purchable={updatePurchaseState(props.ings)}
          ordered={purchaseHandler}
        />
      </Aux>
    );

    orderSummary = (
      <OrderSummary
        ingredients={props.ings}
        price={props.price}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
      />
    );
  }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddIngredient: (name) => dispatch(actions.addIngredient(name)),
    onRemoveIngredient: (name) => dispatch(actions.removeIngredient(name)),
    onInitIngredient: () => dispatch(actions.initIngredients()),
    onPurchaseInit: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) =>
      dispatch(actions.setAuthRedirectPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
