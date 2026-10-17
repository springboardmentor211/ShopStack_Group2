import { useNavigate } from 'react-router-dom'
import FulfillmentPage from './FulfillmentPage.jsx'
import { useOrderDesk } from '../hooks/useOrderDesk.js'

export default function PickingPage() {
  const navigate = useNavigate()
  const { orders, updateOrder } = useOrderDesk()

  return (
    <FulfillmentPage
      orders={orders}
      onUpdateOrder={updateOrder}
      onOpenOrderDesk={() => navigate('/warehouse/orders')}
    />
  )
}
