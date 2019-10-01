import React from 'react'
import {connect} from 'react-redux'
import {editProduct, getProducts, guestEdit} from '../store/products'
import {getCart, guestAdd, addingItem, editingItem} from '../store/cart'

import {NavLink, Redirect} from 'react-router-dom'
import {Button, Form, Grid} from 'semantic-ui-react'

class Cart extends React.Component {
  constructor() {
    super()
  }
  changeQuantityGuest(prod, ref) {
    let cart = JSON.parse(localStorage.getItem('cart'))
    cart.forEach(el => {
      if (el.id === prod.id) {
        let oldQuant = el.cartQuantity
        let newQuant = ref
        let diff = oldQuant - newQuant
        el.quantity = el.quantity + diff
        el.cartQuantity = ref
      }
    })
    let newCart = cart.filter(item => {
      return item.cartQuantity !== 0
    })
    localStorage.setItem('cart', JSON.stringify(newCart))
    this.props.guestAdd(newCart)
    this.props.guestEdit(prod, ref)
  }
  changeQuantityUser(product, ref) {
    this.props.userEdit(product, ref)
  }

  componentDidMount() {
    if (this.props.user.id) {
      this.props.getCart()
    } else {
      let cart
      if (!localStorage.getItem('cart')) {
        cart = []
      } else {
        console.log(cart)
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      this.props.guestAdd(cart)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.id !== prevProps.user.id) {
      this.props.getCart()
    }
  }

  render() {
    return (
      <div>
        <h1>Products in Cart:</h1>
        <div id="prodsInCart">
          {this.props.cart.map(product => {
            console.log('quantity', product.quantity)
            console.log('cartquantity', product.cartQuantity)
            let ref = `productQuantity${product.id}`
            let options = []
            let selectQuantity =
              product.quantity > 10
                ? 10
                : product.quantity + product.cartQuantity
            for (let i = 0; i <= selectQuantity; i++) {
              options.push(
                <option key={i} value={i}>
                  {i}
                </option>
              )
            }
            return (
              <div className="singleProd" key={product.id}>
                <h3>{product.name}</h3>
                <img src={product.imageUrl} />
                <div>
                  <h3>Quantity: {product.cartQuantity} </h3>
                  <select ref={ref}>{options}</select>
                  <button
                    type="button"
                    onClick={
                      this.props.user.id
                        ? () =>
                            this.changeQuantityUser(
                              product,
                              +this.refs[ref].value
                            )
                        : () =>
                            this.changeQuantityGuest(
                              product,
                              +this.refs[ref].value
                            )
                    }
                  >
                    Change Quantity
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <div id="checkoutButton">
          <NavLink className="checkoutLink" to="/checkout">
            To Checkout
          </NavLink>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    user: state.user,
    cart: state.cart
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getCart: () => {
      return dispatch(getCart())
    },
    guestAdd: cart => {
      return dispatch(guestAdd(cart))
    },
    userAdd: (item, quantity) => {
      return dispatch(addingItem(item, quantity))
    },
    userEdit: (item, quantity) => {
      return dispatch(editingItem(item, quantity))
    },
    getProducts: () => {
      return dispatch(getProducts())
    },
    guestEdit: (prod, value) => {
      return dispatch(guestEdit(prod, value))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Cart)
