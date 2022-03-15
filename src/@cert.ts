import * as TLS from 'node:tls';
import * as HTTPS from 'https';

export async function getCert(
  commonName: string,
): Promise<TLS.PeerCertificate | undefined> {
  return new Promise((resolve, reject) => {
    HTTPS.get(`https://${commonName}`, {rejectUnauthorized: false})
      .on('response', response => {
        let socket = response.socket as TLS.TLSSocket;
        resolve(socket.authorized ? socket.getPeerCertificate() : undefined);
      })
      .on('error', reject);
  });
}
