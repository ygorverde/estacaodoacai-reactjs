import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'
import api from '../../services/services'

const headerProps = {
    icon: 'map-marker',
    title: 'Bairros',
    subtitle: 'Listar, adicionar e alterar bairros'
}

const baseUrl = 'http://localhost:3001/neighborhoods'

const initialState = {
    neighborhood: { id: '', name: '', price: '' },
    list: []
}

export default class Neighborhood extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios.get(baseUrl).then(resp => {
            resp.data.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
            this.setState({ list: resp.data })
        })
    }

    async getNeighborhoods() {
        const response = await api.get('neighborhoods')
        return response.data
    }

    updateField(e) {
        const neighborhood = { ...this.state.neighborhood }
        neighborhood[e.target.name] = e.target.value
        this.setState({ neighborhood })
    }

    loadFields(e) {
        const fieldid = e.target.value
        if (fieldid) {

            axios.get(`${baseUrl}/${fieldid}`).then(resp => {
                const neighborhood = resp.data
                this.setState({ neighborhood: neighborhood })
            }).then(() => {
                document.getElementById('nome').disabled = true;
            })

        } else {
            document.getElementById('nome').disabled = false;
            this.clear()
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

    save(e) {
        e.preventDefault()
        const neighborhood = this.state.neighborhood
        const method = neighborhood.id ? 'put' : 'post'
        const url = neighborhood.id ? `${baseUrl}/${neighborhood.id}` : baseUrl
        axios[method](url, neighborhood).then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState({ neighborhood: initialState.neighborhood, list })
            this.clear()
        })
    }

    renderForm() {
        return (
            <div className="form">
                <form onSubmit={e => this.save(e)}>
                    <div className="row">
                        <div className="col-12 col-md-5">
                            <div className="form-group">
                                <label>Lista de bairros</label>
                                <select name="selectneighborhood" className="form-control" value={this.state.neighborhood.id} onChange={e => this.loadFields(e)}>
                                    <option value="">Selecione</option>
                                    {this.renderOptions(this.state.list)}
                                </select>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="form-group">
                                <label>Nome do bairro</label>
                                <input type="text" className="form-control"
                                    required
                                    id="nome"
                                    name="name"
                                    value={this.state.neighborhood.name}
                                    onChange={e => this.updateField(e)}
                                    placeholder="Nome do Bairro"
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-2">
                            <div className="form-group">
                                <label>Valor da taxa</label>
                                <input type="number" className="form-control"
                                    required
                                    name="price"
                                    value={this.state.neighborhood.price}
                                    onChange={e => this.updateField(e)}
                                    placeholder="R$"
                                />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="col-12 d-flex justify-content-center ">
                        <button type="submit" className="btn btn-primary">
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        )
    }


    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
            </Main>
        )
    }
}