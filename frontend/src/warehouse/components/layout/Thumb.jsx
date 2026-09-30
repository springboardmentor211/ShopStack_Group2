import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { DEFAULT_TINT, tintFor } from '../../services/inventoryService';

const SIZE_CLASSES = {
  sm: 'h-10 w-10',
  md: 'h-[52px] w-[52px]',
  lg: 'h-[68px] w-[68px]',
};

const ICON_SIZE = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-5 w-5',
};

export default function Thumb({ tint, category, size = 'sm', sku = '', imageUrl }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const showImage = imageUrl && failedUrl !== imageUrl;
  const colors = category ? tintFor(category) : tint || DEFAULT_TINT;

  return (
    <div
      className={`relative flex flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-xl ${colors[0]} ${colors[1]} ${SIZE_CLASSES[size]}`}
      title={sku}
      role="img"
      aria-label={sku}
    >
      <ImageIcon className={ICON_SIZE[size]} />
      {size !== 'sm' && <span className="mt-1 text-[9px] font-bold leading-none">{sku.split('-').slice(1).join('-') || sku}</span>}
      {showImage && (
        <img
          src={imageUrl}
          alt={sku}
          loading="lazy"
          onError={() => setFailedUrl(imageUrl)}
          className="absolute inset-0 h-full w-full rounded-xl bg-[#fbf4e9] object-contain p-1"
        />
      )}
    </div>
  );
}
