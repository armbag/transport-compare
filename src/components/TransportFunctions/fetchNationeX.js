export default function (e) {
	e.preventDefault()
	setIsLoading(true)

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
			Authorization: 'AISDJA6I6OCUY6ELG3GFRRSUXHRJV',
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
