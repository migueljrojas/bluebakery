import "server-only";

const API_BASE = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const credenciales = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credenciales}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal OAuth respondió ${res.status}`);
  return (await res.json()).access_token;
}

async function paypalFetch(path, { method = "GET", body } = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function crearOrden({ uid, montoUsd }) {
  const { ok, status, data } = await paypalFetch("/v2/checkout/orders", {
    method: "POST",
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "Recetario Blue Bakery - acceso de por vida",
          custom_id: uid,
          amount: { currency_code: "USD", value: montoUsd.toFixed(2) },
        },
      ],
    },
  });
  if (!ok) throw new Error(`PayPal create order respondió ${status}`);
  return data.id;
}

export async function capturarOrden(orderId) {
  const captura = await paypalFetch(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    { method: "POST" }
  );
  if (captura.ok) return captura.data;

  const yaCapturada = captura.data?.details?.some(
    (d) => d.issue === "ORDER_ALREADY_CAPTURED"
  );
  if (yaCapturada) {
    const orden = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderId)}`);
    if (orden.ok) return orden.data;
  }
  throw new Error(`PayPal capture respondió ${captura.status}`);
}

export function validarCaptura(orden, { uid, montoUsd }) {
  const unidad = orden?.purchase_units?.[0];
  const captura = unidad?.payments?.captures?.[0];
  if (orden?.status !== "COMPLETED" || captura?.status !== "COMPLETED") {
    return { valido: false, motivo: "El pago no se completó" };
  }
  if (captura.amount?.currency_code !== "USD") {
    return { valido: false, motivo: "Moneda inválida" };
  }
  if (Number(captura.amount.value) < montoUsd) {
    return { valido: false, motivo: "Monto inválido" };
  }
  const customId = captura.custom_id ?? unidad.custom_id;
  if (customId !== uid) {
    return { valido: false, motivo: "La orden no pertenece a este usuario" };
  }
  return { valido: true, captura };
}
