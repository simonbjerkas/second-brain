'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
