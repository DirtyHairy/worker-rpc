import {EventInterface} from 'microevent.ts';

interface RpcProviderInterface {

    dispatch(message: any): void;

    rpc<T = void, U = void>(id: string, payload?: T, transfer?: Array<any>): Promise<U>;

    signal<T = void>(id: string, payload?: T, transfer?: Array<any>): this;

    registerRpcHandler<T = void, U = void>(id: string, handler: RpcProviderInterface.RpcHandler<T, U>): this;

    registerSignalHandler<T = void>(id: string, handler: RpcProviderInterface.SignalHandler<T>): this;

    deregisterRpcHandler<T = void, U = void>(id: string, handler: RpcProviderInterface.RpcHandler<T, U>): this;

    deregisterSignalHandler<T = void>(id: string, handler: RpcProviderInterface.SignalHandler<T>): this;

    error: EventInterface<Error>;

}

module RpcProviderInterface {

    export interface RpcHandler<T = void, U = void> {
        (payload: T): Promise<U>|U;
    }

    export interface SignalHandler<T = void> {
        (payload: T): void;
    }

}

export default RpcProviderInterface;
