const { Resend } = require('resend');

exports.handler = async function(event, context) {
  // Allow OPTIONS request for preflight check if deployed cross-origin
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: 'Method Not Allowed'
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing body' }),
      };
    }

    const data = JSON.parse(event.body);
    const { fullName, phone, email, service, date, time, notes } = data;

    // Check required fields
    if (!fullName || !phone || !email || !service || !date || !time) {
      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Proszę wypełnić wszystkie pola obowiązkowe.' }),
      };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not defined in environment variables');
      return {
        statusCode: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Konfiguracja serwera (RESEND_API_KEY) jest niekompletna.' }),
      };
    }

    const resend = new Resend(apiKey);

    // Build the plain text representation exactly as specified by the user
    const textBody = `Nowa rezerwacja

Imię: ${fullName}
Telefon: ${phone}
Email: ${email}
Usługa: ${service}
Data: ${date}
Godzina: ${time}
Uwagi: ${notes || 'Brak'}`;

    // Elegant gold and charcoal HTML email for professional clients
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background-color: #0c0c0c; padding: 30px 20px; text-align: center; border-bottom: 3px solid #b58641;">
          <h1 style="color: #ffffff; margin: 0; font-family: 'Georgia', serif; font-size: 28px; letter-spacing: 2px;">ZNNK Studio</h1>
          <p style="color: #b58641; margin: 5px 0 0 0; text-transform: uppercase; font-size: 11px; letter-spacing: 3px;">Nowe zgłoszenie rezerwacji</p>
        </div>
        <div style="padding: 30px 25px;">
          <h2 style="color: #0c0c0c; font-size: 20px; margin-top: 0; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px; font-weight: normal;">Szczegóły wizyty:</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f9f9f9;">
              <td style="padding: 12px 0; font-weight: bold; color: #666666; width: 30%;">Klient:</td>
              <td style="padding: 12px 0; font-weight: 500; color: #000000; font-size: 15px;">${fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f9f9f9;">
              <td style="padding: 12px 0; font-weight: bold; color: #666666;">Telefon:</td>
              <td style="padding: 12px 0; color: #b58641; font-weight: bold; font-size: 15px;"><a href="tel:${phone.replace(/\s+/g, '')}" style="color: #b58641; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f9f9f9;">
              <td style="padding: 12px 0; font-weight: bold; color: #666666;">E-mail:</td>
              <td style="padding: 12px 0; color: #000000; font-size: 15px;"><a href="mailto:${email}" style="color: #000000; text-decoration: underline;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f9f9f9;">
              <td style="padding: 12px 0; font-weight: bold; color: #666666;">Usługa:</td>
              <td style="padding: 12px 0; color: #000000; font-weight: 600; font-size: 15px; padding-left: 10px; border-left: 3px solid #b58641; background-color: #fafafa;">${service}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f9f9f9;">
              <td style="padding: 12px 0; font-weight: bold; color: #666666;">Data:</td>
              <td style="padding: 12px 0; color: #000000; font-weight: bold; font-size: 15px;">${date}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f9f9f9;">
              <td style="padding: 12px 0; font-weight: bold; color: #666666;">Godzina:</td>
              <td style="padding: 12px 0; color: #000000; font-weight: bold; font-size: 15px;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #666666; vertical-align: top;">Uwagi:</td>
              <td style="padding: 12px 0; color: #333333; font-size: 14px; white-space: pre-wrap; font-style: italic; background-color: #fffdf5; border-radius: 4px; padding: 10px; border: 1px dashed #dec18b;">${notes || 'Brak uwag'}</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eaeaea; font-size: 11px; color: #888888;">
          Wiadomość została wysłana automatycznie przez formularz kontaktowy strony ZNNK Studio.<br>
          © 2026 ZNNK Studio. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    `;

    // Resend requires a sender from onboarding@resend.dev unless custom domain is verified
    const response = await resend.emails.send({
      from: 'ZNNK Studio Rezerwacje <onboarding@resend.dev>',
      to: 'znnkstudio@gmail.com',
      subject: 'Nowa rezerwacja - ZNNK Studio',
      text: textBody,
      html: htmlBody,
    });

    if (response.error) {
      console.error('Resend response error:', response.error);
      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: response.error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true, message: 'Dziękujemy. Rezerwacja została przyjęta.' }),
    };

  } catch (error) {
    console.error('Error handling netlify function:', error);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Wystąpił błąd podczas zapisywania rezerwacji. Spróbuj ponownie później.' }),
    };
  }
};
