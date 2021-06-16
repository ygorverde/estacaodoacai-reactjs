
import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import './NewOrder.css'
import Select from 'react-select'
import Printer2 from '../printer/Printer2'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/services'

const headerProps = {
    icon: 'book',
    title: 'Novo pedido',
    subtitle: 'Realizar um novo pedido'
}

const now = new Date()
const baseUrl = 'http://localhost:3001/products'
const urlAddSimples = 'http://localhost:3001/simpleadditionals'
const urlAddSpecials = 'http://localhost:3001/specialadditionals'
const urlClients = 'http://localhost:3001/clients'
const urlNeighborhoods = 'http://localhost:3001/neighborhoods'
const urlOrders = 'http://localhost:3001/orders'

const initialState = {
    total: 0,
    subtotal: 0,
    arrayPronto: { client: { name: '' } },
    product: { productName: '', description: '', price: '', size: '', id: '', flavor: '' },
    client: { clientName: '', phone: '', address: '', neighborhood: { name: '', price: 0, id_neighborhood: '' }, id: '', qtdpedidos: 0 },
    list: [],
    clientsearch: '',
    listSimpleAdditionals: [{ additionalname: '', price: 2.0 }],
    listSpecialAdditionals: [{ additionalname: '', price: 3.0 }],
    acais: [],
    listaAdicionais: [], // Array que será impresso
    neighborhoods: []
}


export default class NewOrder extends Component {

    state = { ...initialState }

    componentDidMount() {
        this.getProducts()
        this.getSimples()
        this.getSpecials()
        this.getNeighborhoods()
    }

    getProducts() {
        axios.get(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    getNeighborhoods() {
        axios.get(urlNeighborhoods).then(resp => {
            this.setState({ neighborhoods: resp.data })
        })
        return this.state.neighborhoods
    }

    getSpecials() {
        axios.get(urlAddSpecials).then(resp => {
            this.setState({ listSpecialAdditionals: resp.data })
        })
        return this.state.listSpecialAdditionals
    }

    getSimples() {
        axios.get(urlAddSimples).then(resp => {
            this.setState({ listSimpleAdditionals: resp.data })
        })
        return this.state.listSimpleAdditionals
    }

    addNewSimpleItem2(e, index, tipo, price) {
        e.preventDefault()
        const acais = this.state.acais

        acais[index][tipo].push({ additionalname: '', price: price })

        this.setState({ acais: acais })
        this.calcularTotal()
    }

    removeSimpleItem(e, index, tipo) {
        const state = this.state
        state.acais[index][tipo].pop()
        this.setState(state)
        this.calcularTotal()
    }

    setItemSimplesValue(index, i, e) {
        let acais = this.state.acais
        acais[index][e.target.name][i].additionalname = e.target.value
        this.setState({ acais: acais })
    }

    updateFieldsOfAcai(e, index, acai) {
        const acais = this.state.acais
        acai[e.target.name] = e.target.value
        if (e.target.name === "size") {
            if (e.target.value === "500") {
                acai.acaiprice = 16.00
            } else if (e.target.value === "300") {
                acai.acaiprice = 12.00
            } else if (e.target.value === "1000") {
                acai.acaiprice = 31.00
            } else {
                acai.acaiprice = 0
            }
        }
        acais[index] = acai
        this.setState({ acais: acais })
        this.calcularTotal()
    }

    updateFieldClient(e, tipo, valor) {
        if (tipo === "neighborhood") {
            let idRecebido = parseInt(e.target.value)
            if (valor) idRecebido = valor
            const client = this.state.client
            const bairroDaLista = this.state.neighborhoods.find(bairro => bairro.id === idRecebido)
            client.neighborhood.id_neighborhood = bairroDaLista.id
            client.neighborhood.name = bairroDaLista.name
            client.neighborhood.price = bairroDaLista.price
            this.setState({ client: client })
            console.log(this.state.client)
            this.calcularTotal()
        } else {
            const client = { ...this.state.client }
            client[e.target.name] = e.target.value
            this.setState({ client: client })
        }
    }

    setMountedProduct(element, index) {
        let els = document.querySelectorAll('.size');
        for (let i = 0; i < els.length; i++) {
            els[i].setAttribute("disabled", `${true}`);
        }
        let acais = [...this.state.acais]
        const idAcai = element.value
        let acaiDaLista = this.state.list.find(acai => acai.id === idAcai)
        console.log('acaidalista:', acaiDaLista)
        acais[index].acaiName = acaiDaLista.productName
        acais[index].size = acaiDaLista.size
        acais[index].description = acaiDaLista.description
        acais[index].acaiprice = parseFloat(acaiDaLista.price)
        this.setState({ acais: acais })
        this.calcularTotal()
    }

    renderSelectSimple() {
        return (
            <select name="adicionaissimples" className="form-control mt-2" onChange={e => this.updateSelectSimple(e)}>
                <option>Selecione</option>
                {this.state.listSimpleAdditionals.map(additional => {
                    return (
                        <option>{additional.additionalname}</option>
                    )
                })}

            </select>
        )
    }

    renderSelectSpecial() {
        return (
            <select name="adicionaisespeciais" className="form-control mt-2">
                <option>Selecione</option>
                {this.renderOptionsSpecial()}
            </select>
        )
    }

    calcularTotal() {
        let frete = parseFloat(this.state.client.neighborhood.price)
        let acaiPrices = 0
        this.state.acais.forEach((acai, index, array) => {
            let total = 0
            total += acai.acaiprice
            acai.addsimples.map((addsimples, index) => {
                if (acai.acaiName === '') {
                    if (index === 0 || index === 1) {
                        addsimples.price = 0
                    }
                }
                return total += addsimples.price
            })
            acai.addespeciais.map((addespecial, index) => {
                return total += addespecial.price
            })
            acai.total = parseFloat(total).toFixed(2)
            acaiPrices += total
        })
        let amount = acaiPrices + frete
        this.setState({ total: parseFloat(amount).toFixed(2) })
        this.calcularSubtotal()
    }

    calcularSubtotal() {
        let array = {
            client: {
                name: this.state.client.clientName,
                phone: this.state.client.phone,
                address: this.state.client.address,
                neighborhood: this.state.client.neighborhood,
                shipping: this.state.client.neighborhood.price,
                total: this.state.total
            },
            acais: []
        }
        this.state.acais.forEach((acai, index) => {
            let adicionais = []
            let description = ''
            if(acai.description !==  ''){
                description = acai.description
            }
            acai.addsimples.forEach(adicional => {
                adicionais.push({ adicional: `${adicional.additionalname} ${adicional.price === 0 ? '' : 'R$' + parseFloat(adicional.price).toFixed(2)}` })
            })
            array.acais.push({
                acai: acai.acaiName === '' ? `Açaí ${acai.flavor}` : acai.acaiName,
                size: acai.size,
                adicionais: adicionais,
                total: acai.total,
                description: description
            })
        })
        console.log('ESTADO NO SUBTOTAL: ', array)
        return array
    }

    handleChange(event) {
        this.setState({ clientsearch: event.target.value });
    }

    loadClient(e) {
        axios.get(`${urlClients}?phone=${this.state.clientsearch}`).then(resp => { // Procurando na lista
            this.setState({
                client: {
                    clientName: resp.data[0].clientName,
                    phone: resp.data[0].phone,
                    address: resp.data[0].address,
                    neighborhood: { id_neighborhood: resp.data[0].id_neighborhood },
                    id: resp.data[0].id,
                    qtdpedidos: resp.data[0].qtdpedidos
                }
            })
        }).then(() => {
            let valor = this.state.client.neighborhood.id_neighborhood
            this.updateFieldClient(e, "neighborhood", valor)
        }).catch(err => {
            alert('Cliente não cadastrado', err)
        })
        e.preventDefault()

    }

    adicionarAcai(e) {
        e.preventDefault()
        const acais = this.state.acais
        acais.push({ acaiName: '', description: '', size: '', flavor: '', addsimples: [], addespeciais: [], acaiprice: 0, total: 0.0 })
        this.setState({ acais: acais })
    }

    removerAcai(index) {
        const acais = this.state.acais
        acais.splice(index, 1)
        this.setState({ acais: acais })
        this.calcularTotal()
    }

    renderAcaisOptions() {
        return this.state.list.map(product => {
            return (
                <option value={product.id} key={product.id}>{product.productName}</option>
            )
        })
    }

    clear(e) {
        this.setState(initialState)
        this.setState({ acais: [] })
        this.getProducts()
        this.getNeighborhoods()
        this.calcularTotal()
    }
    
    verifyFields(){
        let isEmpty
        this.state.acais.forEach(acai => {
            if(acai.size === ''){
                return isEmpty = true
            }else{
                return isEmpty = false
            }
        })
        return isEmpty
    }

    async submitOrder() {
        let array = this.calcularSubtotal()
        if(this.state.client.clientName === '' || this.state.client.phone === '' || this.state.client.address === ''){
            toast.error(`Preencha todos os campos do cliente`)
            return
        }
        if (this.state.acais.length === 0){
            toast.error(`É necessário adicionar algum item ao pedido`)
            return
        }
        if(this.verifyFields()){
            toast.error(`Campos do açaí vazio`)
            return
        }

        await api.post('orders', {...this.calcularSubtotal(), data: now.toLocaleDateString()}).then(resp => {
            toast.success(<div>Pedido <strong>#{resp.data.id}</strong> realizado com sucesso!!
            <div className="d-flex flex-direction-row"><Printer2 array={array}/></div>
            </div>)
        }).then(() => {
            this.clear()
        })

    }

    renderNovoAcai(acai, index) {
        return (
            <div className="row acai" key={`acai+${index}`}>
                <div className="col-12 col-md-2">
                    <div className="form-group">
                        <button className="btn btn-danger btncircle mr-2" onClick={e => this.removerAcai(index)}>
                            <i className="fa fa-trash"></i>
                        </button>
                        <label>Açaí</label>
                        <Select
                            placeholder="Montados"
                            name="form-field-acai"
                            key={'SELECT' + index}
                            options={this.state.list.map(acai => ({ value: acai.id, label: `${acai.productName} - R$${acai.price} - ${acai.size}ml` }))}
                            onChange={e => this.setMountedProduct(e, index)}
                        />
                    </div>
                    {acai.total !== "0.00" &&
                        <span className="acaitotal">{acai.total == 0.00 ? '' : `R$${acai.total}`}</span>
                    }
                </div>
                {this.state.acais[index].acaiName !== "" &&
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Descrição </label>
                            <input type="text" className="form-control"
                                name="description"
                                value={this.state.acais[index].description}
                                readOnly={true}
                            />
                        </div>
                    </div>
                }

                <div className="col-12 col-md-2">
                    <div className="form-group">
                        <label>Tamanho</label>
                        <select name="size" className="form-control size" value={this.state.acais[index].size} onChange={e => this.updateFieldsOfAcai(e, index, acai)}>
                            <option value="">Selecione</option>
                            <option value="300">300ml</option>
                            <option value="500">500ml</option>
                            <option value="1000">1000ml</option>
                        </select>
                    </div>
                </div>

                <div className="col-12 col-md-1">
                    <div className="form-group">
                        <label>Sabor</label>
                        <select name="flavor" className="form-control" value={this.state.acais[index].flavor} onChange={e => this.updateFieldsOfAcai(e, index, acai)}>
                            <option value="">...</option>
                            <option value="Morango">Morango</option>
                            <option value="Tradicional">Tradicional</option>
                        </select>
                    </div>
                </div>

                <div id="adicionais" className="container col-12 col-md-4" key={`adicionais+${index}`}>

                    <section className="addsimples" key={`simples+${index}`}>
                        Adicionais Simples
                                <div className="d-flex justify-content-center">
                            <button name="addsimples" className="btn btn-danger btncircle" onClick={e => this.addNewSimpleItem2(e, index, "addsimples", 2.0)}>
                                <i className="fa fa-plus"></i>
                            </button>
                            <button className="btn btn-danger btncircle" onClick={e => this.removeSimpleItem(e, index, "addsimples")}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>
                        {this.state.acais[index].addsimples.map((additionalItem, i) => {
                            return (
                                <select key={`selectsimples+${i}`} name="addsimples" value={this.state.acais[index].addsimples[i].additionalname} className="form-control mt-2" onChange={e => this.setItemSimplesValue(index, i, e)}>
                                    <option value="" hidden>Selecione</option>
                                    {this.state.listSimpleAdditionals.map(additional => {
                                        return (
                                            // <option value={additional.additionalname}>{additional.additionalname}</option>
                                            <option key={`optsimpl+${i}+id${additional.id}`} value={additional.additionalname}>{additional.additionalname}</option>
                                        )
                                    })}

                                </select>
                            )
                        })}
                    </section>


                    <section className="addspecials" key={`especiais+${index}`}>
                        Adicionais Especiais
                                <div className="d-flex justify-content-center">
                            <button name="addespeciais" className="btn btn-danger btncircle" onClick={e => this.addNewSimpleItem2(e, index, "addespeciais", 3.0)}>
                                <i className="fa fa-plus"></i>
                            </button>
                            <button className="btn btn-danger btncircle" onClick={e => this.removeSimpleItem(e, index, "addespeciais")}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>

                        {this.state.acais[index].addespeciais.map((additionalItem, i) => {
                            return (
                                <select key={`selectespeciais+${i}`} name="addespeciais" value={this.state.acais[index].addespeciais[i].additionalname} className="form-control mt-2" onChange={e => this.setItemSimplesValue(index, i, e)}>
                                    <option value="" hidden>Selecione</option>
                                    {this.state.listSpecialAdditionals.map(additional => {
                                        return (
                                            <option key={`optesp+${i}+id${additional.id}`} value={additional.additionalname}>{additional.additionalname}</option>
                                        )
                                    })}

                                </select>
                            )
                        })}
                    </section>
                </div>
            </div>
        )
    }

    renderForm() {
        return (
            <div>
                <div className="form">
                    <div className="row d-flex justify-content-between">
                        <div className="ml-3">
                            <form onSubmit={e => this.loadClient(e)}>
                                <input type="text"
                                    id="clientsearch"
                                    required
                                    placeholder="Pesquisa por número"
                                    value={this.state.clientsearch}
                                    onChange={e => this.handleChange(e)}
                                />
                                <button type="submit" className="searchClient">
                                    <i className="fa fa-search"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-12 col-md-3">
                            <div className="form-group">
                                <label>Nome do cliente</label>
                                <input type="text" className="form-control client"
                                    id="clientName"
                                    placeholder="Informe o nome do cliente"
                                    name="clientName"
                                    value={this.state.client.clientName}
                                    onChange={e => this.updateFieldClient(e)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-2">
                            <div className="form-group">
                                <label>Celular</label>
                                <input type="text" className="form-control client"
                                    placeholder="Informe número para contato"
                                    name="phone"
                                    value={this.state.client.phone}
                                    onChange={e => this.updateFieldClient(e)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="form-group">
                                <label>Endereço</label>
                                <input type="text" className="form-control client"
                                    placeholder="Informe o endereço para entrega"
                                    name="address"
                                    value={this.state.client.address}
                                    onChange={e => this.updateFieldClient(e)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-3">
                            <div className="form-group">
                                <label>Bairro </label>
                                <select name="neighborhood" value={this.state.client.neighborhood.id_neighborhood} className="form-control" onChange={e => this.updateFieldClient(e, "neighborhood")}>
                                    <option value="" disabled selected hidden>Selecione..</option>
                                    {this.state.neighborhoods.map((neighborhood, index) => {
                                        return (
                                            <option key={`bairro${index}`} value={neighborhood.id}>{neighborhood.name} - R${neighborhood.price}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    {this.state.acais.map((acai, index) => {
                        return (
                            this.renderNovoAcai(acai, index)
                        )
                    })}

                    <div className="row d-flex d-flex flex-row align-items-center">

                        <div className="col-4 d-flex flex-column align-self-center">

                            <h7 is="x3d">Frete: ${this.state.client.neighborhood.price}</h7>
                            <h4>Total: R${parseFloat(this.state.total).toFixed(2)}</h4>
                        </div>

                        <div id="buttons" className="col-8 d-flex justify-content-end align-self-start mt-2">
                            <div id="xd"></div>
                            <button type="submit" className="btn btn-danger ml-1" onClick={() => this.submitOrder()}>
                                Realizar Pedido
                            </button>

                            {/* <Printer2 array={this.calcularSubtotal()} onBefore={() => this.submitOrder()} onClickClose={e => this.clear()} /> */}

                            <button type="submit" className="btn btn-info ml-1" onClick={e => this.adicionarAcai(e)}>
                                Adicionar Açaí
                            </button>

                            <button className="btn btn-secondary ml-1" onClick={e => this.clear(e)}>
                                Cancelar/Limpar
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        )
    }

    render() {
        return (
            <Main {...headerProps}>
                <ToastContainer />
                {this.renderForm()}
            </Main>
        )
    }
}