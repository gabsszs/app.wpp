// src/app/api/whatsapp/route.ts

import { NextResponse, type NextRequest } from 'next/server';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "my-super-secret-token";

/**
 * Handles the webhook verification request from Meta.
 * https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Check if a token and mode is in the query string of the request
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    // Respond with the challenge token from the request
    console.log('WhatsApp Webhook Verified');
    return new NextResponse(challenge, { status: 200 });
  } else {
    // Respond with '403 Forbidden' if verify tokens do not match
    console.error('WhatsApp Webhook Verification Failed');
    return new NextResponse('Forbidden', { status: 403 });
  }
}

/**
 * Handles incoming messages from the WhatsApp webhook.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the entire body to understand its structure
    console.log('Incoming WhatsApp Webhook:', JSON.stringify(body, null, 2));

    // Here you would process the message:
    // 1. Find or create the client user based on the phone number.
    // 2. Find or create the conversation.
    // 3. Save the new message to the Firestore database.
    //
    // For now, we just log it and return success.

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
