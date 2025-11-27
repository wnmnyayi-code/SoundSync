import { NextRequest, NextResponse } from 'next/server';
import { generateSignature } from '@/lib/payfast';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { amount, itemName } = await req.json();

    const merchantId = process.env.PAYFAST_MERCHANT_ID || '10000100';
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a';
    const passPhrase = process.env.PAYFAST_PASSPHRASE || 'pretoria'; // Default sandbox passphrase
    const isProduction = process.env.NODE_ENV === 'production';
    const host = isProduction ? 'https://www.payfast.co.za' : 'https://sandbox.payfast.co.za';

    const data = {
        merchant_id: merchantId,
        merchant_key: merchantKey,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet/cancel`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payfast/notify`,
        name_first: session.user.name || 'User',
        email_address: session.user.email,
        m_payment_id: `order_${Date.now()}`,
        amount: amount.toFixed(2),
        item_name: itemName,
        custom_str1: session.user.id, // User ID for ITN
        custom_str2: (amount * 20).toString(), // Coin amount (approx) - logic should match frontend
    };

    const signature = generateSignature(data, passPhrase);

    return NextResponse.json({
        ...data,
        signature,
        action: `${host}/eng/process`,
    });
}
