import crypto from 'crypto';

interface PayFastData {
    [key: string]: string | number | boolean | undefined;
}

export const generateSignature = (data: PayFastData, passPhrase?: string): string => {
    // 1. Convert object to a query string
    let pfOutput = '';
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                pfOutput += `${key}=${encodeURIComponent(data[key]!.toString().trim()).replace(/%20/g, '+')}&`;
            }
        }
    }

    // 2. Remove the last ampersand
    let getString = pfOutput.slice(0, -1);

    // 3. Append passphrase if it exists
    if (passPhrase) {
        getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
    }

    // 4. MD5 hash the string
    return crypto.createHash('md5').update(getString).digest('hex');
};

export const validateSignature = (data: PayFastData, signature: string, passPhrase?: string): boolean => {
    const generatedSignature = generateSignature(data, passPhrase);
    return generatedSignature === signature;
};

export const pfValidPaymentData = (cartTotal: number, pfData: any): boolean => {
    return Math.abs(parseFloat(pfData.amount_gross) - cartTotal) <= 0.01;
};

export const pfValidServerConfirmation = async (pfParamString: string, pfHost: string = 'sandbox.payfast.co.za'): Promise<boolean> => {
    const response = await fetch(`https://${pfHost}/eng/query/validate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: pfParamString,
    });

    const result = await response.text();
    return result === 'VALID';
};
