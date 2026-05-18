export type Product = {
  id: string
  name: string
  slug: string
  category: string
  price: number
  originalPrice?: number
  description?: string
  image: string
  images?: string[]
  inStock: boolean
  stockQty?: number
  requiresPrescription: boolean
  isActive?: boolean
}

export type CartItem = {
  product: Product
  quantity: number
}

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export type Order = {
  id: string
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  status: 'pending' | 'confirmed' | 'packing' | 'dispatched' | 'delivered' | 'cancelled'
  deliveryAddress: Address
  paymentMethod: 'mtn_momo' | 'airtel_money' | 'card'
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: string
  estimatedDelivery?: string
}

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  addresses: Address[]
}

export type Address = {
  id: string
  name: string
  phone: string
  street: string
  district: string
  instructions?: string
  isDefault: boolean
}
