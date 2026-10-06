"use client";
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalCheckout({ precioUsd, clientId, onPendiente }) {
  const [error, setError] = useState("");
  const [confirmando, setConfirmando] = useState(false);

  if (!clientId) {
    return (
      <p className="text-center text-gray-500">
        El pago con PayPal no está disponible en este momento.
      </p>
    );
  }

  const createOrder = async () => {
    setError("");
    const res = await fetch("/api/paypal/create-order", { method: "POST" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "No se pudo iniciar el pago");
    return data.id;
  };

  const onApprove = async ({ orderID }) => {
    setConfirmando(true);
    const res = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderID }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      onPendiente(data.pago);
      return;
    }
    setError(data.error ?? "No pudimos confirmar el pago. Escríbenos por WhatsApp.");
    setConfirmando(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-500">Total a pagar</p>
        <p className="text-4xl font-bold text-cyan-600 font-merienda">
          {precioUsd} USD
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Paga con tu cuenta PayPal o con tarjeta de débito o crédito.
        </p>
      </div>

      {confirmando ? (
        <p className="text-center text-blue-900">Confirmando tu pago...</p>
      ) : (
        <PayPalScriptProvider
          options={{ clientId, currency: "USD", intent: "capture", locale: "es_ES" }}
        >
          <PayPalButtons
            style={{ layout: "vertical", shape: "rect", label: "pay" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={() =>
              setError("Ocurrió un error con PayPal. Intenta de nuevo.")
            }
          />
        </PayPalScriptProvider>
      )}

      {error && <p className="text-sm text-rose-600 text-center">{error}</p>}
    </div>
  );
}
