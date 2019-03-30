/**
 * The DTO's for the Core services.
 */

export interface ColumnDef {
  name?: string;
  displayName?: string;
  class?: string;
}

export interface Customer {
  _id: string;
  entity: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  telephone: string;
  mobile: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  county: string;
  product: string;
  balance: string;
  sharedKeyword: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  _id: string;
  entity: string;
  name: string;
  description: string;
  telephone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  _id: string;
  entity: string;
  customer_id: string;
  campaign_name: string;
  method: string;
  conversation: string;
  created_at: string;
  updated_at: string;
}

export interface TrustTag {

  _id: string;
  entity: string;
  contact_id: string;
  customer_id: string;
  sharedFactType: string;
  trusttag: string;
  created_at: string;
  updated_at: string;

}
