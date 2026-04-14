import { expect } from "chai";
import hre from "hardhat";

describe("CulturalProof", function () {
  async function deploy() {
    const { ethers } = await hre.network.connect();
    const [owner, contributor] = await ethers.getSigners();
    const CulturalProof = await ethers.getContractFactory("CulturalProof");
    const contract = await CulturalProof.deploy();
    return { contract, owner, contributor, ethers };
  }

  it("preserves a story and emits StoryPreserved event", async function () {
    const { contract, contributor } = await deploy();

    await expect(
      contract.connect(contributor).preserveStory(
        "story-001",
        "Hadithi ya Nyani na Kobe",
        "Swahili",
        "Mombasa",
        "QmTestIpfsHash123"
      )
    )
      .to.emit(contract, "StoryPreserved")
      .withArgs(0, "story-001", contributor.address, "QmTestIpfsHash123");
  });

  it("reverts when same storyId is preserved twice", async function () {
    const { contract, contributor } = await deploy();

    await contract.connect(contributor).preserveStory(
      "story-001",
      "Hadithi ya Nyani na Kobe",
      "Swahili",
      "Mombasa",
      "QmTestIpfsHash123"
    );

    await expect(
      contract.connect(contributor).preserveStory(
        "story-001",
        "Duplicate",
        "Swahili",
        "Mombasa",
        "QmAnotherHash456"
      )
    ).to.be.revertedWithCustomError(contract, "StoryAlreadyExists");
  });

  it("retrieves correct story data by storyId", async function () {
    const { contract, contributor } = await deploy();

    await contract.connect(contributor).preserveStory(
      "story-002",
      "Ngano za Kikuyu",
      "Kikuyu",
      "Nyeri",
      "QmKikuyuHash789"
    );

    const data = await contract.getStoryByStoryId("story-002");
    expect(data.title).to.equal("Ngano za Kikuyu");
    expect(data.language).to.equal("Kikuyu");
    expect(data.region).to.equal("Nyeri");
    expect(data.contributor).to.equal(contributor.address);
    expect(data.ipfsHash).to.equal("QmKikuyuHash789");
  });

  it("reverts when storyId is empty", async function () {
    const { contract, contributor } = await deploy();

    await expect(
      contract.connect(contributor).preserveStory(
        "", "No ID Story", "Swahili", "Mombasa", "QmSomeHash"
      )
    ).to.be.revertedWithCustomError(contract, "EmptyStoryId");
  });

  it("reverts when ipfsHash is empty", async function () {
    const { contract, contributor } = await deploy();

    await expect(
      contract.connect(contributor).preserveStory(
        "story-003", "No Hash Story", "Swahili", "Mombasa", ""
      )
    ).to.be.revertedWithCustomError(contract, "EmptyIpfsHash");
  });

  it("tracks total stories correctly", async function () {
    const { contract, contributor } = await deploy();

    expect(await contract.totalStories()).to.equal(0);

    await contract.connect(contributor).preserveStory(
      "story-004", "Story One", "Luo", "Kisumu", "QmHash1"
    );
    await contract.connect(contributor).preserveStory(
      "story-005", "Story Two", "Kamba", "Machakos", "QmHash2"
    );

    expect(await contract.totalStories()).to.equal(2);
  });
});
