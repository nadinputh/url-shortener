// Original file: src/proto/deeplink.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DeeplinkRequest as _deeplink_DeeplinkRequest, DeeplinkRequest__Output as _deeplink_DeeplinkRequest__Output } from '../deeplink/DeeplinkRequest';
import type { DeeplinkResponse as _deeplink_DeeplinkResponse, DeeplinkResponse__Output as _deeplink_DeeplinkResponse__Output } from '../deeplink/DeeplinkResponse';

export interface DeeplinkServiceClient extends grpc.Client {
  Write(argument: _deeplink_DeeplinkRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_deeplink_DeeplinkResponse__Output>): grpc.ClientUnaryCall;
  Write(argument: _deeplink_DeeplinkRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_deeplink_DeeplinkResponse__Output>): grpc.ClientUnaryCall;
  Write(argument: _deeplink_DeeplinkRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_deeplink_DeeplinkResponse__Output>): grpc.ClientUnaryCall;
  Write(argument: _deeplink_DeeplinkRequest, callback: grpc.requestCallback<_deeplink_DeeplinkResponse__Output>): grpc.ClientUnaryCall;
  write(argument: _deeplink_DeeplinkRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_deeplink_DeeplinkResponse__Output>): grpc.ClientUnaryCall;
  write(argument: _deeplink_DeeplinkRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_deeplink_DeeplinkResponse__Output>): grpc.ClientUnaryCall;
  write(argument: _deeplink_DeeplinkRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_deeplink_DeeplinkResponse__Output>): grpc.ClientUnaryCall;
  write(argument: _deeplink_DeeplinkRequest, callback: grpc.requestCallback<_deeplink_DeeplinkResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface DeeplinkServiceHandlers extends grpc.UntypedServiceImplementation {
  Write: grpc.handleUnaryCall<_deeplink_DeeplinkRequest__Output, _deeplink_DeeplinkResponse>;
  
}

export interface DeeplinkServiceDefinition extends grpc.ServiceDefinition {
  Write: MethodDefinition<_deeplink_DeeplinkRequest, _deeplink_DeeplinkResponse, _deeplink_DeeplinkRequest__Output, _deeplink_DeeplinkResponse__Output>
}
