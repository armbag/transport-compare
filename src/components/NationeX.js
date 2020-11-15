import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ipcRenderer } from 'electron'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { useCallback } from 'react'

const NationeX = () => {
	const [destPostalCode, setDestPostalCode] = useState('J9B2C3')
	const [codCharge, setCodCharge] = useState('0.00')
	const [shippingType, setShippingType] = useState(1)
	const [parcelNb, setParcelNb] = useState('3')
	const [totalWeight, setTotalWeight] = useState('50')
	const [response, setResponse] = useState({})
	const [isLoading, setIsLoading] = useState(false)

	const nationBody = useRef({
		CustomerId: 136850,
		DestPostalCode: destPostalCode,
		ShippingType: shippingType,
		CODPrice: codCharge,
		ParcelNb: parcelNb,
		TotalWeight: totalWeight,
	})

	useEffect(() => {
		nationBody.current = {
			CustomerId: 136850,
			DestPostalCode: destPostalCode,
			ShippingType: shippingType,
			CODPrice: codCharge,
			ParcelNb: parcelNb,
			TotalWeight: totalWeight,
		}
	}, [totalWeight, shippingType, destPostalCode, codCharge, parcelNb])

	useEffect(() => {
		ipcRenderer.on('nation:response', (e, response) => {
			console.log(response)
			setResponse({ ...JSON.parse(response) })
		})
		return () => {
			setIsLoading(false)
		}
	}, [response])

	function handleSubmitFetch(e) {
		e.preventDefault()
		setIsLoading(true)
		ipcRenderer.send('nation:fetch', JSON.stringify(nationBody.current))
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

						<Button
							type='submit'
							variant='secondary'
							block
							disabled={isLoading}
						>
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
