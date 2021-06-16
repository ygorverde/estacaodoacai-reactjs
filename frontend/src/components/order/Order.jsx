import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'
import api from '../../services/services'
import './Order.css'
import OrderDetails from '../order/OrderDetails'
import DatePicker from '../datapicker/DataPicker'

const headerProps = {
    icon: 'list',
    title: 'Pedidos',
    subtitle: 'Listar pedidos'
}

const initialState = {
    order: { id: null },
    neighborhood: { id: '', name: '', price: '' },
    list: [],
    orders: [],
    date: new Date()
}

export default class Order extends Component {

    state = { ...initialState }

    componentWillMount() {
        this.getOrders()
    }

    async getOrders() {
        // console.log('GET ORDERS STATE DATE: ', this.state.date)
        await api.get(`orders?data=${this.state.date.toLocaleDateString()}`).then(resp => {
            this.setState({ orders: resp.data })
        })
    }

    updateField(e) {
        const element = document.getElementById(e.target.id)
        const order = { ...this.state.order }
        if (parseInt(e.target.id) === order.id) {
            element.classList.toggle('active')
            this.setState({ order: initialState.order })
        } else {
            const el = document.getElementById(this.state.order.id)
            if (el !== null) {
                el.classList.remove('active')
            }
            element.classList.toggle('active')
            order.id = parseInt(e.target.id)
            this.setState({ order })
        }
    }

    renderOptions(array) {
        return array.map(neighborhood => {
            let price = parseFloat(neighborhood.price).toFixed(2)
            return (
                <option value={neighborhood.id} key={neighborhood.id}>{neighborhood.name} - R${price}</option>
            )
        })
    }

    clear() {
        this.setState({ neighborhood: initialState.neighborhood })
        document.getElementById('nome').disabled = false;
    }

    getUpdatedList(neighborhood, add = true) {
        const list = this.state.list.filter(n => n.id !== neighborhood.id)
        if (add) list.unshift(neighborhood)
        return list
    }

    renderOrder() {
        return (
            <h1>Renderizou</h1>
        )
    }

    updateOrdersByDate() {
        api.get(`orders?data=${this.state.date.toLocaleDateString()}`).then(resp => {
            this.setState({ orders: resp.data })
        })
    }

    handleDate(date){
        const state = this.state
        state.date = date
        this.setState({ state })
        this.updateOrdersByDate()
    }

    renderOrders() {
        return (
            <div id="orders" className="orders">
                <DatePicker
                    selected={this.state.date}
                    onSelect={this.handleDateSelect} //when day is clicked
                    onChange={date => this.handleDate(date)} //only when value has changed
                />

                {this.state.orders.map((order, index) => {
                    return (
                        <div className="mainrow" key={index}>
                            <div id={order.id} className="row d-flex justify-content-between order" onClick={e => this.updateField(e)}>
                                <div className="client d-flex justify-content-center align-items-center">
                                    <strong>{order.client.name}</strong>
                                    <span>#{order.id}</span>
                                </div>
                                <div className="total d-flex justify-content-center align-items-center">
                                    <strong>R${order.client.total}</strong>
                                </div>
                            </div>
                            {this.state.order.id === order.id &&
                                <div className="row expand" key={`exapndId+${order.id}`}>
                                    <OrderDetails order={order} />
                                </div>
                            }
                        </div>
                    )
                })}
            </div>
        )
    }


    render() {
        return (
            <Main {...headerProps}>
                {this.renderOrders()}
            </Main>
        )
    }
}