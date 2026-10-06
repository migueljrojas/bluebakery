export const WHATSAPP_NUMERO = "584166059378";

export const whatsappUrl = (mensaje) =>
  `https://wa.me/${WHATSAPP_NUMERO}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ""}`;
