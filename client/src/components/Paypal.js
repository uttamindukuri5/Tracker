import React, { useRef, useEffect } from "react";

export default function Paypal({ setPaid, setAlertMessage }) {
  const paypal = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Detroit Walkathon Registration",
                amount: {
                  currency_code: "USD",
                  value: 15.0,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          await actions.order.capture();
          setPaid(true);
          setAlertMessage(true);
        },
        onError: (err) => {
          setPaid(false);
        },
      })
      .render(paypal.current);
  }, []);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}