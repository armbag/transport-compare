import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const NationeX = () => {
	const [destPostalCode, setDestPostalCode] = useState('J9B2C3')
	const [shippingType, setShippingType] = useState(0)
	const [parcelNb, setParcelNb] = useState('3')
	const [totalWeight, setTotalWeight] = useState('50')
	const [response, setResponse] = useState()

	function handleSubmitFetch(e) {
		e.preventDefault()

		const body = {
			CustomerId: 136850,
			DestPostalCode: destPostalCode,
			ShippingType: shippingType,
			ParcelNb: parcelNb,
			TotalWeight: totalWeight,
		}

		const requestOptions = {
			method: 'POST',
			headers: {
				Authorization: 'toDo',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}

		const url = 'https://apidev.nationex.com/api/ShippingV2/GetPrice'
		fetch(url, requestOptions)
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
				return setResponse(data)
			})
			.catch((error) => setResponse(error))
	}

	return (
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

					<Form.Group controlId='shippingtype'>
						<Form.Label>Shipping Type</Form.Label>
						<Form.Control
							type='number'
							value={shippingType}
							onChange={(e) => setShippingType(e.target.value)}
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
	)
}

export default NationeX
