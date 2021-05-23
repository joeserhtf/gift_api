export interface CieloActionResponse {
    Status: number;
    ReasonCode: number;
    ReasonMessage: string;
    ProviderReturnCode: string;
    ProviderReturnMessage: string;
    ReturnCode: string;
    ReturnMessage: string;
    Tid: string;
    ProofOfSale: string;
    AuthorizationCode: string;
}