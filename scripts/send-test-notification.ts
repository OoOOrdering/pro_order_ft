#!/usr/bin/env ts-node
// scripts/send-test-notification.ts
import { connectSocket, onMessage, disconnectSocket } from '../src/utils/socket';

console.log('🔔 실시간 알림 테스트 시작');
const socket = connectSocket('test-room');

onMessage((data) => {
  console.log('알림 수신:', data);
  disconnectSocket();
  process.exit(0);
});

setTimeout(() => {
  console.error('⏰ 알림 수신 실패 (타임아웃)');
  disconnectSocket();
  process.exit(1);
}, 10000);
