import json
import os
from web3 import Web3
from web3.exceptions import ContractLogicError
from dotenv import load_dotenv

load_dotenv()

class BlockchainService:
    def __init__(self):
        rpc_url = os.getenv("BASE_SEPOLIA_RPC_URL")
        private_key = os.getenv("PRIVATE_KEY")
        contract_address = os.getenv("CONTRACT_ADDRESS")

        if not rpc_url:
            raise ValueError("BASE_SEPOLIA_RPC_URL is not set in .env")
        if not private_key:
            raise ValueError("PRIVATE_KEY is not set in .env")
        if not contract_address:
            raise ValueError("CONTRACT_ADDRESS is not set in .env")

        self.w3 = Web3(Web3.HTTPProvider(rpc_url))

        if not self.w3.is_connected():
            raise ConnectionError("Failed to connect to Base Sepolia via RPC URL")

        self.account = self.w3.eth.account.from_key(private_key)

        abi_path = "/home/iann/mYprojecTs/uhodari/blockchain/abi/CulturalProof.json"

        with open(abi_path) as f:
            contract_json = json.load(f)
            abi = contract_json.get("abi", contract_json)

        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(contract_address),
            abi=abi
        )

    def _send_transaction(self, fn):
        tx = fn.build_transaction({
            "from": self.account.address,
            "nonce": self.w3.eth.get_transaction_count(self.account.address),
            "gas": 300000,
            "gasPrice": self.w3.eth.gas_price,
        })
        signed = self.w3.eth.account.sign_transaction(tx, self.account.key)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        return receipt

    def mint_proof(self, story_id: str, title: str, language: str, region: str, ipfs_hash: str) -> dict:
        already_exists = self.contract.functions.storyAlreadyPreserved(story_id).call()
        if already_exists:
            raise ValueError(f"Story {story_id} is already preserved on chain")

        fn = self.contract.functions.preserveStory(
            story_id, title, language, region, ipfs_hash
        )

        try:
            receipt = self._send_transaction(fn)
        except ContractLogicError as e:
            raise ValueError(f"Contract rejected the transaction: {str(e)}")

        if receipt.status != 1:
            raise RuntimeError("Transaction failed on chain")

        token_id = self.contract.functions.storyToTokenId(story_id).call()

        return {
            "tx_hash": receipt.transactionHash.hex(),
            "token_id": str(token_id),
            "contract_address": self.contract.address,
            "block_number": receipt.blockNumber,
            "chain_id": 84532,
        }

    def verify_proof(self, token_id: int) -> dict:
        try:
            data = self.contract.functions.verifyStory(token_id).call()
        except ContractLogicError:
            raise ValueError(f"Token ID {token_id} not found on chain")

        return {
            "story_id": data[0],
            "title": data[1],
            "language": data[2],
            "region": data[3],
            "timestamp": data[4],
            "ipfs_hash": data[5],
            "contributor": data[6],
        }

    def get_story_by_id(self, story_id: str) -> dict:
        exists = self.contract.functions.storyAlreadyPreserved(story_id).call()
        if not exists:
            raise ValueError(f"Story {story_id} not found on chain")

        data = self.contract.functions.getStoryByStoryId(story_id).call()

        return {
            "story_id": data[0],
            "title": data[1],
            "language": data[2],
            "region": data[3],
            "timestamp": data[4],
            "ipfs_hash": data[5],
            "contributor": data[6],
        }

    def total_stories(self) -> int:
        return self.contract.functions.totalStories().call()
