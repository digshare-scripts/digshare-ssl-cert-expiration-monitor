import * as HTTPS from 'https';
import type * as TLS from 'tls';

export async function getCert(
  commonName: string,
): Promise<TLS.PeerCertificate | undefined> {
  return new Promise((resolve, reject) => {
    HTTPS.get(`https://${commonName}`, {rejectUnauthorized: false})
      .on('response', response => {
        const socket = response.socket as TLS.TLSSocket;
        resolve(socket.authorized ? socket.getPeerCertificate() : undefined);
      })
      .on('error', reject);
  });
}
