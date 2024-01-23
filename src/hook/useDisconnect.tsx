import { setClear } from "@/redux/auth/auth";
import { useDispatch } from "react-redux";

export default function useDisconnect() {
  const dispatch = useDispatch();
  function disconnect() {
    const okxwallet = (window as any).okxwallet;
    /* if (okxwallet) {
      okxwallet.disconnect();
    } */
    localStorage.removeItem("address");
    localStorage.removeItem("isEmty");
    //router.reload();
    dispatch(setClear());
    window.location.href = "/buy-badge";
  }
  return { disconnect };
}
