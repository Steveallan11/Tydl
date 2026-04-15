import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe secret key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-04-10",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const {
      clientSecret,
      cardNumber,
      expMonth,
      expYear,
      cvc,
      email,
    } = await req.json();

    if (!clientSecret || !cardNumber || !expMonth || !expYear || !cvc) {
      return new Response(
        JSON.stringify({
          error: "Missing required card fields",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a payment method from the card details
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: cardNumber.replace(/\s/g, ""),
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
      billing_details: {
        email: email,
      },
    });

    // Confirm the payment intent with the payment method
    const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
      payment_method: paymentMethod.id,
    });

    return new Response(
      JSON.stringify({
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        succeeded: paymentIntent.status === "succeeded",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
