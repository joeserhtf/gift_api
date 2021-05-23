export interface CieloCustomer {
    Name: string;
    Identity: string;
    IdentityType: string;
    Email: string;
    Birthdate: string;
    Phone: string;
    DeliveryAddress: CieloCustomerAdress;
    BillingAddress: CieloCustomerAdress;
}

export interface CieloCustomerAdress {
    Street: string;
    Number: string;
    Complement: string;
    ZipCode: string;
    City: string;
    State: string;
    Country: string;
    District: string;
}

export interface CieloPayment {
    ServiceTaxAmount: number;
    Installments: number;
    Interest: number;
    Capture: boolean;
    Authenticate: boolean;
    Recurrent: boolean;
    Tid: string;
    ProofOfSale: string;
    AuthorizationCode: string;
    SoftDescriptor: string;
    Provider: string;
    IsQrCode: boolean;
    Amount: number;
    ReceivedDate: string;
    Status: number;
    IsSplitted: boolean;
    ReturnMessage: string;
    ReturnCode: string;
    PaymentId: string;
    Type: string;
    Currency: string;
    Country: string;
    CreditCard: CieloCreditCard;
    FraudAnalysis: CieloFraudAnalysis;
    Links: CieloLink[];
}

export interface CieloCreditCard {
    CardNumber: string;
    Holder: string;
    ExpirationDate: string;
    SecurityCode: string;
    Brand: string;
    SaveCard: boolean;
}

export interface CieloFraudAnalysis {
    Status: number;
    StatusDescription: string;
    Sequence: string;
    SequenceCriteria: string;
    TotalOrderAmount: number;
    TransactionAmount: number;
    CaptureOnLowRisk: boolean;
    VoidOnHighRisk: boolean;
    Provider: string;
    IsRetryTransaction: boolean;
    MerchantDefinedFields: CieloMerchantDefinedFields[];
    Cart: CieloCart;
    Browser: CieloBrowser;
    Shipping: CieloShipping;
}

export interface CieloMerchantDefinedFields {
    Id: string;
    Value: string;
}

export interface CieloCart {
    IsGift: boolean;
    ReturnsAccepted: boolean;
    Items: CieloItems[];
}

export interface CieloItems {
    Type: number;
    Name: string;
    Risk: number;
    Sku: string;
    OriginalPrice: number
    UnitPrice: number
    Quantity: number
    HostHedge: number
    NonSensicalHedge: number
    ObscenitiesHedge: number
    PhoneHedge: number
    TimeHedge: number
    VelocityHedge: number
    GiftCategory: number
    Weight: number
    CartType: number
}

export interface CieloBrowser {
    HostName: string;
    CookiesAccepted: boolean;
    Email: string;
    Type: string;
    IpAddress: string;
    BrowserFingerPrint: string;
}

export interface CieloShipping {
    Addressee: string;
    Phone: string;
    Method: number;
}

export interface CieloLink {
    Method: string;
    Rel: string;
    Href: string;
}

export interface CieloNewSale {
    MerchantOrderId: string;
    Customer: CieloCustomer;
    Payment: CieloPayment;
}