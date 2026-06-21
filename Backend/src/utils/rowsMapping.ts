const COLUMN_MAPPINGS: Record<string, string[]> = {
  firstname: ['firstname', 'first_name', 'first name', 'ชื่อ', 'ชื่อจริง'],
  lastname:  ['lastname',  'last_name',  'last name',  'นามสกุล'],
  email:     ['email',     'e-mail',     'อีเมล', 'อีเมล์'],
}

export function normalizeRow(row: Record<string, any>): { firstname: string; lastname: string; email: string } {
  const result: Record<string, any> = {}

  for (const [field, aliases] of Object.entries(COLUMN_MAPPINGS)) {
    const matchedKey = Object.keys(row).find(key =>
      aliases.includes(key.trim().toLowerCase())
    )
    result[field] = matchedKey ? row[matchedKey] : undefined
  }

  return result as { firstname: string; lastname: string; email: string }
}