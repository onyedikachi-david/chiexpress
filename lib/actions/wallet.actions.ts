"use server";

import { parseStringify } from "../utils";
import {
  getLoggedInUser,
  getSubAccount,
  getWalletsDetails,
} from "./user.actions";


export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // get wallet from db
    const res = await getLoggedInUser();
    const userId2 = res["userId"];
    console.log("UserId from getAccounts in wallets:   ", userId2);

    const subAccountId = await getSubAccount({ userId: userId2 });

    // get associated wallet details
    const associatedWallets = await getWalletsDetails(subAccountId);
    console.log("Associated wallets", associatedWallets);
    const details = associatedWallets?.data.map((wallet: Wallet) => {
      const userWallet = {
        id: wallet.id,
        owner: wallet.owner,
        balance: wallet.balance,
        type: wallet.type,
        transaction: wallet.transactions,
      };
    });

    const totalWallets = details?.length;
    const totalBalance = associatedWallets?.data.reduce(
      (acc, wallet) => acc + wallet.balance,
      0
    );
    return parseStringify({
      data: associatedWallets?.data,
      totalWallets,
      totalBalance,
    });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};


