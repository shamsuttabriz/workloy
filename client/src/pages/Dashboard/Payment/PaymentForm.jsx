import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log(state.coinsPurchased);
  console.log(state.amountPaid);

  const amount = state?.amountPaid;
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("Error: ", error);
      setError(error.message);
    } else {
      setError("");
      console.log("Payment Method: ", paymentMethod);

      // Create payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
      });

      const clientSecret = res.data.clientSecret;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment succeeded!");
          console.log(result);
          const coinsRes = await axiosSecure.patch(`/users/${user.email}`, {
            increment: state.coinsPurchased,
          });
          console.log(coinsRes);
          // payment history সংরক্ষণ করুন
          const paymentData = {
            email: user.email,
            amount,
            paymentMethod: result.paymentIntent.payment_method_types,
            transactionId: result.paymentIntent.id,
          };

          const paymentRes = await axiosSecure.post("/payments", paymentData);

          if (paymentRes.data.insertedId) {
            await Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `<strong>Transaction ID: </strong> <code>${result.paymentIntent.id}</code>`,
            });

            navigate("/dashboard/add-task");
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Static Text Section */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          💳 Secure Payment
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Enter your card details below to complete the payment.
        </p>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-gray-700 font-medium mb-1">
            Card Information
          </label>

          <div className="border rounded-lg p-3 shadow-sm bg-gray-50">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": { color: "#a0aec0" },
                  },
                  invalid: { color: "#e53e3e" },
                },
              }}
            />
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            type="submit"
            disabled={!stripe}
          >
            Pay Now
          </button>

          {/* Extra Static Info */}
          <p className="text-center text-gray-400 text-xs mt-4">
            🔒 Your payment details are encrypted and secure.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
