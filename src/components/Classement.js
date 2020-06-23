import React, { useEffect } from 'react'
import Table from 'react-bootstrap/Table'

const Classement = (props) => {
	const { resNation, resCampar } = props

	console.log('in Classement    ')
	console.log(resNation)
	console.log(resCampar)

	function ordered(resNation, resCampar) {
		let res = []
		if (resNation.Price <= resCampar.Price) {
			res = [resNation, resCampar]
		} else {
			res = [resCampar, resNation]
		}
		return res
	}

	let res = ordered(resNation, resCampar)

	return (
		<Table striped bordered>
			<thead>
				<tr>
					<th>Company</th>
					<th>Total Price</th>
					<th>Tax</th>
					<th>Fuel</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>{res[0].name}</td>
					<td>{res[0].Price}</td>
					<td>{res[0].TaxCharge ? res[0].TaxCharge : 'NA'}</td>
					<td>{res[0].FuelCharge ? res[0].FuelCharge : 'NA'}</td>
				</tr>
				<tr>
					<td>{res[1].name}</td>
					<td>{res[1].Price}</td>
					<td>{res[1].TaxCharge ? res[1].TaxCharge : 'NA'}</td>
					<td>{res[1].FuelCharge ? res[1].TaxCharge : 'NA'}</td>
				</tr>
			</tbody>
		</Table>
	)
}

export default Classement
