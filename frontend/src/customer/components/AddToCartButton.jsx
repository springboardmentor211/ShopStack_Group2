import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";
import { addToCart } from "../../store/cartSlice";

const AddToCartButton = ({ productId, quantity = 1, height = 42, style }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = () => {
    // Cart needs a logged-in user. Send visitors to login, then back here.
    if (!isLoggedIn()) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    dispatch(addToCart({ id: productId, quantity }));
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        flex: 1,
        height: `${height}px`,
        border: "1px solid #211f1b",
        borderRadius: "7px",
        backgroundColor: added ? "#b58243" : "#ffffff",
        borderColor: added ? "#b58243" : "#211f1b",
        color: added ? "#ffffff" : "#211f1b",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        ...style,
      }}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
