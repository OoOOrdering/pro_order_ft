// scripts/check-env.ts
import fs from 'fs';
import path from 'path';

const requiredVars = [
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_SENTRY_DSN',
];

const envPath = path.resolve(process.cwd(), '.env.local');
const envExamplePath = path.resolve(process.cwd(), '.env.production.example');

function checkEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ${filePath} 파일이 존재하지 않습니다.`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const missing = requiredVars.filter((v) => !content.includes(v));
  if (missing.length) {
    console.error(`❌ ${filePath}에 누락된 환경변수: ${missing.join(', ')}`);
    process.exit(1);
  }
  console.log(`✅ ${filePath} 환경변수 OK`);
}

checkEnvFile(envPath);
checkEnvFile(envExamplePath);
