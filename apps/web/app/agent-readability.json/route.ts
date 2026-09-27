import { agentReadability } from '@/site/artifacts/agent-readability';
import { textResponse } from '@/site/artifacts/load';

export const dynamic = 'force-static';

export function GET() {
  return textResponse(agentReadability(), 'application/json; charset=utf-8');
}
