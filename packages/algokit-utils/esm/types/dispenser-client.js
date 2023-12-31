const baseUrl = 'https://api.dispenser.algorandfoundation.tools';
const dispenserRequestTimeout = 15;
const dispenserAccessTokenKey = 'ALGOKIT_DISPENSER_ACCESS_TOKEN';
var DispenserAssetName;
(function (DispenserAssetName) {
    DispenserAssetName[DispenserAssetName["Algo"] = 0] = "Algo";
})(DispenserAssetName || (DispenserAssetName = {}));
const dispenserAssets = {
    [DispenserAssetName.Algo]: {
        assetId: 0,
        decimals: 6,
        description: 'Algo',
    },
};
/**
 * `TestNetDispenserApiClient` is a class that provides methods to interact with the [Algorand TestNet Dispenser API](https://github.com/algorandfoundation/algokit/blob/main/docs/testnet_api.md).
 * It allows you to fund an address with Algos, refund a transaction, and get the funding limit for the Algo asset.
 *
 * The class requires an authentication token and a request timeout to be initialized. The authentication token can be provided
 * either directly as a parameter or through an `ALGOKIT_DISPENSER_ACCESS_TOKEN` environment variable. If neither is provided, an error is thrown.
 *
 * The request timeout can be provided as a parameter. If not provided, a default value is used.
 *
 * @property {string} authToken - The authentication token used for API requests.
 * @property {number} requestTimeout - The timeout for API requests, in seconds.
 *
 * @method fund - Sends a funding request to the dispenser API to fund the specified address with the given amount of Algo.
 * @method refund - Sends a refund request to the dispenser API for the specified refundTxnId.
 * @method limit - Sends a request to the dispenser API to get the funding limit for the Algo asset.
 *
 * @example
 * ```typescript
 * const client = new TestNetDispenserApiClient({ authToken: 'your_auth_token', requestTimeout: 30 });
 * const fundResponse = await client.fund('your_address', 100);
 * const limitResponse = await client.getLimit();
 * await client.refund('your_transaction_id');
 * ```
 *
 * @throws {Error} If neither the environment variable 'ALGOKIT_DISPENSER_ACCESS_TOKEN' nor the authToken parameter were provided.
 */
export class TestNetDispenserApiClient {
    _authToken;
    _requestTimeout;
    constructor(params) {
        const authTokenFromEnv = process.env[dispenserAccessTokenKey];
        if (params?.authToken) {
            this._authToken = params.authToken;
        }
        else if (authTokenFromEnv) {
            this._authToken = authTokenFromEnv;
        }
        else {
            throw new Error(`Can't init AlgoKit TestNet Dispenser API client because neither environment variable ${dispenserAccessTokenKey} or the authToken were provided.`);
        }
        this._requestTimeout = params?.requestTimeout || dispenserRequestTimeout;
    }
    get authToken() {
        return this._authToken;
    }
    get requestTimeout() {
        return this._requestTimeout;
    }
    /**
     * Processes a dispenser API request.
     *
     * @param authToken - The authentication token.
     * @param urlSuffix - The URL suffix for the API request.
     * @param body - The request body.
     * @param method - The HTTP method.
     *
     * @returns The API response.
     */
    async processDispenserRequest(authToken, urlSuffix, body = null, method = 'POST') {
        const headers = { Authorization: `Bearer ${authToken}` };
        const requestArgs = {
            method: method,
            headers: headers,
            signal: AbortSignal.timeout(this.requestTimeout * 1000),
        };
        if (body) {
            requestArgs.body = JSON.stringify(body);
        }
        const response = await fetch(`${baseUrl}/${urlSuffix}`, requestArgs);
        if (!response.ok) {
            let error_message = `Error processing dispenser API request: ${response.status}`;
            let error_response = null;
            try {
                error_response = await response.json();
            }
            catch (err) {
                // suppress exception
            }
            if (error_response && error_response.code) {
                error_message = error_response.code;
            }
            else if (response.status === 400) {
                error_message = (await response.json()).message;
            }
            throw new Error(error_message);
        }
        return response;
    }
    /**
     * Sends a funding request to the dispenser API to fund the specified address with the given amount of Algo.
     *
     * @param address - The address to fund.
     * @param amount - The amount of Algo to fund.
     *
     * @returns DispenserFundResponse: An object containing the transaction ID and funded amount.
     */
    async fund(address, amount) {
        const response = await this.processDispenserRequest(this.authToken, `fund/${dispenserAssets[DispenserAssetName.Algo].assetId}`, { receiver: address, amount: amount, assetID: dispenserAssets[DispenserAssetName.Algo].assetId }, 'POST');
        const content = await response.json();
        return { txId: content.txID, amount: content.amount };
    }
    /**
     * Sends a refund request to the dispenser API for the specified refundTxnId.
     *
     * @param refundTxnId - The transaction ID to refund.
     */
    async refund(refundTxnId) {
        await this.processDispenserRequest(this.authToken, 'refund', { refundTransactionID: refundTxnId }, 'POST');
    }
    /**
     * Sends a request to the dispenser API to get the funding limit for the Algo asset.
     *
     * @returns DispenserLimitResponse: An object containing the funding limit amount.
     */
    async getLimit() {
        const response = await this.processDispenserRequest(this.authToken, `fund/${dispenserAssets[DispenserAssetName.Algo].assetId}/limit`, null, 'GET');
        const content = await response.json();
        return { amount: content.amount };
    }
}
//# sourceMappingURL=dispenser-client.js.map