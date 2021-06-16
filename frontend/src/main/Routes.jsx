// Componente onde terá o mapeamento entre a URL e Componentes 

import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import UserCrud from '../components/user/UserCrud'
import ProductCrud from '../components/product/ProductCrud'
import NewOrder from '../components/neworder/NewOrder'
import Neighborhood from '../components/neighborhood/Neighborhood'
import Order from '../components/order/Order'

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/users' component={UserCrud} />
        <Route path='/products' component={ProductCrud} />
        <Route path='/neworder' component={NewOrder} />
        <Route path='/neighborhoods' component={Neighborhood} />
        <Route path='/orders' component={Order} />
        <Redirect from='*' to="/" />
    </Switch>