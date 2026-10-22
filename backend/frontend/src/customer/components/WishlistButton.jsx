import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";
import { toggleWishlist } from "../../store/wishlistSlice";

// variant "card": small round heart on top-right of a product image
// variant "square": bigger bordered heart button used next to Add to Cart
const WishlistButton = ({ productId, variant = "card" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isWishlisted = useSelector((state) =>
    state.wishlist.ids.includes(productId)
  );

  const isCard = variant === "card";

  const handleClick = () => {
    // Wishlist needs a logged-in user. Send visitors to login, then back here.
    if (!isLoggedIn()) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }
    dispatch(toggleWishlist(productId));
  };

  return (
    <button
      type="button"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isWishlisted}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      onClick={handleClick}
      style={{
        ...(isCard
          ? {
              position: "absolute",
              top: "11px",
              right: "11px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid #d9c6ad",
              zIndex: 2,
            }
          : {
              width: "46px",
              height: "46px",
              flexShrink: 0,
              borderRadius: "7px",
              border: "1px solid #211f1b",
            }),
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        cursor: "pointer",
      }}
    >
      <Heart
        size={isCard ? 18 : 21}
        strokeWidth={1.8}
        color={isWishlisted ? "#b58243" : "#211f1b"}
        fill={isWishlisted ? "#b58243" : "none"}
      />
    </button>
  );
};

export default WishlistButton;
