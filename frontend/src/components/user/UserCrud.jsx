import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'
import Neighborhood from '../neighborhood/Neighborhood.jsx'
import api from '../../services/services'

const neigh = new Neighborhood()

const headerProps = {
    icon: 'users',
    title: 'Clientes',
    subtitle: 'Cadastro de clientes: Incluir, Listar, Alterar e Deletar!'
}

const baseUrl = 'http://localhost:3001/clients'
const urlTeste = 'http://localhost:3001/clients?_embed=neighborhoods/1?_expand=name'

const initialState = {
    user: { id: '', clientName: '', phone: '', address: '', id_neighborhood: '', qtdpedidos: 0 },
    listNeighborhoods: [],
    list: [],
    listaJoin: []
}

export default class UserCrud extends Component {
    // Onde o estado inicial será inicializado.
    state = { ...initialState }
    
    // Será chamada quando o componente for ser exibido na tela.
    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        }) // Get

        this.getNeighborhoods()
        this.retornoJoin()
    }

    retornoJoin() {
        axios(urlTeste).then(resp => {
            this.setState({ listaJoin: resp.data })
        })
    }

    async getNeighborhoods() {
        const response = await api.get('neighborhoods')
        this.setState({ listNeighborhoods: response.data })
    }

    // Responsável por limpar o formulário já preenchido.
    clear() {
        this.setState({ user: initialState.user })
    }


    // Incluir ou alterar um user existente.
    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user).then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState({ user: initialState.user, list })
        })
    }
    
    // Recebe o usuário obtido do backend
    getUpdatedList(user, add = true) { // Removendo usuário da lista e adicionando na lista em 1a pos.
        const list = this.state.list.filter(u => u.id !== user.id) // Filtrará usuários diferente do usuário recebido como param. lista atual
        if (add) list.unshift(user)
        return list
    }

    // Atualizará os campos. (nome, email)
    updateField(event) {
        const user = { ...this.state.user } // Alterar conteúdo de usuário. Clona o objeto e depois setState.
        user[event.target.name] = event.target.value// O nome do campo deve ser o mesmo do campo de input. (nome/email)
        this.setState({ user })
    }


    renderOptions() {
        return this.state.listNeighborhoods.map(neighborhood => {
            let price = parseFloat(neighborhood.price).toFixed(2)
            return (
                <option value={neighborhood.id} key={neighborhood.id}>{neighborhood.name} - R${price}</option>
            )
        })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="clientName"
                                value={this.state.user.clientName} // Aponta para o state porque está evoluindo, props = leitura.
                                onChange={e => this.updateField(e)}
                                placeholder="Nome" />
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Celular</label>
                            <input type="text" className="form-control"
                                name="phone"
                                value={this.state.user.phone}
                                onChange={e => this.updateField(e)}
                                placeholder="Telefone ou Celular"
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-5">
                        <div className="form-group">
                            <label>Endereço</label>
                            <input type="text" className="form-control"
                                name="address"
                                value={this.state.user.address}
                                onChange={e => this.updateField(e)}
                                placeholder="Rua e número"
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Bairro</label>
                            <select name="id_neighborhood" className="form-control" value={this.state.user.neighborhood} onChange={e => this.updateField(e)}>
                                <option value="">Selecione</option>
                                {neigh.renderOptions(this.state.listNeighborhoods)}
                            </select>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={e => this.save()}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
                            Cancelar
                        </button>

                    </div>
                </div>
            </div>
        )
    }

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false) // Procurando na lista
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Celular</th>
                        <th>Endereço</th>
                        <th>Bairro</th>
                        <th>qtdPedidos</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.clientName}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td>{user.id_neighborhood}</td>
                    <td>{user.qtdpedidos}</td>
                    <td className="d-flex justify-content-end">
                        <button className="btn-primary"
                            onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn-danger ml-2"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}


