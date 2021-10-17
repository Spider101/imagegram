import { Request, Response, Send } from 'express';
import * as core from 'express-serve-static-core';

import { getAccountController } from '.';
import { AccountController } from '../interfaces/account';

const mockAccountService = {
    createAccount: jest.fn(),
    deleteAccount: jest.fn()
};

const accountController: AccountController = getAccountController(mockAccountService);

test('account is created', async () => {
    // setup
    const expectedResponse = { _id: 'fake id', name: 'fake name' };
    const fakeRequest = {
        body: { name: expectedResponse.name }
    } as Request;
    const fakeResponse = {
        send: jest.fn() as Send
    } as Response;
    mockAccountService.createAccount.mockImplementation(({ name }) => Promise.resolve({ ...expectedResponse, name }));

    // execute
    await accountController.createAccountHandler(fakeRequest, fakeResponse);

    // assert
    expect(mockAccountService.createAccount).toBeCalledTimes(1);
    expect(fakeResponse.send).toBeCalledTimes(1);
    expect(fakeResponse.send).toBeCalledWith(expectedResponse);
});

test('account is deleted', async () => {
    // setup
    const fakeAccountId = 'fake account Id';
    const fakeRequest = {
        params: { accountId: fakeAccountId } as core.ParamsDictionary
    } as Request;
    const fakeResponse = {} as Response;
    fakeResponse.sendStatus = jest.fn();

    // execute
    await accountController.deleteAccountHandler(fakeRequest, fakeResponse);

    // assert
    expect(fakeResponse.sendStatus).toBeCalledTimes(1);
    expect(fakeResponse.sendStatus).toBeCalledWith(204);
    expect(mockAccountService.deleteAccount).toBeCalledTimes(1);
    expect(mockAccountService.deleteAccount).toBeCalledWith(fakeAccountId);
});