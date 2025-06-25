import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import { isFunction } from 'lodash';
import { baseString, verified } from '../../utils/signature.utility';
import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NO_SIGNATURE_KEY } from '../decorator/no-signature.decorator';

const X_SIGNATURE = 'X-Signature';
const X_NONCE = 'X-Nonce';

@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const config = this.config.get('auth');
    /**
     * If Not Signature require applied
     */
    const isNoSignature = this.reflector.getAllAndOverride<boolean>(
      NO_SIGNATURE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isNoSignature || !config.signature?.enabled) {
      return Promise.resolve(true);
    }

    /**
     * Get public key from a string or a path provided
     */
    const publicKey = this.publicKey(
      config.signature?.publicKey?.key,
      config.signature?.publicKey?.path,
    );

    /**
     * If the public key is invaid
     */
    if (!publicKey) {
      if (context.getType() === 'http') {
        throw new InternalServerErrorException('Internal Server Error.');
      }
      if (context.getType() === 'rpc') {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'Internal Server Error.',
        });
      }
    }

    let signature: {
      verifiable: string;
      signature: string;
    };

    /**
     * Type of Context is HTTP
     */
    if (context.getType() === 'http') {
      signature = this.http(context);
    }

    /**
     * Type of Context is RPC
     */
    if (context.getType() === 'rpc') {
      signature = this.rpc(context);
    }

    /**
     * Verify Signature
     */
    const isVerified = verified(
      signature?.verifiable,
      publicKey as string,
      signature?.signature,
    );

    if (!isVerified) {
      if (context.getType() === 'http') {
        throw new UnauthorizedException('Invalid Signature!');
      }
      if (context.getType() === 'rpc') {
        throw new RpcException({
          code: status.UNAUTHENTICATED,
          message: 'Invalid Signature!',
        });
      }
    }

    return true;
  }

  /**
   * Extract Signature from RPC Request and Create a Verifiable Payload
   *
   * @param context ExecutionContext
   * @returns Signature Object
   */
  private rpc(context: ExecutionContext): {
    verifiable: string;
    signature: string;
  } {
    const config = this.config.get('auth');
    const ctx = context.switchToRpc();
    const metadata = ctx.getContext<Metadata>();

    /**
     * To verify the data, we provide the same hashing algorithm and
     * padding scheme we provided to generate the signature
     */
    const verifiable = this.baseString(context);
    const signature = metadata.get(
      config.signature?.header || X_SIGNATURE,
    )?.[0] as string;

    return {
      verifiable,
      signature,
    };
  }

  /**
   * Extract Signature from HTTP Request and Create a Verifiable Payload
   *
   * @param context ExecutionContext
   * @returns Signature Object
   */
  private http(context: ExecutionContext): {
    verifiable: string;
    signature: string;
  } {
    const config = this.config.get('auth');
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    /**
     * To verify the data, we provide the same hashing algorithm and
     * padding scheme we provided to generate the signature
     */
    const verifiable = this.baseString(request);
    const signature = request.get(config.signature?.header || X_SIGNATURE);

    return {
      verifiable,
      signature,
    };
  }

  /**
   * Return or Read the public key with file provided path.
   *
   * @param publicKey value of the public key
   * @param publicKeyPath path of the publi key
   * @returns value of the public key
   */
  private publicKey(
    publicKey: string,
    publicKeyPath: string,
  ): string | boolean {
    if (publicKey) {
      return publicKey;
    }
    if (publicKeyPath && fs.existsSync(publicKeyPath)) {
      return fs.readFileSync(publicKeyPath).toString();
    }
    return false;
  }

  /**
   * Create Base String from Context
   *
   * @param context ExecutionContext
   * @returns string
   */
  baseString(context: ExecutionContext): string {
    const config = this.config.get('auth');
    if (isFunction(config.signature.baseString)) {
      return config.signature.baseString(context);
    }

    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      return baseString({
        method: req.method,
        url: url,
        body: req.body,
        query: req.query,
        nonce: req.get(config.signature?.nonce || X_NONCE),
      });
    }

    if (context.getType() === 'rpc') {
      const ctx = context.switchToRpc();
      const payload = ctx.getData();
      const metadata = ctx.getContext<Metadata>();

      const url = `grpc://${context.getArgByIndex(2)?.getHost()}${context.getArgByIndex(2)?.getPath()}`;
      return baseString({
        method:
          context.getArgByIndex(2)?.getPath()?.split('/')?.[2] ?? 'GrpcMethod',
        url: url,
        query: payload,
        nonce: metadata.get(config.signature?.nonce || X_NONCE)?.[0] as string,
      });
    }

    return null;
  }
}
