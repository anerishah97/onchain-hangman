import { Metadata } from 'next';

// This should be your app's public URL, ideally from an environment variable
// For server components, you can access environment variables directly.
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'; // Fallback for local dev

interface FramePageProps {
  searchParams: {
    score?: string;
    outcome?: 'allRoundsWon' | 'roundLost' | 'played';
  };
}

export async function generateMetadata({ searchParams }: FramePageProps): Promise<Metadata> {
  const score = searchParams.score || '0';
  const outcome = searchParams.outcome || 'played';

  let imageText = `I scored ${score} in Onchain Hangman!`;
  if (outcome === 'allRoundsWon') {
    imageText = `Onchain Star! ⭐ Scored ${score}!`;
  } else if (outcome === 'roundLost') {
    imageText = `Almost! Scored ${score} in Onchain Hangman.`;
  }

  // For now, we use a generic image.
  // Ideally, this image would be dynamically generated with the score and outcome.
  // Example: using Vercel OG Image Generation or a custom API route.
  const imageUrl = `${NEXT_PUBLIC_URL}/onchain-hangman.png`; 
  // You'll need to create this image and place it in your /public folder.
  // Or, better, use a dynamic image generation service/API route.

  // A more advanced image URL could be:
  // const imageUrl = `${NEXT_PUBLIC_URL}/api/frame-image?score=${score}&outcome=${outcome}&text=${encodeURIComponent(imageText)}`;


  const postUrl = `${NEXT_PUBLIC_URL}/api/frame-action`; // A simple API route for button actions

  return {
    title: `Onchain Hangman Score: ${score}`,
    description: imageText,
    openGraph: {
      title: `Onchain Hangman Score: ${score}`,
      description: imageText,
      images: [imageUrl],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': imageUrl,
      'fc:frame:button:1': 'Play Onchain Hangman!',
      'fc:frame:post_url': postUrl,
      // You could add more buttons here, e.g., for different actions or links.
      // 'fc:frame:input:text': 'Enter your message...', 
    },
  };
}

// The actual page component for /frame
export default function FramePage({ searchParams }: FramePageProps) {
  const score = searchParams.score || '0';
  const outcome = searchParams.outcome || 'played';

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>Onchain Hangman Frame</h1>
      <p>This page is intended to be used as a Farcaster Frame.</p>
      <p>If you&apos;re seeing this in a browser, it means the Frame metadata is being served.</p>
      <hr />
      <h2>Frame Details:</h2>
      <p>Score: {score}</p>
      <p>Outcome: {outcome}</p>
      <p>Visit the main game: <a href={NEXT_PUBLIC_URL} style={{color: 'blue'}}>{NEXT_PUBLIC_URL}</a></p>
      <p>
        When this page is embedded in a Farcaster client, users will see an image (ideally dynamic)
        and a button to play the game.
      </p>
    </div>
  );
} 