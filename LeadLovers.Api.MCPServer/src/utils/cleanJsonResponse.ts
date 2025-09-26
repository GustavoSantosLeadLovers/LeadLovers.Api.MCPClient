function removeMarkdownBlocks(text: string): string {
  return text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim();
}

function extractJson(text: string): string | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : null;
}

export function cleanJsonResponse(response: string): any {
  try {
    let cleanedResponse = removeMarkdownBlocks(response);
    const extractedJson = extractJson(cleanedResponse);
    if (extractedJson) {
      cleanedResponse = extractedJson;
    }
    return JSON.parse(cleanedResponse);
  } catch (error) {
    process.stderr.write(
      `[MCP Server]  Error cleaning JSON response: ${error instanceof Error ? error.message : error}\n`
    );
    throw new Error('Failed to parse JSON from AI response');
  }
}
