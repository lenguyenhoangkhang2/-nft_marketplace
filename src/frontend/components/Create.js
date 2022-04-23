import { create as ipfsHttpClient } from "ipfs-http-client";
import { useState } from "react";
import { ethers } from "ethers";
import { Button, Form, Row, Spinner } from "react-bootstrap";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

function Create({ marketplace, nft }) {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        console.log(result);
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs image uppload error: ", error);
      }
    }
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) return;
    setLoading(true);

    try {
      const result = await client.add(
        JSON.stringify({ image, name, description })
      );
      await mintThenList(result);
      setLoading(false);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };

  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    await (await nft.mint(uri)).wait();

    // get tokenId
    const id = await nft.tokenCount();
    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "800px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control type="file" name="file" onChange={uploadToIPFS} />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                type="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                type="number"
                placeholder="Price in ETH"
              />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Creating...
                    </>
                  ) : (
                    "Create & List NFT!"
                  )}
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create;
