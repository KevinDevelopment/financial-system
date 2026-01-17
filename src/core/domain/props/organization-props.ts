import { AddressProps } from "./address-props";

export interface OrganizationProps {
	name: string;
	cnpj: string;
	socialReason?: string;
	phone?: string;
	address?: AddressProps;
	id?: bigint;
}
