import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'cutlery',
    title: 'Produtos',
    subtitle: 'Cadastro de produtos'
}

const baseUrl = 'http://localhost:3001/products'

const initialState = {
    product: { productName: '', description: '', price: '', size: '', id: '', flavor: '' },
    list: []
}

export default class ProductCrud extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ product: initialState.product })
    }

    save() {
        const product = this.state.product
        const method = product.id ? 'put' : 'post'
        const url = product.id ? `${baseUrl}/${product.id}` : baseUrl
        axios[method](url, product).then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState({ product: initialState.product, list })
        })
    }

    getUpdatedList(product, add = true) {
        const list = this.state.list.filter(p => p.id !== product.id)
        if (add) list.unshift(product)
        return list
    }

    updateField(event) {
        const product = { ... this.state.product }
        product[event.target.name] = event.target.value
        this.setState({ product })
    }

    renderForm() {
        return (
            <div className="Form">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>Nome do produto</label>
                            <input type="text" className="form-control"
                                name="productName"
                                value={this.state.product.productName}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome do produto"
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Descrição do produto</label>
                            <input type="text" className="form-control"
                                name="description"
                                value={this.state.product.description}
                                onChange={e => this.updateField(e)}
                                placeholder="Ex: Banana, gotas e jujuba"
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Tamanho</label>
                            <select name="size" className="form-control" value={this.state.product.size} onChange={e => this.updateField(e)}>
                                <option value="">Selecione</option>
                                <option value="300">300ml</option>
                                <option value="500">500ml</option>
                                <option value="1000">1000ml</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Sabor</label>
                            <select name="flavor" className="form-control" value={this.state.product.flavor} onChange={e => this.updateField(e)}>
                                <option value="">Selecione</option>
                                <option value="Morango">Morango</option>
                                <option value="Tradicional">Tradicional</option>
                                <option value="Ambos">Ambos</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Valor</label>
                            <input type="text" className="form-control"
                                name="price"
                                value={this.state.product.price}
                                onChange={e => this.updateField(e)}
                                placeholder="Ex: 9.99"
                            />
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-end col-md-8 mt-4 mb-4">
                        <button className="btn btn-primary" onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>

                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Produtos</label>
                            <select name="selectproduct" className="form-control" value={this.state.product.name} onChange={e => this.loadFields(e)}>
                                <option value="">Selecione</option>
                                {this.renderOptions()}
                            </select>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    load(product) {
        this.setState({ product })
    }

    loadFields(e) {
        const fieldid = e.target.value
        axios.get(`${baseUrl}/${fieldid}`).then(resp => {
            const product = resp.data
            this.setState({ product: product })
        })
    }

    renderOptions() {
        return this.state.list.map(product => {
            return (
                <option value={product.id} key={product.id}>{product.productName}</option>
            )
        })
    }

    remove(product) {
        axios.delete(`${baseUrl}/${product.id}`).then(resp => {
            const list = this.getUpdatedList(product, false) // Procurando na lista
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
                        <th>Descrição</th>
                        <th>Tamanho</th>
                        <th>Sabor</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>

            </table>
        )
    }

    renderRows() {
        return this.state.list.map(product => {
            return (
                <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.productName}</td>
                    <td>{product.description}</td>
                    <td>{product.size}</td>
                    <td>{product.flavor}</td>
                    <td>{product.price}</td>
                    <td className="d-flex justify-content-end">
                        <button className="btn-primary"
                            onClick={() => this.load(product)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn-danger ml-2"
                            onClick={() => this.remove(product)}>
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