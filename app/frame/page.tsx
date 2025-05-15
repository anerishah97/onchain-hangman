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

  let titleText = `Onchain Hangman Score: ${score}`;
  let descriptionText = `I scored ${score} in Onchain Hangman! Can you beat my score?`;
  // For a Mini App Embed, the image might be more generic or a snapshot of the score screen if dynamically generated.
  // We are still using a generic one for now.
  const imageUrl = `${NEXT_PUBLIC_URL}/onchain-hangman.png`; 

  if (outcome === 'allRoundsWon') {
    titleText = `Onchain Star! Scored ${score}!`;
    descriptionText = `I conquered Onchain Hangman with a score of ${score}! ⭐`;
  } else if (outcome === 'roundLost') {
    titleText = `So close! Scored ${score} in Onchain Hangman.`;
    descriptionText = `I tried Onchain Hangman and scored ${score}. Challenge me!`;
  }

  // Construct the FrameEmbed JSON object as per Mini App sharing guide
  const frameEmbed = {
    version: "next",
    imageUrl: imageUrl,
    button: {
      title: "Play Onchain Hangman!", // Call to action
      action: {
        type: "launch_frame",
        name: "Onchain Hangman", // Optional: Your Mini App name
        url: NEXT_PUBLIC_URL, // URL to launch when the frame is clicked (your app's home)
        splashImageUrl: `${NEXT_PUBLIC_URL}/onchain-hangman.png`, // Assuming logo.png is in /public and suitable
        splashBackgroundColor: "#4A3F6B" // Matching your cute dark theme background
      }
    }
  };

  return {
    title: titleText,
    description: descriptionText,
    openGraph: {
      title: titleText,
      description: descriptionText,
      images: [imageUrl],
    },
    other: {
      // Single fc:frame meta tag with stringified JSON content
      'fc:frame': JSON.stringify(frameEmbed),
      'fc:frame:image': imageUrl,
      // The following are standard Farcaster frame tags, not strictly needed if only using Mini App Embed format,
      // but can be good for broader compatibility or if this URL is hit by older Frame parsers.
      // For strict Mini App Embed, only the above fc:frame is primary.
      // 'fc:frame:image': imageUrl, 
      // 'fc:frame:button:1': 'Play Onchain Hangman!',
      // 'fc:frame:post_url': `${NEXT_PUBLIC_URL}/api/frame-action`, // Not used by launch_frame action type
    },
  };
}

// The actual page component for /frame
export default function FramePage({ searchParams }: FramePageProps) {
  const score = searchParams.score || '0';
  const outcome = searchParams.outcome || 'played';

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>Onchain Hangman - Shareable Frame</h1>
      <p>This page generates metadata for a Farcaster Mini App Embed.</p>
      <p>If you&apos;re seeing this in a browser, the relevant meta tags should be in the page head.</p>
      <hr />
      <h2>Details for Embed:</h2>
      <p>Score: {score}</p>
      <p>Outcome: {outcome}</p>
      <p>Main game: <a href={NEXT_PUBLIC_URL} style={{color: 'blue'}}>{NEXT_PUBLIC_URL}</a></p>
    </div>
  );
} 