import { useCallback, useEffect, useState } from 'react'
import { getWarehouseOrders, saveWarehouseOrders } from '../services/orderDeskService.js'

export function useOrderDesk() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    let alive = true
    getWarehouseOrders().then((loaded) => {
      if (alive) setOrders(loaded)
    })
    return () => {
      alive = false
    }
  }, [])

  const updateOrder = useCallback((orderId, changes) => {
    setOrders((current) => {
      const updated = current.map((order) => (order.id === orderId ? { ...order, ...changes } : order))
      saveWarehouseOrders(updated)
      return updated
    })
  }, [])

  return { orders, updateOrder }
}
