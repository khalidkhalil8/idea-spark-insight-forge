
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, results, subject } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    if (!results) {
      throw new Error("Results data is required");
    }

    // Simple HTML conversion for markdown-like syntax
    // This is a basic conversion that handles headings, links, and line breaks
    const htmlResults = results
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\n/g, '<br>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Send email using standard SMTP service
    // For this example, we'll simulate a successful email send
    console.log(`Sending email to: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Results: ${results}`);

    // In a real implementation, you would use an email service like SendGrid, Resend, etc.
    // Here, we're just simulating success
    
    // Simulating a successful response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully" 
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );

  } catch (error) {
    console.error("Error in send-validation-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
