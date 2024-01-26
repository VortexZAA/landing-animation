//npm install @splinetool/react-spline @splinetool/runtime bu komutları çalıştırıyoruz
import Spline from "@splinetool/react-spline"; // bunu ekleyeceğiz
import AddresData from "@/data/calimBadge/new2.json"; // bunu ekleyeceğiz

import pb from "@/lib/pocketbase";
import { useEffect, useState } from "react";
export default function TEST() {
  const [totalCreate, setTotalCreate] = useState(0);
  const addresData = AddresData;
  async function createCalimBadge() {
    let totalCreate = 0;
    console.log("Address sayısı", addresData.length);

    await addresData.forEach(async (element) => {
      if (element.address) {
        try {
          const checkAddress = await pb
            .collection("claim_badge_new2")
            .getFirstListItem(`address="${element.address}"`)
            .then((res) => {
              return true;
            })
            .catch((err) => {
              console.log(err);
              return false;
            });
          if (!checkAddress) {
            const result = await pb
              .collection("claim_badge_new2")
              .create({ address: element.address });
            console.log(result);
            totalCreate = totalCreate + 1;
          } else {
            console.log(element.address, " zaten var");
          }
        } catch (error) {
          console.log(error);
          console.log(element.address, " hata");
        }
      }
    });
    setTotalCreate(totalCreate);
  }
  async function updateClaimBadge() {
    // all address convert lowercase
    try {
      let get = await pb.collection("claim_badge_new2").getFullList();
      get.forEach(async (element) => {
        if (element.address) {
          try {
            const result = await pb
              .collection("claim_badge_new2")
              .update(element.id, { address: element.address.toLowerCase() });
            console.log(result);
          } catch (error) {
            console.log(error);
          }
        }
      });
      
    } catch (error) {
      console.log(error);
      
    }
    
  }
  useEffect(() => {
    //createCalimBadge();
    updateClaimBadge();
  }, []);
  return (
    <div className="mx-auto z-20 absolute ">
      <h2 className="text-white text-7xl z-20">Total Create: {totalCreate}</h2>
      <h3 className="text-white text-6xl z-20">
        Address sayısı: {addresData.length}
      </h3>
    </div>
  );
}
