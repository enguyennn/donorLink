export type Page = 'home' | 'donorDashboard' | 'shelterLogin' | 'shelterSignUp' | 'shelterDashboard' | 'impact' | 'contact';

export interface Shelter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  lat: number;
  lng: number;
}

export enum ItemType {
  Food = "Food",
  Clothing = "Clothing",
  Hygiene = "Hygiene",
  Blankets = "Blankets",
  Other = "Other",
}

export enum Urgency {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum Status {
    Active = "Active",
    Pending = "Pending",
    Fulfilled = "Fulfilled",
}

export interface Need {
  id: string;
  shelterId: string;
  itemType: ItemType;
  name: string;
  originalQuantity: number;
  quantity: number;
  urgency: Urgency;
  description: string;
  status: Status;
}