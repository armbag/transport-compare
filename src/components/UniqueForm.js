import React, { useState, useEffect } from 'react'
import Classement from './Classement'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import rateShipment_req from './TransportFunctions/rateShipment_req'

const UniqueForm = () => {
	const [destination, setDestination] = useState('J9B2C3')
	const [weight, setWeight] = useState('50')
	const [codCharge, setCodCharge] = useState('0.00')
	const [quantity, setQuantity] = useState('1')
	const [responseNation, setResponseNation] = useState()
	const [responseCampar, setResponseCampar] = useState()
	const [response, setResponse] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	let camparBody
	let nationBody
	let nationRequestOpt
	let camparRequestOpt

	useEffect(() => {
		camparBody = rateShipment_req(weight, destination, codCharge, quantity)
		nationBody = {
			CustomerId: process.env.NATION_ID,
			DestPostalCode: destination,
			CODPrice: codCharge,
			ShippingType: 1,
			ParcelNb: quantity,
			TotalWeight: weight,
		}

		nationRequestOpt = {
			method: 'POST',
			headers: {
				Authorization: process.env.NATION_API,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(nationBody),
		}
		camparRequestOpt = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/html',
				// 'X-Requested-With': 'Fetch',
			},
			body: camparBody,
			redirect: 'follow',
		}
	}, [weight, destination, codCharge, quantity])

	function filtered(data) {
		const allowed = ['NCV', 'Price']
		const res = Object.keys(data)
			.filter((key) => allowed.includes(key))
			.reduce((obj, key) => {
				obj[key] = data[key]
				return obj
			}, {})
		return res
	}
	function handleBothFetch(e) {
		e.preventDefault()
		setIsLoading(true)

		// first nationeX
		const nationUrl = 'https://apidev.nationex.com/api/ShippingV2/GetPrice'
		fetch(nationUrl, nationRequestOpt)
			.then((res) => res.json())
			.then((data) => {
				console.log('nation worked')
				return setResponseNation(filtered(data))
			})
			.catch((error) => setResponseNation(error))

		// then campar
		const proxyUrl = 'https://powerful-taiga-45132.herokuapp.com/',
			camparUrl =
				'https://sandbox.canpar.com/canshipws/services/CanparRatingService'
		fetch(proxyUrl + camparUrl, camparRequestOpt)
			.then((res) => res.text())
			.then((data) => {
				console.log('campar worked too!')
				let parser = new DOMParser(),
					xmlDoc = parser.parseFromString(data, 'text/xml')
				const response = xmlDoc.getElementsByTagName('ns:return')[0]
				if (response.getElementsByTagName('ax25:error').innerHTML) {
					return setResponse(
						response.getElementsByTagName('ax25:error')[0].innerHTML
					)
				} else {
					return setResponseCampar({
						'Tax charge': response.getElementsByTagName('ax27:tax_charge_1')[0]
							.innerHTML,
						'Fuel Charge': response.getElementsByTagName(
							'ax27:fuel_surcharge'
						)[0].innerHTML,
						Total: response.getElementsByTagName('ax27:total')[0].innerHTML,
					})
				}
			})
			.catch((error) => {
				console.log(error)
				return setResponseCampar([{ 'Server Error': 'bad request' }])
			})
			.finally(() => setIsLoading(false))
	}

	return (
		<>
			<Card className='mt-4'>
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
			{responseCampar ? (
				<Classement resCampar={responseCampar} resNation={responseNation} />
			) : (
				''
			)}
		</>
	)
}

export default UniqueForm