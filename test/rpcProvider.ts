/// <reference path="../typings/index.d.ts"/>

import * as assert from 'assert';

import RpcProvider from '../src/RpcProvider';

suite('RPC provider', function() {

    let local: RpcProvider,
        remote: RpcProvider,
        transferLocalToRemote: Array<any>,
        transferRemoteToLocal: Array<any>,
        errorLocal: Error,
        errorRemote: Error;
    
    setup(function() {
        local = new RpcProvider(
            (message, transfer) => (transferLocalToRemote = transfer, remote.dispatch(message)),
            50
        );
        
        local.error.addHandler(err => errorLocal = err);

        remote = new RpcProvider(
            (message, transfer) => (transferRemoteToLocal = transfer, local.dispatch(message)),
            50
        );

        remote.error.addHandler(err => errorRemote = err);

        transferLocalToRemote = transferRemoteToLocal = undefined;
        errorRemote = errorLocal = undefined
    });

    suite('signals', function() {

        test('Signals are propagated', function() {
            let x = -1;

            remote.registerSignalHandler('action', (value: number) => x = value);

            local.signal('action', 5);

            assert(!errorLocal);
            assert(!errorRemote);
            assert.strictEqual(x, 5);
        });

        test('Unregistered signals raise an error', function() {
            local.signal('action', 10);

            assert(errorLocal);
            assert(errorRemote);
        });

        test('Multiple signals do not interface', function() {
            let x = -1, y = -1;

            remote.registerSignalHandler('setx', (value: number) => x = value);
            remote.registerSignalHandler('sety', (value: number) => y = value);

            local.signal('setx', 5);
            local.signal('sety', 6);

            assert(!errorLocal);
            assert(!errorRemote);
            assert.strictEqual(x, 5);
            assert.strictEqual(y, 6);
        });

        test('Multiple handlers can be bound to one signal', function() {
            let x = -1;

            remote.registerSignalHandler('action', (value: number) => x = value);

            local.signal('action', 1);
            local.signal('action', 2);

            assert(!errorLocal);
            assert(!errorRemote);
            assert.strictEqual(x, 2);
        });

        test('Handlers can be deregistered', function() {
            let x = -1;

            const handler = (value: number) => x = value;

            remote.registerSignalHandler('action', handler);
            remote.deregisterSignalHandler('action', handler);

            local.signal('action', 5);

            assert(!errorLocal);
            assert(!errorRemote);
            assert.strictEqual(x, -1);
        });

        test('Transfer is honored', function() {
            let x = -1;
            const transfer = [1, 2, 3];

            remote.registerSignalHandler('action', (value: number) => x = value);

            local.signal('action', 2, transfer);

            assert(!errorLocal);
            assert(!errorRemote);
            assert.strictEqual(x, 2);
            assert.strictEqual(transferLocalToRemote, transfer);
            assert(!transferRemoteToLocal);
        });

    });

});