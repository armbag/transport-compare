import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

require('dotenv').config()

const NationeX = () => {
	const [destPostalCode, setDestPostalCode] = useState('J9B2C3')
	const [codCharge, setCodCharge] = useState('0.00')

	const [parcelNb, setParcelNb] = useState('3')
	const [totalWeight, setTotalWeight] = useState('50')
	const [response, setResponse] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	function handleSubmitFetch(e) {
		e.preventDefault()
		setIsLoading(true)

		const body = {
			CustomerId: process.env.NATION_ID,
			DestPostalCode: destPostalCode,
			ShippingType: 1,
			CODPrice: codCharge,
			ParcelNb: parcelNb,
			TotalWeight: totalWeight,
		}

		const requestOptions = {
			method: 'POST',
			headers: {
				Authorization: process.env.NATION_API,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}

		const url = 'https://apidev.nationex.com/api/ShippingV2/GetPrice'
		fetch(url, requestOptions)
			.then((res) => res.json())
			.then((data) => {
				const allowed = ['NCV', 'Price']

				const filtered = Object.keys(data)
					.filter((key) => allowed.includes(key))
					.reduce((obj, key) => {
						obj[key] = data[key]
						return obj
					}, {})
				return setResponse(filtered)
			})
			.catch((error) => setResponse(error))
			.finally(() => setIsLoading(false))
	}

	return (
		<>
			<Card>
				<Card.Title className='text-center mt-2'>NationeX</Card.Title>
				<Card.Body>
					<Form onSubmit={handleSubmitFetch}>
						<Form.Group controlId='DestPostalCode'>
							<Form.Label>Postal Code Destination :</Form.Label>
							<Form.Control
								value={destPostalCode}
								onChange={(e) => setDestPostalCode(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId='codCharge'>
							<Form.Label>COD ($) :</Form.Label>
							<Form.Control
								type='number'
								value={codCharge}
								onChange={(e) => setCodCharge(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId='ParcelNb'>
							<Form.Label>How many parcels?</Form.Label>
							<Form.Control
								value={parcelNb}
								onChange={(e) => setParcelNb(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId='TotalWeight'>
							<Form.Label>Total Weight</Form.Label>
							<Form.Control
								type='text'
								value={totalWeight}
								onChange={(e) => setTotalWeight(e.target.value)}
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

export default NationeX
