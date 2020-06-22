import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const Campar = () => {
	const [billed_weight, setBilled_weight] = useState('50')
	const [cod_charge, setCod_charge] = useState('0.00')
	const [postal_code_delivery, setPostal_code_delivery] = useState('J9B2C3')
	const [qty, setQty] = useState('1')
	const [response, setResponse] = useState()

	function handleSubmitFetch(e) {
		e.preventDefault()

		const rateShipmentTry = rateShipment_req(
			billed_weight,
			consolidation_type,
			delivery_address,
			pickup_address,
			postal_code_delivery
		)

		console.log(
			billed_weight,
			cod_charge,
			consolidation_type,
			delivery_address,
			pickup_address,
			postal_code_delivery
		)

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/html',
				'X-Requested-With': 'Fetch',
			},
			body: rateShipmentTry,
			redirect: 'follow',
		}

		const proxyUrl = 'https://powerful-taiga-45132.herokuapp.com/'
		fetch(
			proxyUrl +
				'https://sandbox.canpar.com/canshipws/services/CanparRatingService',
			requestOptions
		)
			.then((res) => res.text())
			.then((data) => {
				console.log(data)
				let parser = new DOMParser(),
					xmlDoc = parser.parseFromString(data, 'text/xml')
				const response = xmlDoc.getElementsByTagName('ns:return')[0]
				if (response.getElementsByTagName('ax25:error').innerHTML) {
					return setResponse(
						response.getElementsByTagName('ax25:error')[0].innerHTML
					)
				} else {
					return setResponse([
						{
							'Tax charge': response.getElementsByTagName(
								'ax27:tax_charge_1'
							)[0].innerHTML,
						},
						{
							'Fuel Charge': response.getElementsByTagName(
								'ax27:fuel_surcharge'
							)[0].innerHTML,
						},
						{ Total: response.getElementsByTagName('ax27:total')[0].innerHTML },
					])
				}
			})
			.catch((error) => {
				console.log(error)
				return setResponse([{ 'Server Error': 'bad request' }])
			})
	}

	return (
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
							value={qty}
							onChange={(e) => setQty(e.target.value)}
						/>
					</Form.Group>
					<Button type='submit' variant='secondary' block>
						Submit
					</Button>
				</Form>
			</Card.Body>
		</Card>
	)
}

export default Campar
