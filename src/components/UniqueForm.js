import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Classement from './Classement'
import rateShipment_req from './TransportFunctions/rateShipment_req'
import { useRef } from 'react'
require('dotenv').config()

const UniqueForm = () => {
	const [destination, setDestination] = useState('J9B2C3')
	const [weight, setWeight] = useState('50')
	const [codCharge, setCodCharge] = useState('0.00')
	const [quantity, setQuantity] = useState('1')
	const [resCanpar, setResCanpar] = useState({ name: 'Canpar' })
	const [resNation, setResNation] = useState({ name: 'NationeX' })
	const [isLoading, setIsLoading] = useState(false)
	const canparBody = useRef(
		rateShipment_req(weight, destination, codCharge, quantity)
	)
	const nationBody = useRef({
		CustomerId: 136850,
		DestPostalCode: destination,
		CODPrice: codCharge,
		ShippingType: 1,
		ParcelNb: quantity,
		TotalWeight: weight,
	})

	useEffect(() => {
		ipcRenderer.on('nation:response', (e, response) => {
			console.log('FROM UNIQ FORM NationeX API response : \n', response)
			setResNation({ ...resNation, ...JSON.parse(response) })
		})
		ipcRenderer.on('canpar:response', (e, response) => {
			console.log('FROM UNIQ FORM Canpar API response : \n', response)
			let parser = new DOMParser()
			let xmlDoc = parser.parseFromString(response, 'text/xml')
			const res = xmlDoc.getElementsByTagName('ns:return')[0]
			if (res.getElementsByTagName('ax25:error').innerHTML) {
				setResCanpar({
					...resCanpar,
					error: res.getElementsByTagName('ax25:error')[0].innerHTML,
				})
			} else {
				setResCanpar({
					...resCanpar,
					TaxCharge: res.getElementsByTagName('ax27:tax_charge_1')[0].innerHTML,
					FuelCharge: res.getElementsByTagName('ax27:fuel_surcharge')[0]
						.innerHTML,
					Price: res.getElementsByTagName('ax27:total')[0].innerHTML,
				})
			}
			setIsLoading(false)
		})
	}, [resNation, resCanpar])

	useEffect(() => {
		canparBody.current = rateShipment_req(
			weight,
			destination,
			codCharge,
			quantity
		)
		nationBody.current = {
			CustomerId: 136850,
			DestPostalCode: destination,
			CODPrice: codCharge,
			ShippingType: 1,
			ParcelNb: quantity,
			TotalWeight: weight,
		}
	}, [weight, destination, codCharge, quantity])

	function handleBothFetch(e) {
		e.preventDefault()
		setIsLoading(true)
		ipcRenderer.send('nation:fetch', JSON.stringify(nationBody.current))
		ipcRenderer.send('canpar:fetch', canparBody.current)
	}

	return (
		<>
			<Card>
				<Card.Title className='text-center mt-3 mb-3'>Generic Form</Card.Title>
				<Card.Body>
					<Form onSubmit={handleBothFetch}>
						<Row>
							<Col>
								<Form.Group controlId='DestPostalCode'>
									<Form.Label>Postal Code Destination :</Form.Label>
									<Form.Control
										value={destination}
										onChange={(e) => setDestination(e.target.value)}
									/>
								</Form.Group>
								<Form.Group controlId='CodCharge'>
									<Form.Label>COD ($)</Form.Label>
									<Form.Control
										value={codCharge}
										onChange={(e) => setCodCharge(e.target.value)}
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group controlId='parcelNB'>
									<Form.Label>How many parcels?</Form.Label>
									<Form.Control
										value={quantity}
										onChange={(e) => setQuantity(e.target.value)}
									/>
								</Form.Group>
								<Form.Group controlId='weight'>
									<Form.Label>Total Weight</Form.Label>
									<Form.Control
										value={weight}
										onChange={(e) => setWeight(e.target.value)}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Button type='submit' variant='secondary' block>
							Submit
						</Button>
					</Form>
				</Card.Body>
			</Card>
			{isLoading ? 'Loading...' : ''}
			{resCanpar.Price && resNation.Price && (
				<Classement resCanpar={resCanpar} resNation={resNation} />
			)}
		</>
	)
}

export default UniqueForm
