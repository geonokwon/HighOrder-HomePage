/**
 * Password Utilities
 * 비밀번호 해싱 및 검증 유틸리티
 */

import { createHash } from 'crypto';

/**
 * 비밀번호를 해시화
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== 'string') {
    throw new Error('Password is required and must be a string');
  }
  // 간단한 SHA-256 해싱 (실제 운영에서는 bcrypt 등을 사용 권장)
  return createHash('sha256').update(password).digest('hex');
}

/**
 * 비밀번호 검증
 */
export function verifyPassword(inputPassword: string, hashedPassword: string): boolean {
  const hashedInput = hashPassword(inputPassword);
  return hashedInput === hashedPassword;
}
