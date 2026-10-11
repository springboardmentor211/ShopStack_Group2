import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../../store/uiSlice";

// Small message at the bottom of the screen (for example "Insufficient stock").
const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dispatch(hideToast()), 4000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div
      role="status"
      onClick={() => dispatch(hideToast())}
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "90vw",
        padding: "13px 22px",
        borderRadius: "8px",
        backgroundColor: toast.type === "error" ? "#b3261e" : "#211f1b",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      {toast.message}
    </div>
  );
};

export default Toast;
