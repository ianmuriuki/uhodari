<<<<<<< Updated upstream
import json
import os
from web3 import Web3
from web3.exceptions import ContractLogicError
from dotenv import load_dotenv

load_dotenv()

# this service handles all interactions with the Base Sepolia blockchain, including minting and verifying cultural proof NFTs.
# It uses web3.py to connect to the blockchain and interact with the smart contract.
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

        abi_path = os.path.join(
            os.path.dirname(__file__),
            "/home/iann/mYprojecTs/uhodari/blockchain/abi/CulturalProof.json"
        )

        with open(abi_path) as f:
            contract_json = json.load(f)
            abi = contract_json.get("abi", contract_json)

        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(contract_address),
            abi=abi
        )

    def _send_transaction(self, fn):
        """Build, sign and send a transaction. Returns receipt."""
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

    def mint_proof(
        self,
        story_id: str,
        title: str,
        language: str,
        region: str,
        ipfs_hash: str
    ) -> dict:
        """
        Mint a cultural proof NFT on Base Sepolia.
        Call this after uploading the story file to IPFS.
        Returns tx_hash, token_id, contract_address.
        """
        already_exists = self.contract.functions.storyAlreadyPreserved(story_id).call()
        if already_exists:
            raise ValueError(f"Story {story_id} is already preserved on chain")

        fn = self.contract.functions.preserveStory(
            story_id,
            title,
            language,
            region,
            ipfs_hash
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
        """
        Fetch story data from chain by token ID.
        Returns full CulturalData struct.
        """
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
        """
        Fetch story data from chain by backend story UUID.
        """
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
        """Returns total number of preserved stories on chain."""
        return self.contract.functions.totalStories().call()
=======
from web3 import Web3
import json
import os

class BlockchainService:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(os.getenv("BASE_RPC_URL")))
        self.contract_address = os.getenv("CONTRACT_ADDRESS")
        with open("blockchain/abi/CulturalProof.json") as f:
            self.abi = json.load(f)
        self.contract = self.w3.contract(address=self.contract_address, abi=self.abi)
    
    async def mint_proof(self, story_id: str, title: str, language: str, region: str, contributor_address: str):
        """Mint NFT proof on Base chain"""
        # ****** (Implementation: build transaction, sign, send)
        return {
            "tx_hash": "0x...",
            "token_id": "1",
            "contract_address": self.contract_address,
            "metadata_uri": f"ipfs://Qm{story_id}"
        }
    
    async def verify_proof(self, token_id: str):
        """Verify story proof on blockchain"""
        # ****** (Implementation: call contract verifyStory function)
        return {"verified": True, "data": {}}
>>>>>>> Stashed changes
