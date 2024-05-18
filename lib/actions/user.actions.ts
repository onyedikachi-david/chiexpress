"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import {
  encryptId,
  extractCustomerIdFromUrl,
  hashPin,
  parseStringify,
} from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";

import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import { string } from "zod";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_WALLET_COLLECTION_ID: WALLET_COLLECTION_ID,
  CHIMONEY_API_URL_ENDPOINT: CHIMONEY_ENDPOINT,
  CHIMONEY_API_KEY: CHIMONEY_API_KEY,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    console.log("Get Usernfo from Db", parseStringify(user.documents));

    return parseStringify(user.documents[0]);
  } catch (error) {
    //console.log(error);
  }
};

export async function getUserPinHash() {
  try {
    // await getUserInfo
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });
    console.log(
      "transactionPin from get loogged in user",
      user["transactionPin"]
    );
    return user["transactionPin"];
  } catch (error) {
    //console.log("Wahala choke");
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });
    console.log("User from get loogged in user", user);

    return parseStringify(user);
  } catch (error) {
    //console.log(error);
    return null;
  }
}

// export async function getUserSubAccountId(userId: string) {
//   try {
//     const { database } = await createAdminClient();

//     const user = await database.listDocuments(
//       DATABASE_ID!,
//       WALLET_COLLECTION_ID!,
//       [Query.equal("userId", [userId])]
//     );

//     console.log("Subaccountid from db: ", user.documents[0]);

//     return parseStringify(user.documents[0]);
//   } catch (error) {
//     //console.log(error);
//   }
// }

export async function checkUserOnboarded() {
  try {
    // Use await inside the async function
    const userOnboarded = await getLoggedInUser();
    //console.log(userOnboarded);
    if (userOnboarded["hasSubAccount"]) {
      // revalidatePath("/sign-in");
      //console.log("User has subaccount", userOnboarded["hasSubAccount"]);
      return userOnboarded["hasSubAccount"];
    } else {
      console.error("Something bad occurred");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    // Handle any errors that occur during the async operation
  }
}

export async function updateUserDetails(pin: number | string) {
  try {
    const user = await getLoggedInUser();
    if (user) {
      // console.log("Updating User Details", user);
      const { database } = await createAdminClient();
      const pinHash = await hashPin(pin);

      await createChimoneyWallet(user);

      const response = database.updateDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        user.$id,
        {
          hasSubAccount: true,
          transactionPin: pinHash,
        }
      );
      console.log("Update user response: ", response);
    } else {
      console.log("Wahala");
    }
  } catch (error) {
    //console.log("Wahala choke");
  }
}

export const createWalletAccount = async ({
  userId,
  subAccountId,
}: createWalletAccountProps) => {
  try {
    const { database } = await createAdminClient();
    // const user = await getLoggedInUser();

    const response = await database.createDocument(
      DATABASE_ID!,
      WALLET_COLLECTION_ID!,
      ID.unique(),
      {
        user: userId,
        subAccountId: subAccountId,
      }
    );
    const res = response;
    console.log("DB collection wallet res", parseStringify(res));

    return parseStringify(response);
  } catch (error) {
    console.log("An error occured while saving wallet to db", error);
  }
};

async function createSubAccount(user: User) {
  const apiResponse = await fetch(`${CHIMONEY_ENDPOINT}/sub-account/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-KEY": CHIMONEY_API_KEY!,
    },
    body: JSON.stringify({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: `+${user.phoneNumber}`,
    }),
  });

  return apiResponse;
}

export async function createChimoneyWallet(user: User) {
  try {
    // Creates a sub account
    const apiResponse = await createSubAccount(user);
    console.log(apiResponse);
    if (!apiResponse.ok) {
      console.error("An error occcured", apiResponse);
    }

    const responseData: UserResponse = await apiResponse.json();
    const res = await createWalletAccount({
      userId: user.$id,
      subAccountId: responseData.data.uid,
    });
    return responseData;
  } catch (error) {
    console.error("Error in createSubAccount:", error);
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    //console.log(error);
  }
};

export const getWalletsDetails = async (subAccountId: string) => {
  console.log("Get wallet details, subaccount: ", subAccountId);
  try {
    const response = await fetch(`${CHIMONEY_ENDPOINT}/wallets/list`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": CHIMONEY_API_KEY!,
      },
      body: JSON.stringify({
        subAccount: subAccountId,
      }),
    });

    const apiResponse: WalletsData = await response.json();
    console.log("From Get wallet Details", apiResponse);
    if (apiResponse.status === "success") {
      return apiResponse;
    } else {
      console.error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
};

export const payoutChimoney = async ({ email, amount }) => {
  console.log("Send to chimoney payout endpoint", email, amount);
  const res = await getLoggedInUser();
  const userId2 = res["userId"];
  const subAccountId = await getSubAccount({ userId: userId2 });

  try {
    const response = await fetch(`${CHIMONEY_ENDPOINT}/payouts/chimoney`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": CHIMONEY_API_KEY!,
      },
      body: JSON.stringify({
        chimoneys: [{ valueInUSD: amount, email }],
        subAccount: subAccountId,
      }),
    });

    console.log("From payoutChimoney Details", parseStringify(response));
    if (response.ok) {
      return parseStringify(response);
    } else {
      console.error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
};

// export const getWalletDetails = async (walletId: string) => {
//   try {
//     const response = await fetch(`${CHIMONEY_ENDPOINT}/`)
//   } catch (error) {

//   }
// }

export const getAndSaveWalletDetails = async (
  subAccountId: string,
  user: string
) => {
  try {
    const response = await fetch(`${CHIMONEY_ENDPOINT}/wallets/list`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": CHIMONEY_API_KEY!,
      },
      body: JSON.stringify({
        subAccountId,
      }),
    });

    const apiResponse: WalletsData = await response.json();
    apiResponse.data.forEach((wallet) =>
      createWalletAccount({
        userId: user,
        subAccountId,
        balance: wallet.balance,
        walletType: wallet.type,
      })
    );
    return apiResponse;

    // if (apiResponse.status === "success") {
    //   // Save to db
    //   // apiResponse.data.forEach((wallet) =>
    //   //   createWalletAccount({
    //   //     userId: user,
    //   //     subAccountId,
    //   //     balance: wallet.balance,
    //   //     walletType: wallet.type,
    //   //   })
    //   // );
    // } else {
    // }
  } catch (error) {}
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      WALLET_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(banks.documents);
  } catch (error) {
    //console.log(error);
  }
};

export const getSubAccount = async ({ userId }: getWalletProps) => {
  try {
    console.log("GetSubaccount user id param", userId);
    const { database } = await createAdminClient();

    // Fetch all documents from the collection
    const allDocuments = await database.listDocuments(
      DATABASE_ID!,
      WALLET_COLLECTION_ID!
    );

    // Filter documents to find the one matching the userId
    const matchedDocument = allDocuments.documents.find(
      (doc) => doc.user.userId === userId
    );

    if (!matchedDocument) {
      throw new Error("No subaccount found for the given userId");
    }

    console.log(
      "Get subAcccount from Db",
      parseStringify(matchedDocument["subAccountId"])
    );

    // Extract subAccountId from each matched document
    // const subAccountIds = matchedDocument.map((doc) => doc.subAccountId);

    // console.log("Get subaccounts from Db", parseStringify(subAccountIds));

    // return parseStringify(subAccountIds);

    return parseStringify(matchedDocument["subAccountId"]);
  } catch (error) {
    console.error(error);
    // Handle error appropriately, maybe return null or an error object
    return null;
  }
};

export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      WALLET_COLLECTION_ID!,
      [Query.equal("accountId", [accountId])]
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    //console.log(error);
  }
};
