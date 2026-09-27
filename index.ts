import crypto from 'node:crypto';
if (typeof (globalThis as any).crypto === 'undefined') {
  (globalThis as any).crypto = crypto;
}

// Root entrypoint forwarder for Railway / Cloud deployment builders
import './server/index.ts';
