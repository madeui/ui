const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };

/** Escape text for an XML element or attribute. */
export const escapeXml = (text: string) => text.replace(/[&<>'"]/gu, (char) => entities[char]!);
