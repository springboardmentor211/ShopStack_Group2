import { useNavigate } from 'react-router-dom'
import FulfillmentPage from './FulfillmentPage.jsx'
import { useOrderDesk } from '../hooks/useOrderDesk.js'
import '../../App.css'

export default function PickingPage() {
  const navigate = useNavigate()
  const { orders, updateOrder } = useOrderDesk()

  return (
    <div className="app-shell">
      <div className="workspace">
        <FulfillmentPage
          orders={orders}
          onUpdateOrder={updateOrder}
          onOpenOrderDesk={() => navigate('/warehouse/orders')}
        />
      </div>
    </div>
  )
}
