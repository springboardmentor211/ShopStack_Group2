const SIZE_CLASSES = {
  sm: 'h-10 w-10',
  md: 'h-[52px] w-[52px]',
  lg: 'h-[68px] w-[68px]',
};

export default function Thumb({ size = 'sm', sku, imageUrl }) {
  return (
    <img
      src={imageUrl}
      alt={sku}
      className={`flex-shrink-0 rounded-xl bg-[#fbf4e9] object-contain p-1 ${SIZE_CLASSES[size]}`}
    />
  );
}
