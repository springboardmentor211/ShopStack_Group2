import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { applyFilters } from '../store/slices/inventorySlice';
import { focusAsn } from '../store/slices/receivingSlice';

export function useWarehouseJump() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function toInventory(stock = 'all') {
    dispatch(applyFilters({ stock }));
    navigate('/warehouse/inventory');
  }

  function toOrders(status = 'all') {
    navigate(status === 'all' ? '/warehouse/orders' : `/warehouse/orders?status=${status}`);
  }

  function toPicking(tab = 'pick') {
    navigate(`/warehouse/picking?tab=${tab}`);
  }

  function toReceiving(asnId) {
    if (asnId) dispatch(focusAsn(asnId));
    navigate('/warehouse/receiving');
  }

  function follow(jump) {
    if (jump.to === 'inventory') toInventory(jump.stock);
    if (jump.to === 'receiving') toReceiving(jump.asnId);
    if (jump.to === 'orders') toOrders(jump.status);
    if (jump.to === 'picking') toPicking(jump.tab);
  }

  return { toInventory, toOrders, toPicking, toReceiving, follow };
}
