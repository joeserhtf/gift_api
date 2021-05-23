export interface PaymentData {
    ClientId: string;
    OrderId: string;
    Amount: number;
    Installments: number;
    CreditCard: PaymentCard;
}

export interface PaymentCard {
    CardNumber: string;
    Holder: string;
    ExpirationDate: string;
    CPF: string;
    SecurityCode: string;
    Brand: string;
    SaveCard: string;
}