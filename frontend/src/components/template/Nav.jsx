// Componente onde terá o Menu da aplicação (possibilitará a navegação entre componentes).

import './Nav.css'
import React from 'react'
import {Link} from 'react-router-dom'

export default props =>

    <aside className="menu-area">
        <nav className="menu">
            <Link to="/">
                <i className="fa fa-home"></i>  Início
            </Link>
            <Link to="/users">
                <i className="fa fa-users"></i>  Clientes
            </Link>
            <Link to="/neworder">
                <i className="fa fa-plus"></i>  NOVO PEDIDO
            </Link>
            <Link to="/orders">
                <i className="fa fa-list"></i>  Pedidos
            </Link>
            <Link to="/neighborhoods">
                <i className="fa fa-map-marker"></i>  Bairros
            </Link>
            <Link to="/products">
                <i className="fa fa-cutlery"></i>  Produtos
            </Link>
        </nav>
    </aside>