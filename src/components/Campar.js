import React, { useState, useEffect, useRef } from 'react'
import { ipcRenderer } from 'electron'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import rateShipment_req from './TransportFunctions/rateShipment_req'

const Campar = () => {
	const [billed_weight, setBilled_weight] = useState('50')
	const [cod_charge, setCod_charge] = useState('0.00')
	const [postal_code_delivery, setPostal_code_delivery] = useState('J9B2C3')
	const [quantity, setQuantity] = useState('1')
	const [response, setResponse] = useState({})
	const [isLoading, setIsLoading] = useState(false)

	const canparBody = useRef(
		rateShipment_req(billed_weight, postal_code_delivery, cod_charge, quantity)
	)

	useEffect(() => {
		canparBody.current = rateShipment_req(
			billed_weight,
			postal_code_delivery,
			cod_charge,
			quantity
		)
	}, [billed_weight, postal_code_delivery, cod_charge, quantity])

	useEffect(() => {
		ipcRenderer.on('canpar:response', (e, resp) => {
			let parser = new DOMParser()
			let xmlDoc = parser.parseFromString(resp, 'text/xml')
			const res = xmlDoc.getElementsByTagName('ns:return')[0]
			if (res.getElementsByTagName('ax25:error').innerHTML) {
				setResponse({
					Error: res.getElementsByTagName('ax25:error')[0].innerHTML,
				})
			} else {
				setResponse({
					TaxCharge: res.getElementsByTagName('ax27:tax_charge_1')[0].innerHTML,
					FuelCharge: res.getElementsByTagName('ax27:fuel_surcharge')[0]
						.innerHTML,
					Price: res.getElementsByTagName('ax27:total')[0].innerHTML,
				})
			}
		})
		return () => {
			setIsLoading(false)
		}
	}, [response])

	function handleSubmitFetch(e) {
		e.preventDefault()
		setIsLoading(true)
		ipcRenderer.send('canpar:fetch', canparBody.current)
	}

	return (
		<>
			<Card>
				<Card.Title className='text-center mt-2'>Campar</Card.Title>
				<Card.Body>
					<Form onSubmit={handleSubmitFetch}>
						<Form.Group controlId='billed_weight'>
							<Form.Label>Billed Weight (Lbs)</Form.Label>
							<Form.Control
								value={billed_weight}
								onChange={(e) => setBilled_weight(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId='cod_charge'>
							<Form.Label>COD ($)</Form.Label>
							<Form.Control
								value={cod_charge}
								onChange={(e) => setCod_charge(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId='postal_code_delivery'>
							<Form.Label>Postal Code Delivery</Form.Label>
							<Form.Control
								value={postal_code_delivery}
								onChange={(e) => setPostal_code_delivery(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId='ladingQty'>
							<Form.Label>Lading Quantity</Form.Label>
							<Form.Control
								value={quantity}
								onChange={(e) => setQuantity(e.target.value)}
							/>
						</Form.Group>
						<Button type='submit' variant='secondary' block>
							Submit
						</Button>
					</Form>
				</Card.Body>
			</Card>
			{isLoading ? (
				'Loading...'
			) : (
				<ListGroup>
					{Object.keys(response).map((key) => {
						return (
							<ListGroup.Item key={key}>
								{key}: {response[key]}
							</ListGroup.Item>
						)
					})}
				</ListGroup>
			)}
		</>
	)
}

export default Campar
