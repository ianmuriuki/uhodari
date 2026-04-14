// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CulturalProof is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct CulturalData {
        string storyId;
        string title;
        string language;
        string region;
        uint256 timestamp;
        string ipfsHash;
        address contributor;
    }

    mapping(uint256 => CulturalData) public culturalData;
    mapping(string => bool) private _storyExists;
    mapping(string => uint256) public storyToTokenId;

    event StoryPreserved(
        uint256 indexed tokenId,
        string storyId,
        address indexed contributor,
        string ipfsHash
    );

    constructor() ERC721("Uhodari Cultural Proof", "UHODARI") Ownable(msg.sender) {}

    function preserveStory(
        string memory storyId,
        string memory title,
        string memory language,
        string memory region,
        string memory ipfsHash
    ) public returns (uint256) {
        require(bytes(storyId).length > 0, "Story ID cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(!_storyExists[storyId], "Story already preserved");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        culturalData[tokenId] = CulturalData({
            storyId: storyId,
            title: title,
            language: language,
            region: region,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash,
            contributor: msg.sender
        });

        _storyExists[storyId] = true;
        storyToTokenId[storyId] = tokenId;

        emit StoryPreserved(tokenId, storyId, msg.sender, ipfsHash);
        return tokenId;
    }

    function verifyStory(uint256 tokenId) public view returns (CulturalData memory) {
        require(tokenId < _nextTokenId, "Story not found");
        return culturalData[tokenId];
    }

    function getStoryByStoryId(string memory storyId) public view returns (CulturalData memory) {
        require(_storyExists[storyId], "Story not found");
        return culturalData[storyToTokenId[storyId]];
    }

    function storyAlreadyPreserved(string memory storyId) public view returns (bool) {
        return _storyExists[storyId];
    }

    function totalStories() public view returns (uint256) {
        return _nextTokenId;
    }
}
