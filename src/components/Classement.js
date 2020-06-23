import React from 'react'
import Table from 'react-bootstrap/Table'

const Classement = (props) => {
	const { resCampar, resNation } = props
	const comps = []

	function cheapest(resCampar, resNation) {
		if (resNation.Price <= resCampar.Total) {
			return resNation
		} else {
			return resCampar
		}
	}

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
					<td>1</td>
					<td>2</td>
					<td>3</td>
					<td>4</td>
				</tr>
				<tr>
					<td>1</td>
					<td>2</td>
					<td>3</td>
					<td>4</td>
				</tr>
			</tbody>
		</Table>
	)
}

export default Classement
