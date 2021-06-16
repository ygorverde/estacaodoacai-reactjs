// Componente de logo da aplicação.
import logo from '../../assets/imgs/estacaologo.png'
import './Logo.css'
import React from 'react'
import {Link} from 'react-router-dom'

export default props =>
    <aside className="logo">
        <Link to="/" className="logo">
            <img src={logo} alt="logo" />
        </Link>
    </aside>