import { registerAs } from '@nestjs/config';

export default (name: string) =>
  registerAs(name, () => ({
    baseUrl: process.env.AUTH_BASE_URL,
    endpoint: process.env.AUTH_ENDPOINT,
    signature: {
      enabled: true,
      publicKey: {
        path: '.ssh/id_rsa.pem',
      },
      baseString: (context): string => {
        return 'testing123'; // Payload, User's UUID, Nounce
      },
    },
  }));
