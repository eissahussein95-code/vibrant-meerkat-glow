Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { amount, jobId, workspaceId, description } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error('Valid amount is required');
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    // Create payment intent with Stripe
    const stripeParams = new URLSearchParams();
    stripeParams.append('amount', Math.round(amount * 100).toString()); // Convert to cents
    stripeParams.append('currency', 'usd');
    stripeParams.append('payment_method_types[]', 'card');
    stripeParams.append('metadata[job_id]', jobId?.toString() || '');
    stripeParams.append('metadata[workspace_id]', workspaceId?.toString() || '');
    stripeParams.append('description', description || 'VorixHub Project Payment');

    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: stripeParams.toString()
    });

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.text();
      throw new Error(`Stripe API error: ${errorData}`);
    }

    const paymentIntent = await stripeResponse.json();

    return new Response(
      JSON.stringify({
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: amount,
          currency: 'usd'
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: {
          code: 'PAYMENT_INTENT_FAILED',
          message: error.message
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});