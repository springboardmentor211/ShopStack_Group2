export const scoped = (fetcher) => async (warehouseId, { getState, rejectWithValue }) => {
  const data = await fetcher(warehouseId);
  if (getState().warehouse.core.profile?.warehouseId !== warehouseId) return rejectWithValue({ stale: true });
  return data;
};
