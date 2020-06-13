import React, { useState, useEffect, useCallback } from "react";
import Aux from "../../hoc/Auxility/Auxility";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions/index";
export const BurgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false);

  const ings = useSelector((state) => state.burgerBuilder.ingredients);
  const price = useSelector((state) => state.burgerBuilder.totalPrice);
  const error = useSelector((state) => state.burgerBuilder.error);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  const dispatch = useDispatch();

  const onAddIngredient = (name) => dispatch(actions.addIngredient(name));
  const onRemoveIngredient = (name) => dispatch(actions.removeIngredient(name));
  const onInitIngredient = useCallback(
    () => dispatch(actions.initIngredients()),
    [dispatch]
  );
  const onPurchaseInit = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = (path) =>
    dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredient();
  }, [onInitIngredient]);

  const updatePurchaseState = (ingredient) => {
    const sum = Object.keys(ingredient)
      .map((igKey) => {
        return ingredient[igKey];
      })
      .reduce((sum, el) => sum + el, 0);
    return sum > 0;
  };

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath("/checkout");
      props.history.push("/auth");
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    onPurchaseInit();
    props.history.push("/checkout");
  };

  const disableInformation = { ...ings };
  for (let key in disableInformation) {
    disableInformation[key] = disableInformation[key] <= 0;
  }

  let burger = error ? <p>Ingredients cannot loaded</p> : <Spinner />;

  let orderSummary = null;

  if (ings) {
    burger = (
      <Aux>
        <Burger ingredient={ings} />
        <BuildControls
          isAuth={isAuthenticated}
          ingredientAdded={onAddIngredient}
          ingredientRemoved={onRemoveIngredient}
          disabled={disableInformation}
          price={price}
          purchable={updatePurchaseState(ings)}
          ordered={purchaseHandler}
        />
      </Aux>
    );

    orderSummary = (
      <OrderSummary
        ingredients={ings}
        price={price}
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

export default withErrorHandler(BurgerBuilder, axios);
