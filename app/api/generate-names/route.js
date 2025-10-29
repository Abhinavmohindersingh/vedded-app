import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function checkDomainAvailability(domain) {
  try {
    const cleanDomain = domain.toLowerCase().trim().replace(/\s+/g, '');
    const fullDomain = cleanDomain.includes('.') ? cleanDomain : `${cleanDomain}.com`;
    
    const dnsUrl = `https://dns.google/resolve?name=${fullDomain}&type=A`;
    const response = await fetch(dnsUrl);
    const data = await response.json();
    
    return {
      domain: fullDomain,
      available: data.Status === 3 || !data.Answer
    };
  } catch (error) {
    return { domain: `${domain}.com`, available: null };
  }
}

export async function POST(request) {
  try {
    const { industry, keywords, tone } = await request.json();

    if (!industry || !keywords) {
      return NextResponse.json(
        { error: 'Industry and keywords are required' },
        { status: 400 }
      );
    }

    // IMPROVED PROMPT - generates more unique, available names
    const prompt = `Generate 10 highly unique, creative, and brandable business names for a ${tone || 'modern'} ${industry} business. 

Keywords: ${keywords}

CRITICAL REQUIREMENTS:
- Must be invented/coined words or very unique combinations
- Avoid common dictionary words (they're likely taken)
- Think like Spotify, Figma, Shopify, Stripe - memorable but unique
- Use word blends, portmanteaus, or creative spellings
- Short (1-2 words max, 6-12 letters ideal)
- Must sound premium and professional
- Should be easy to pronounce

Examples of uniqueness level needed:
- Good: Vendrix, Flowhub, Zenify, Craftivo
- Bad: TechSolutions, BestFitness, ProHealth

Return ONLY the 10 names, one per line, no numbering or explanations.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert brand naming consultant who creates highly unique, memorable names that are likely to have available .com domains. Prioritize invented words and creative combinations over common terms.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 1.0, // Increased for more creativity
      max_tokens: 250,
    });

    const generatedText = response.choices[0].message.content;
    const names = generatedText
      .split('\n')
      .filter((name) => name.trim())
      .map((name) => name.trim().replace(/^[0-9]+[\.)]\s*/, '')); // Remove any numbering

    const namesWithAvailability = await Promise.all(
      names.map(async (name) => {
        const domainCheck = await checkDomainAvailability(name);
        return {
          name: name,
          domain: domainCheck.domain,
          available: domainCheck.available
        };
      })
    );

    return NextResponse.json({
      success: true,
      names: namesWithAvailability,
      credits_used: 1,
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate names. Please try again.' },
      { status: 500 }
    );
  }
}
