import { setIsMobile } from "@/redux/auth/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useHelper() {
  const dispatch = useDispatch();
  function isMobile() {
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    dispatch(setIsMobile(isMobile));
    return isMobile;
  }
  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }
  function isChrome() {
    return /Chrome/i.test(navigator.userAgent);
  }
  function isSafari() {
    return /Safari/i.test(navigator.userAgent);
  }
  useEffect(() => {
    console.log("isMobile", isMobile());
    console.log("isIOS", isIOS());
    console.log("isAndroid", isAndroid());
    console.log("isChrome", isChrome());
    console.log("isSafari", isSafari());
  }, []);

  return { isMobile, isIOS, isAndroid, isChrome, isSafari };
}
