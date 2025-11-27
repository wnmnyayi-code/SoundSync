import { NextRequest, NextResponse } from 'next/server';
// 1. Validate signature
if (!validateSignature(data, data.signature, passPhrase)) {
    console.error('Invalid PayFast signature');
    return new NextResponse('Invalid signature', { status: 400 });
}

// 2. Validate server confirmation
const isValidServer = await pfValidServerConfirmation(text, pfHost);
if (!isValidServer) {
    console.error('Invalid PayFast server confirmation');
    return new NextResponse('Invalid server confirmation', { status: 400 });
}

// 3. Process payment
if (data.payment_status === 'COMPLETE') {
    const userId = data.custom_str1;
    const coinAmount = parseInt(data.custom_str2 || '0', 10);

    if (userId && coinAmount > 0) {
        try {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    coinBalance: {
                        increment: coinAmount,
                    },
                },
            });
            console.log(`Updated user ${userId} balance by ${coinAmount}`);
        } catch (error) {
            console.error('Error updating user balance:', error);
            return new NextResponse('Database error', { status: 500 });
        }
    }
}

return new NextResponse('OK', { status: 200 });
}
