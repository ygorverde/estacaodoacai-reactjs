import React from 'react'
import './OrderDetails.css'
import Printer2 from '../printer/Printer2'

const OrderDetails = ({ order }) => {
    return (
        <div className="details">
             <Printer2 array={order} />

            <p>Contato: {order.client.phone}</p>
            <p>Endereço: {order.client.address} - {order.client.neighborhood.name} (R${order.client.shipping})</p>
            {order.acais.map((acai, index) => {
                return (
                    <React.Fragment>
                        <p><strong>{acai.acai} {acai.size}ml (R${acai.total})</strong></p>
                        <p>
                        {acai.adicionais.map((additional, index) => {
                            return (
                                <span>{additional.adicional} - </span>
                            )
                        })} 
                        </p>
                    </React.Fragment>
                )
            })}
        </div>
    )
}

// {
//     "acai": "Açaí Morango",  
//     "size": "500",
//     "adicionais": [
//       {
//         "adicional": "Aveia "
//       },
//       {
//         "adicional": "C. Chocolate "
//       }
//     ],
//     "total": "22.00",
//     "description": ""
//   },

export default OrderDetails