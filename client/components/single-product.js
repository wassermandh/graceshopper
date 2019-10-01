import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {Button, Grid} from 'semantic-ui-react'

import {guestAdd, addingItem, getCart} from '../store/cart'
import {addingGuestDB, getProducts} from '../store/products'

class SingleProduct extends React.Component {
  constructor() {
    super()
    this.state = {
      product: {}
    }
  }
  async componentDidMount() {
    const {data} = await axios.get(
      `/api/products/${this.props.match.params.id}`
    )
    this.setState({product: data})
    if (this.props.user.id) {
      this.props.getCart()
    } else {
      let cart = JSON.parse(localStorage.getItem('cart'))
      this.props.guestAdd(cart)
    }
  }
  addToCart(event, value) {
    if (!this.props.user.id) {
      if (localStorage.getItem('cart')) {
        let cart = JSON.parse(localStorage.getItem('cart'))
        let found = false
        // check if it exists
        // let stringifiedEvent = JSON.stringify(event)
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === event.id) {
            console.log(cart[i])
            // if item is in cart
            cart[i].quantity = +cart[i].quantity - +value
            cart[i].cartQuantity = +cart[i].cartQuantity + +value
            console.log(cart[i].quantity, cart[i].cartQuantity)
            found = true
          }
        }
        if (!found) {
          event.cartQuantity = value
          event.quantity = event.quantity - value
          cart.push(event)
        }
        found = false
        cart = JSON.stringify(cart)
        localStorage.setItem('cart', cart)
      } else {
        let cart = []
        event.cartQuantity = value
        event.quantity = event.quantity - event.cartQuantity
        cart.push(event)
        cart = JSON.stringify(cart)
        localStorage.setItem('cart', cart)
      }
    }
    let parsedCart = JSON.parse(localStorage.getItem('cart'))
    this.props.guestAdd(parsedCart)
    this.props.addingGuestDB(event, value)
    this.props.getProducts()
  }
  render() {
    const product = this.state.product
    let options = []
    let availableBeforeCheckout

    if (this.props.cart) {
      let [cartItem] = this.props.cart.filter(item => {
        return product.name === item.name
      })
      if (cartItem) {
        availableBeforeCheckout = cartItem.quantity
      }
    }
    let selectQuantity =
      availableBeforeCheckout !== undefined
        ? availableBeforeCheckout
        : product.quantity
    // let selectQuantity =
    //   availableBeforeCheckout > 10 ? 10 : availableBeforeCheckout
    for (let i = 0; i <= selectQuantity; i++) {
      options.push(
        <option key={i} value={i} className="dropdown-item">
          {i}
        </option>
      )
    }
    return (
      <div>
        <h1>{product.name}</h1>
        <img src={product.imageUrl} />
        <h2>In stock: {selectQuantity}</h2>
        <select ref="productQuantity">{options}</select>
        <button
          type="button"
          onClick={
            !this.props.user.id
              ? () => this.addToCart(product, +this.refs.productQuantity.value)
              : () =>
                  this.props.userAdd(product, +this.refs.productQuantity.value)
          }
        >
          Add to cart
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    products: state.products,
    user: state.user,
    cart: state.cart
  }
}

const mapDispatchToProps = dispatch => {
  return {
    guestAdd: cart => {
      return dispatch(guestAdd(cart))
    },
    userAdd: (item, quantity) => {
      return dispatch(addingItem(item, quantity))
    },
    getCart: () => {
      return dispatch(getCart())
    },
    addingGuestDB: (item, value) => {
      return dispatch(addingGuestDB(item, value))
    },
    getProducts: () => {
      return dispatch(getProducts())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct)
