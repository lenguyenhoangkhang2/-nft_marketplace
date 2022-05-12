import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";

function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  const loadListedItems = async () => {
    setLoading(true);

    const itemCount = await marketplace.itemCount();
    let listedItems = [];
    let soldItems = [];

    for (let idx = 1; idx <= itemCount; idx++) {
      const i = await marketplace.items(idx);

      if (i.seller.toLowerCase() === account) {
        const uri = await nft.tokenURI(i.tokenId);
        const response = await fetch(uri);
        const metadata = await response.json();
        const totalPrice = await marketplace.getTotalPrice(i.itemId);

        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        };

        listedItems.push(item);
        if (i.sold) soldItems.push(item);
      }
    }

    setLoading(false);
    setListedItems(listedItems);
    setSoldItems(soldItems);
  };

  useEffect(() => {
    loadListedItems();
  }, [account]);

  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ? (
        <div className="px-5 py-3 container">
          <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>
                    {ethers.utils.formatEther(item.totalPrice)} ETH
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          {soldItems.length > 0 && (
            <>
              <h2>Sold</h2>
              <Row xs={1} md={2} lg={4} className="g-4 py-3">
                {soldItems.map((item, idx) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card>
                      <Card.Img variant="top" src={item.image} />
                      <Card.Footer>
                        For {ethers.utils.formatEther(item.totalPrice)} ETH -
                        Recieved {ethers.utils.formatEther(item.price)} ETH
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No Assets</h2>
        </main>
      )}
    </div>
  );
}

export default MyListedItems;
