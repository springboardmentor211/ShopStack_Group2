import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getWarehouseOrders, saveWarehouseOrders } from '../services/orderDeskService.js'
import { recordOrderStatus, recordPlacedOrders } from '../services/movementService.js'
import { fetchMovements } from '../store/slices/movementSlice.js'
import { useCurrentWarehouse } from './useCurrentWarehouse.js'

export function useOrderDesk() {
  const dispatch = useDispatch()
  const { warehouse, warehouseId } = useCurrentWarehouse()
  const ownerName = warehouse?.ownerName
  const [orders, setOrders] = useState([])
  const ordersRef = useRef([])

  useEffect(() => {
    if (!warehouseId) return undefined
    let alive = true
    const loadOrders = () => {
      getWarehouseOrders(warehouseId).then((loaded) => {
        if (!alive) return
        ordersRef.current = loaded
        setOrders(loaded)
      })
    }
    const handleStorage = (event) => {
      if (event.key === 'shopstack_demo_orders') loadOrders()
    }

    loadOrders()
    window.addEventListener('storage', handleStorage)
    return () => {
      alive = false
      window.removeEventListener('storage', handleStorage)
    }
  }, [warehouseId])

  useEffect(() => {
    if (!warehouseId || orders.length === 0) return
    if (recordPlacedOrders(warehouseId, orders)) dispatch(fetchMovements(warehouseId))
  }, [warehouseId, orders, dispatch])

  const updateOrder = useCallback(
    (orderId, changes) => {
      const current = ordersRef.current
      const target = current.find((order) => order.id === orderId)
      if (!target) return

      const next = { ...target, ...changes }
      const updated = current.map((order) => (order.id === orderId ? next : order))
      ordersRef.current = updated
      setOrders(updated)
      saveWarehouseOrders(updated)

      if (changes.status && changes.status !== target.status && warehouseId) {
        recordOrderStatus(warehouseId, next, changes.status, ownerName)
        dispatch(fetchMovements(warehouseId))
      }
    },
    [warehouseId, ownerName, dispatch]
  )

  return { orders, updateOrder }
}