import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import NationeX from './NationeX'
import Campar from './Campar'

const App = () => {
	return (
		<Container>
			<Row className='justify-content-center'>
				<h1>Transport Compare</h1>
			</Row>
			<Row>
				<Col>
					<NationeX />
				</Col>
				<Col>
					<Campar />
				</Col>
			</Row>
		</Container>
	)
}

export default App
