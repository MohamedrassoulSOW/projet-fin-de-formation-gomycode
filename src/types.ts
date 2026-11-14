export type Category =
  | 'Immobilier'
  | 'Véhicules'
  | 'Maison & déco'
  | 'Informatique'
  | 'Emploi & formation'
  | 'Services'
  | 'Loisirs'
  | 'Communauté'

export type Listing = {
  id: string
  title: string
  category: Category
  type: 'Vente' | 'Location' | 'Service' | 'Don'
  city: string
  price: number
  image: string
  description: string
  seller: string
  initials: string
  date: string
  featured?: boolean
}

export type User = {
  name: string
  email: string
  city: string
}
