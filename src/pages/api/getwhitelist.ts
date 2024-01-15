import pb from "@/lib/pocketbase";
import type { NextRequest } from "next/server";

export const runtime = "edge";
/* export const config = {
  runtime: "edge",
}; */
export default async function handler(req: NextRequest) {
  // HTTP istek metodunu kontrol edin
  const address =  req.nextUrl.searchParams.get("address") || ""
  let message = "Success"
  if (req.method !== "GET") {
    // POST olmayan istekler için 405 Method Not Allowed yanıtı döndür
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // İstek gövdesini JSON olarak ayrıştır
    
    let data;
    const records = await pb.collection('soulbound_whitelist').getFullList({
        sort: '-created',
        filter: address && `address="${address}"`
    }).then((res) => {
        data = res;
        message = res.length ? "Success" : "Failed No data"
    }
    ).catch((err) => {
        message = "Error"
    });

    return new Response(
      JSON.stringify({
        message: message,
        data: data,
        address: address,

      }),
      {
        status: 200, // Başarılı işlem
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    // Hata durumunda 500 Internal Server Error yanıtı döndür
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error?.message,
        address: address
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

