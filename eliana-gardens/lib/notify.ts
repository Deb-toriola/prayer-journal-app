// Abstracted email/notification helper — swap provider implementation here.
// Used by app/api/inspection/route.ts. Returns true on success, false on failure;
// the route itself decides how to surface that to the client.

export interface InspectionLead {
  fullName: string;
  phone: string;
  email?: string;
  preferredDate: string;
  preferredTimeSlot: 'morning' | 'afternoon';
  message?: string;
  submittedAt: string;
}

export async function notifyInspectionLead(lead: InspectionLead): Promise<boolean> {
  // Default: log to stdout so leads aren't silently lost in dev / before
  // the client provides an email provider key.
  // To enable email delivery, set RESEND_API_KEY (or swap providers below)
  // and INSPECTION_NOTIFY_EMAIL in the deployment environment.

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INSPECTION_NOTIFY_EMAIL;

  if (!apiKey || !to) {
    console.log('[inspection-lead]', JSON.stringify(lead));
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Eliana Gardens <leads@elianagardens.ng>',
        to: [to],
        subject: `Site inspection request — ${lead.fullName}`,
        text: [
          `Name:    ${lead.fullName}`,
          `Phone:   ${lead.phone}`,
          `Email:   ${lead.email ?? '—'}`,
          `Date:    ${lead.preferredDate}`,
          `Slot:    ${lead.preferredTimeSlot}`,
          `Message: ${lead.message ?? '—'}`,
          ``,
          `Submitted: ${lead.submittedAt}`,
        ].join('\n'),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
