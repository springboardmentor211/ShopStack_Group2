import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { applyFilters } from '../store/slices/inventorySlice';
import { focusAsn } from '../store/slices/receivingSlice';

export function useWarehouseJump() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMemo(() => {
    const api = {
      toInventory(stock = 'all') {
        dispatch(applyFilters({ stock }));
        navigate('/warehouse/inventory');
      },
      toOrders(status = 'all') {
        navigate(status === 'all' ? '/warehouse/orders' : `/warehouse/orders?status=${status}`);
      },
      toPicking(tab = 'pick') {
        navigate(`/warehouse/picking?tab=${tab}`);
      },
      toReceiving(asnId) {
        if (asnId) dispatch(focusAsn(asnId));
        navigate('/warehouse/receiving');
      },
    };

    api.follow = (jump) => {
      if (jump.to === 'inventory') api.toInventory(jump.stock);
      if (jump.to === 'receiving') api.toReceiving(jump.asnId);
      if (jump.to === 'orders') api.toOrders(jump.status);
      if (jump.to === 'picking') api.toPicking(jump.tab);
    };

    return api;
  }, [dispatch, navigate]);
}
