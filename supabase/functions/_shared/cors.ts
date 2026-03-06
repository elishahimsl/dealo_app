/**
 * Shared CORS headers for all DeaLo edge functions.
 * Used for both preflight (OPTIONS) and actual responses.
 */
export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

/**
 * Wrap a JSON body + status into a proper CORS Response.
 */
export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

/**
 * Standard CORS preflight response.
 */
export function preflightResponse(): Response {
  return new Response('ok', { headers: corsHeaders })
}
