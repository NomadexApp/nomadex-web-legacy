import algosdk from 'algosdk';
import { ABIReturn, AppCompilationResult, AppDeployMetadata, AppDeploymentParams, AppLookup, AppMetadata, CompiledTeal, TealTemplateParams } from './types/app';
import { Arc2TransactionNote, ConfirmedTransactionResult, ConfirmedTransactionResults, SendTransactionFrom } from './types/transaction';
import Algodv2 = algosdk.Algodv2;
import Indexer = algosdk.Indexer;
import modelsv2 = algosdk.modelsv2;
/**
 * Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.
 *
 * To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md
 *
 * **Note:** When using the return from this function be sure to check `operationPerformed` to get access to various return properties like `transaction`, `confirmation` and `deleteResult`.
 *
 * **Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.
 *
 * **Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.
 * @param deployment The arguments to control the app deployment
 * @param algod An algod client
 * @param indexer An indexer client, needed if `existingDeployments` not passed in
 * @returns The app reference of the new/existing app
 */
export declare function deployApp(deployment: AppDeploymentParams, algod: Algodv2, indexer?: Indexer): Promise<Partial<AppCompilationResult> & ((ConfirmedTransactionResults & AppMetadata & {
    return?: ABIReturn;
    operationPerformed: 'create' | 'update';
}) | (ConfirmedTransactionResults & AppMetadata & {
    return?: ABIReturn;
    deleteReturn?: ABIReturn;
    deleteResult: ConfirmedTransactionResult;
    operationPerformed: 'replace';
}) | (AppMetadata & {
    operationPerformed: 'nothing';
}))>;
/** Returns true is there is a breaking change in the application state schema from before to after.
 *  i.e. if the schema becomes larger, since applications can't ask for more schema after creation.
 *  Otherwise, there is no error, the app just doesn't store data in the extra schema :(
 *
 * @param before The existing schema
 * @param after The new schema
 * @returns Whether or not there is a breaking change
 */
export declare function isSchemaIsBroken(before: modelsv2.ApplicationStateSchema, after: modelsv2.ApplicationStateSchema): boolean;
/**
 * Returns a lookup of name => app metadata (id, address, ...metadata) for all apps created by the given account that have an `AppDeployNote` in the transaction note of the creation transaction.
 *
 * **Note:** It's recommended this is only called once and then stored since it's a somewhat expensive operation (multiple indexer calls).
 *
 * @param creatorAccount The account (with private key loaded) or string address of an account that is the creator of the apps you want to search for
 * @param indexer An indexer client
 * @returns A name-based lookup of the app information (id, address)
 */
export declare function getCreatorAppsByName(creatorAccount: SendTransactionFrom | string, indexer: Indexer): Promise<AppLookup>;
/**
 * Return the transaction note for an app deployment.
 * @param metadata The metadata of the deployment
 * @returns The transaction note as a utf-8 string
 */
export declare function getAppDeploymentTransactionNote(metadata: AppDeployMetadata): Arc2TransactionNote;
/**
 * Replaces deploy-time deployment control parameters within the given teal code.
 *
 * * `TMPL_UPDATABLE` for updatability / immutability control
 * * `TMPL_DELETABLE` for deletability / permanence control
 *
 * Note: If these values are not undefined, but the corresponding `TMPL_*` value
 *  isn't in the teal code it will throw an exception.
 *
 * @param tealCode The TEAL code to substitute
 * @param params The deploy-time deployment control parameter value to replace
 * @returns The replaced TEAL code
 */
export declare function replaceDeployTimeControlParams(tealCode: string, params: {
    updatable?: boolean;
    deletable?: boolean;
}): string;
/**
 * Performs template substitution of a teal file.
 *
 * Looks for `TMPL_{parameter}` for template replacements.
 *
 * @param tealCode The TEAL logic to compile
 * @param templateParams Any parameters to replace in the .teal file before compiling
 * @returns The TEAL code with replacements
 */
export declare function performTemplateSubstitution(tealCode: string, templateParams?: TealTemplateParams): string;
/**
 * Performs template substitution of a teal file and compiles it, returning the compiled result.
 *
 * Looks for `TMPL_{parameter}` for template replacements.
 *
 * @param tealCode The TEAL logic to compile
 * @param algod An algod client
 * @param templateParams Any parameters to replace in the .teal file before compiling
 * @param deploymentMetadata The deployment metadata the app will be deployed with
 * @returns The information about the compiled code
 */
export declare function performTemplateSubstitutionAndCompile(tealCode: string, algod: Algodv2, templateParams?: TealTemplateParams, deploymentMetadata?: AppDeployMetadata): Promise<CompiledTeal>;
/**
 * Remove comments from TEAL Code
 *
 * @param tealCode The TEAL logic to compile
 * @returns The TEAL without comments
 */
export declare function stripTealComments(tealCode: string): string;
//# sourceMappingURL=app-deploy.d.ts.map