import { SetMetadata } from '@nestjs/common';

export const NO_SIGNATURE_KEY = 'isNoSignature';

export const NoSignature = () => SetMetadata(NO_SIGNATURE_KEY, true);
