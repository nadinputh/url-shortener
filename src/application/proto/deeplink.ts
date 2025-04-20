import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { DeeplinkServiceClient as _deeplink_DeeplinkServiceClient, DeeplinkServiceDefinition as _deeplink_DeeplinkServiceDefinition } from './deeplink/DeeplinkService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  deeplink: {
    DeeplinkRequest: MessageTypeDefinition
    DeeplinkResponse: MessageTypeDefinition
    DeeplinkService: SubtypeConstructor<typeof grpc.Client, _deeplink_DeeplinkServiceClient> & { service: _deeplink_DeeplinkServiceDefinition }
  }
}

