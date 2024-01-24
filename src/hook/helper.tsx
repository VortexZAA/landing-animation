import { setIsMobile } from "@/redux/auth/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useHelper() {
  const ua = navigator.userAgent;
  return /Android|Mobi/i.test(ua);
}
