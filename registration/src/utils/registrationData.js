export const cleanText = (value) => value.trim().replace(/\s+/g, ' ')

// Accept pasted lists, commas, semicolons, and line breaks without depending on spaces.
export const parseTeamMembers = (value) => value
    .split(/[,;\r\n]+/)
    .map(cleanText)
    .filter(Boolean)

export const normalizeTeamMembers = (value) => parseTeamMembers(value).join(', ')

export const isValidTeamSize = (value) => /^\d+$/.test(value.trim())
    && Number.isSafeInteger(Number(value)) && Number(value) > 0
