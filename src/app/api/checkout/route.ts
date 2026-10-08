import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, orderId, quantity, tier, tierId, total, eventDate, eventName, eventId } = body;

    if (!email || !name || !orderId || !eventId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (tierId) {
      const dbTier = await prisma.ticketTier.findUnique({ where: { id: tierId } });
      if (!dbTier) {
        return NextResponse.json({ error: 'Ticket tier not found' }, { status: 404 });
      }
      if (dbTier.stock < quantity) {
        return NextResponse.json({ error: 'Not enough stock available' }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.ticketTier.update({
          where: { id: tierId },
          data: { stock: { decrement: quantity } }
        }),
        prisma.order.create({
          data: {
            orderId,
            customerName: name,
            customerEmail: email,
            quantity,
            tier,
            totalAmount: total,
            eventId
          }
        })
      ]);
    } else {
      await prisma.order.create({
        data: {
          orderId,
          customerName: name,
          customerEmail: email,
          quantity,
          tier: tier || 'Free',
          totalAmount: total,
          eventId
        }
      });
    }

    // Generate a temporary Ethereal account
    const testAccount = await nodemailer.createTestAccount();
    
    // Configure Nodemailer transporter for Ethereal
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // Email content
    const mailOptions = {
      from: '"Neon Tickets" <noreply@neontickets.com>',
      to: email,
      subject: `Your Tickets for ${eventName || 'Neon Nights Tour'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
          <h1 style="color: #00ffff; text-align: center; text-transform: uppercase;">Payment Successful!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for your purchase. Here is your digital receipt and ticket information.</p>
          
          <div style="background-color: #2a2a2a; padding: 15px; border-radius: 6px; border: 1px dashed #00ffff; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #ff0055;">Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Event:</strong> ${eventName || 'Neon Nights Tour'}</p>
            <p><strong>Date:</strong> ${eventDate || 'October 24, 2026'}</p>
            <hr style="border: 0; border-top: 1px solid #444;" />
            <p><strong>Tickets:</strong> ${quantity}x ${tier}</p>
            <p><strong>Total Paid:</strong> $${total.toFixed(2)}</p>
          </div>

          <p style="font-size: 0.9em; color: #aaaaaa;">
            Show this email at the venue entrance. Your tickets are issued as a cryptographic neural-net token and can be verified at the gate.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #00ffff; font-weight: bold;">See you at the event!</p>
          </div>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('==============================================');
    console.log('EMAIL SENT! View the receipt here:');
    console.log(previewUrl);
    console.log('==============================================');

    return NextResponse.json({ success: true, message: 'Email sent successfully', previewUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
  }
}
