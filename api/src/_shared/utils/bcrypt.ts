import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(1);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
