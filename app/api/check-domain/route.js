import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    // Clean domain (remove spaces, convert to lowercase, add .com if needed)
    const cleanDomain = domain.toLowerCase().trim().replace(/\s+/g, '');
    const fullDomain = cleanDomain.includes('.') ? cleanDomain : `${cleanDomain}.com`;

    // Use Google's Public DNS API to check if domain exists
    const dnsUrl = `https://dns.google/resolve?name=${fullDomain}&type=A`;
    
    const response = await fetch(dnsUrl);
    const data = await response.json();

    // If DNS records exist (Answer field), domain is taken
    // If Status is 3 (NXDOMAIN), domain likely available
    const isAvailable = data.Status === 3 || !data.Answer;

    return NextResponse.json({
      domain: fullDomain,
      available: isAvailable,
      status: data.Status,
    });

  } catch (error) {
    console.error('Domain check error:', error);
    return NextResponse.json(
      { error: 'Failed to check domain availability' },
      { status: 500 }
    );
  }
}
