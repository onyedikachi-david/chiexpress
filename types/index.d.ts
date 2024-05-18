/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  hasSubAccount: boolean;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  $id: string;
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber: number;
  hasSubAccount: boolean;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare type Wallet = {
  id: string;
  owner: string;
  balance: number;
  type: string;
};

declare type Account = {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  name: string;
  type: string;
  subtype: string;
  appwriteItemId: string;
  shareableId: string;
};

declare type Bank = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  shareableId: string;
};

declare type AccountTypes =
  | "airtime"
  | "momo"
  | "chi "
  | "investment"
  | "other";

declare type Category = "Food and Drink" | "Travel" | "Transfer";

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type Receiver = {
  firstName: string;
  lastName: string;
};

declare type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

declare type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

declare type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

declare interface CreditCardProps {
  account: Wallet;
  userName: string;
  showBalance?: boolean;
}

declare interface BankInfoProps {
  account: Wallet;
  walletId?: string;
  type: "full" | "card";
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface MobileNavProps {
  user: User;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

declare interface ChimoneyProps {
  user: User;
  variant?: "primary" | "ghost";
}

// declare type User = sdk.Models.Document & {
//   accountId: string;
//   email: string;
//   name: string;
//   items: string[];
//   accessToken: string;
//   image: string;
// };

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface WalletDropdownProps {
  accounts: Wallet[];
  setValue?: UseFormSetValue<any>;
  otherStyles?: string;
}

declare interface WalletTabItemProps {
  account: Wallet;
  walletId?: string;
}

declare interface TotalBalanceBoxProps {
  accounts: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
}

declare interface FooterProps {
  user: User;
  type?: "mobile" | "desktop";
}

declare interface RightSidebarProps {
  user: User;
  transactions: Transaction[];
  wallets: Wallet[];
}

declare interface SiderbarProps {
  user: User;
}

declare interface RecentTransactionsProps {
  accounts: Wallet[];
  transactions: Transaction[];
  walletId: string;
  page: number;
}

declare interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  transactions: Transaction[];
}

declare interface CategoryProps {
  category: CategoryCount;
}

declare interface DoughnutChartProps {
  accounts: Wallet[];
}

declare interface PaymentTransferFormProps {
  accounts: Wallet[];
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  walletId: string;
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accessToken: string;
}

declare interface CreateFundingSourceOptions {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

declare interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}

declare interface getTransactionsByBankIdProps {
  bankId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userId: string;
}

declare interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

declare interface createWalletAccountProps {
  userId: string;
  subAccountId: string;
}

// Interface for the TransactionMeta
declare interface TransactionMeta {
  date: {
    _seconds: number;
    _nanoseconds: number;
  };
}

declare interface Meta {
  date: {
    _seconds: number;
    _nanoseconds: number;
  };
  issueID?: string;
  trfMzt?: Record<string, unknown>; // Using Record<string, unknown> for an empty object with potential keys
}

// declare type Transaction = {
//   id: string;
//   $id: string;
//   name: string;
//   paymentChannel: string;
//   type: string;
//   accountId: string;
//   amount: number;
//   pending: boolean;
//   category: string;
//   date: string;
//   image: string;
//   type: string;
//   $createdAt: string;
//   channel: string;
//   senderBankId: string;
//   receiverBankId: string;
// };

// Interface for the Transaction
declare interface Transaction {
  amount: number;
  balanceBefore: number;
  meta: Meta;
  newBalance: number;
  description: string;
}

// Interface for the Wallet
declare interface Wallet {
  id: string;
  owner: string;
  balance: number;
  type: string;
  transactions: Transaction[];
}

// Interface for the main data structure
declare interface WalletsData {
  status: string;
  data: Wallet[];
}

interface UserResponse {
  status: "success";
  data: {
    id: string;
    lastName: string;
    parent?: string; // Optional property with string type
    feePercent: number;
    accountSecondCurrencies: string[]; // Array of strings
    verified: boolean;
    subscription: {
      subscription_end_timestamp: object;
      subscription_start_timestamp: object;
      id: string;
    };
    isScrimUser: boolean;
    subAccount: boolean;
    firstName: string;
    preferredExchangeRate: boolean;
    uid: string;
    approved: boolean;
    createdDate: string; // Date string in ISO 8601 format
    joinDate: string; // Date string in ISO 8601 format
    phoneNumber: string;
    meta: { email: string };
    approvals: object[]; // Array of objects
    name: string;
    apiUseEnabled: boolean;
    email: string;
    p_id: number;
    verification: { status: "completed" };
  };
}

declare interface Subscription {
  subscription_end_timestamp: any; // Replace 'any' with the actual type if known
  subscription_start_timestamp: any; // Replace 'any' with the actual type if known
  id: string;
}

declare interface Meta {
  email: string;
}

declare interface Approval {
  // Assuming Approval is an object with its own properties
  // Replace 'any' with the actual type if known
  [key: string]: any;
}

declare interface UserData {
  id: string;
  lastName: string;
  parent: string;
  feePercent: number;
  accountSecondCurrencies: any[]; // Replace 'any' with the actual type if known
  verified: boolean;
  subscription: Subscription;
  isScrimUser: boolean;
  subAccount: boolean;
  firstName: string;
  preferredExchangeRate: boolean;
  uid: string;
  approved: boolean;
  createdDate: string;
  joinDate: string;
  phoneNumber: string;
  meta: Meta;
  approvals: Approval[];
  name: string;
  apiUseEnabled: boolean;
  email: string;
  p_id: number;
  verification: {
    status: string;
  };
}

declare interface ResponseData {
  status: string;
  data: UserData;
}

declare interface getBanksProps {
  userId: string;
}

declare interface getWalletProps {
  userId: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}
