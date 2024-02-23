import { NotFound } from "../utilities";
import { Transaction } from "../models/Transaction";

class TransactionService {

	static GetTransactionById = async (transactionId: string) => {
		try {
			const currentTransaction = await Transaction.findById(transactionId);
			return currentTransaction
		} catch (err) {
			throw new NotFound("transaction can not found id: " + transactionId)
		}
	}

	static ValidateTransaction = async (transactionId: string) => {
		const currentTransaction = await this.GetTransactionById(transactionId);
		return { status: currentTransaction?.status.toLowerCase() !== "failed", currentTransaction }
	}
}

export { TransactionService };
