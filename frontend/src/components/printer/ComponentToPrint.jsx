
import React from 'react'
import './ComponentToPrint.css'

export default class ComponentToPrint extends React.PureComponent {
    render() {
      return (
        <div className="container">
        <h1>ESTAÇÃO DO AÇAÍ</h1>
        <span>Dados do cliente</span>
        <p>Nome: {this.props.array.client.name}</p>
        <p>Telefone: {this.props.array.client.phone}</p>
        <p>{this.props.array.client.address}</p>
        <p>Bairro: {this.props.array.client.neighborhood.name}</p>
        <hr />
        <span>Itens do pedido</span>
        <table>
        <thead>
          <th>qtd</th>
          <th>Item</th>
        </thead>
        
        {this.props.array.acais.map((acai, index) => {
                                return (
                                    <tbody key={`body ${index}`}>
                                    <tr>
                                      <td>{1}</td>
                                      <td className="acainame">
                                        {acai.acai} {acai.size}ml
                                      {acai.description &&
                                        <span>({acai.description})</span>
                                      }
                                      </td>
                                    </tr>
                                    {acai.adicionais.map((adicional, indexx) => {
                                      return(
                                        <tr key={`acai=${index}adicional=${indexx}`}>
                                        <td></td>
                                        <td className="tdadditional" key={`acai=${index}index=${indexx}add=${adicional}`}>{adicional.adicional}</td>
                                        </tr>
                                      )
                                    })}

                                   </tbody>
                                    
                                )
                            })}
        </table>
        <footer>
          <h4>Frete: R${parseFloat(this.props.array.client.neighborhood.price).toFixed(2)}</h4>
          <h3>Total: R${parseFloat(this.props.array.client.total).toFixed(2)}</h3>
        </footer>
        </div>
        );
    }
  }