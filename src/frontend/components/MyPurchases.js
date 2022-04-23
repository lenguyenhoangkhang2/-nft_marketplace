import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    (async () => {
      const filter = marketplace.filters.Bought(
        null,
        null,
        null,
        null,
        null,
        account
      );

      const results = await marketplace.queryFilter(filter);

      const purchases = await Promise.all(
        results.map(async (i) => {
          i = i.args;
          const uri = await nft.tokenURI(i.tokenId);
          const response = await fetch(uri);
          const metadata = await response.json();

          const totalPrice = await marketplace.getTotalPrice(i.itemId);

          let purchasedItem = {
            totalPrice,
            price: i.price,
            itemId: i.itemId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
          };

          return purchasedItem;
        })
      );

      console.log(purchases);
      setLoading(false);
      setPurchases(purchases);
    })();
  }, [account, marketplace, nft]);

  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
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
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No purchases</h2>
        </main>
      )}
    </div>
  );
}

export default MyPurchases;
