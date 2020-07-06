// eslint-disable-next-line no-dupe-args
require('dotenv').config()

export default function rawXML2(
	billed_weight,
	postal_code_delivery,
	cod_charge,
	qty = 1,
	consolidation_type = '',
	delivery_address = '',
	pickup_address = ''
) {
	const shipmentW = billed_weight * qty
	let packages = `<packages xmlns="http://dto.canshipws.canpar.com/xsd">
	<alternative_reference />
	<barcode />
	<billed_weight>3.0</billed_weight>
	<cod xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="1" />
	<cost_centre />
	<declared_value>0.0</declared_value>
	<dim_weight>4.0</dim_weight>
	<dim_weight_flag>false</dim_weight_flag>
	<height>0.0</height>
	<id>-1</id>
	<length>0.0</length>
	<min_weight_flag>false</min_weight_flag>
	<package_num>1</package_num>
	<package_reference>0</package_reference>
	<reference />
	<reported_weight>1.0</reported_weight>
	<store_num />
	<width>0.0</width>
	<xc>false</xc>
</packages>`

	for (let i = 1; i < qty; i++) {
		packages += packages
	}

	return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
	<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope">
		<soapenv:Body>
			<ns3:rateShipment xmlns:ns3="http://ws.onlinerating.canshipws.canpar.com">
				<ns3:request>
					<ns1:apply_association_discount xmlns:ns1="http://ws.dto.canshipws.canpar.com/xsd">false</ns1:apply_association_discount>
					<ns1:apply_individual_discount xmlns:ns1="http://ws.dto.canshipws.canpar.com/xsd">false</ns1:apply_individual_discount>
					<ns1:apply_invoice_discount xmlns:ns1="http://ws.dto.canshipws.canpar.com/xsd">false</ns1:apply_invoice_discount>
					<ns1:password xmlns:ns1="http://ws.dto.canshipws.canpar.com/xsd">${process.env.CANPAR_PASSWORD}</ns1:password>
					<shipment xmlns="http://ws.dto.canshipws.canpar.com/xsd">
						<ns2:billed_weight xmlns:ns2="http://dto.canshipws.canpar.com/xsd">${billed_weight}</ns2:billed_weight>
						<ns2:billed_weight_unit xmlns:ns2="http://dto.canshipws.canpar.com/xsd">L</ns2:billed_weight_unit>
						<ns2:cod_charge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">${cod_charge}</ns2:cod_charge>
						<ns2:cod_type xmlns:ns2="http://dto.canshipws.canpar.com/xsd">N</ns2:cod_type>
						<ns2:collect_shipper_num xmlns:ns2="http://dto.canshipws.canpar.com/xsd">${process.env.CANPAR_SHIPPER_NUM}</ns2:collect_shipper_num>
						<ns2:consolidation_type xmlns:ns2="http://dto.canshipws.canpar.com/xsd">${consolidation_type}</ns2:consolidation_type>
						<ns2:cos xmlns:ns2="http://dto.canshipws.canpar.com/xsd">false</ns2:cos>
						<ns2:cos_charge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:cos_charge>
						<delivery_address xmlns="http://dto.canshipws.canpar.com/xsd">
							<address_id>A1</address_id>
							<address_line_1>${delivery_address}</address_line_1>
							<address_line_2 />
							<address_line_3 />
							<attention />
							<city>Montreal</city>
							<country>CA</country>
							<email>1@1.COM</email>
							<extension></extension>
							<id>1</id>
							<name></name>
							<phone></phone>
							<postal_code>${postal_code_delivery}</postal_code>
							<province>QC</province>
							<residential>false</residential>
						</delivery_address>
						<ns2:description xmlns:ns2="http://dto.canshipws.canpar.com/xsd" />
						<ns2:dg xmlns:ns2="http://dto.canshipws.canpar.com/xsd">false</ns2:dg>
						<ns2:dg_charge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:dg_charge>
						<ns2:dimention_unit xmlns:ns2="http://dto.canshipws.canpar.com/xsd">I</ns2:dimention_unit>
						<ns2:dv_charge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:dv_charge>
						<ns2:ea_charge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:ea_charge>
						<ns2:ea_zone xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0</ns2:ea_zone>
						<ns2:freight_charge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:freight_charge>
						<ns2:fuel_surcharge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:fuel_surcharge>
						<ns2:handling xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:handling>
						<ns2:handling_type xmlns:ns2="http://dto.canshipws.canpar.com/xsd">$</ns2:handling_type>
						<ns2:id xmlns:ns2="http://dto.canshipws.canpar.com/xsd">-1</ns2:id>
						<ns2:instruction xmlns:ns2="http://dto.canshipws.canpar.com/xsd" />
						<ns2:manifest_num xmlns:ns2="http://dto.canshipws.canpar.com/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="1" />
						<ns2:nsr xmlns:ns2="http://dto.canshipws.canpar.com/xsd">false</ns2:nsr>
						${packages}
						<pickup_address xmlns="http://dto.canshipws.canpar.com/xsd">
							<address_id>A1</address_id>
							<address_line_1>${pickup_address}</address_line_1>
							<address_line_2 />
							<address_line_3 />
							<attention />
							<city>TORONTO</city>
							<country>CA</country>
							<email>1@1.COM,2@2.COM</email>
							<extension>23</extension>
							<id>-1</id>
							<name></name>
							<phone>4161234567</phone>
							<postal_code>${postal_code_delivery}</postal_code>
							<province>QC</province>
							<residential>false</residential>
						</pickup_address>
						<ns2:premium xmlns:ns2="http://dto.canshipws.canpar.com/xsd">N</ns2:premium>
						<ns2:premium_charge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:premium_charge>
						<ns2:proforma xmlns:ns2="http://dto.canshipws.canpar.com/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="1" />
						<ns2:ra_charge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:ra_charge>
						<ns2:reported_weight_unit xmlns:ns2="http://dto.canshipws.canpar.com/xsd">L</ns2:reported_weight_unit>
						<ns2:rural_charge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:rural_charge>
						<ns2:send_email_to_delivery xmlns:ns2="http://dto.canshipws.canpar.com/xsd">false</ns2:send_email_to_delivery>
						<ns2:send_email_to_pickup xmlns:ns2="http://dto.canshipws.canpar.com/xsd">false</ns2:send_email_to_pickup>
						<ns2:service_type xmlns:ns2="http://dto.canshipws.canpar.com/xsd">1</ns2:service_type>
						<ns2:shipment_status xmlns:ns2="http://dto.canshipws.canpar.com/xsd">R</ns2:shipment_status>
						<ns2:shipper_num xmlns:ns2="http://dto.canshipws.canpar.com/xsd">${process.env.CANPAR_SHIPPER_NUM}</ns2:shipper_num>
						<ns2:shipping_date xmlns:ns2="http://dto.canshipws.canpar.com/xsd">2020-06-15T00:00:00.000-04:00</ns2:shipping_date>
						<ns2:tax_charge_1 xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:tax_charge_1>
						<ns2:tax_charge_2 xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:tax_charge_2>
						<ns2:tax_code_1 xmlns:ns2="http://dto.canshipws.canpar.com/xsd" />
						<ns2:tax_code_2 xmlns:ns2="http://dto.canshipws.canpar.com/xsd" />
						<ns2:transit_time xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0</ns2:transit_time>
						<ns2:transit_time_guaranteed xmlns:ns2="http://dto.canshipws.canpar.com/xsd">false</ns2:transit_time_guaranteed>
						<ns2:user_id xmlns:ns2="http://dto.canshipws.canpar.com/xsd" />
						<ns2:voided xmlns:ns2="http://dto.canshipws.canpar.com/xsd">false</ns2:voided>
						<ns2:xc_charge xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0.0</ns2:xc_charge>
						<ns2:zone xmlns:ns2="http://dto.canshipws.canpar.com/xsd">0</ns2:zone>
					</shipment>
					<ns1:user_id xmlns:ns1="http://ws.dto.canshipws.canpar.com/xsd">${process.env.CANPAR_USER_ID}</ns1:user_id>
				</ns3:request>
			</ns3:rateShipment>
		</soapenv:Body>
	</soapenv:Envelope>`
}
