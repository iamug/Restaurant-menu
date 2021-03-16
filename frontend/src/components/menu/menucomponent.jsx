import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { Loader } from "rsuite";
import { Container } from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";
//import { Staricon } from "@chakra-ui/icons";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Center, Square, Circle } from "@chakra-ui/react";
import MenuCard from "./menucards";
import { Heading } from "@chakra-ui/react";

const MenuComponent = () => {
  const property = {
    imageUrl: "https://bit.ly/2Z4KKcF",
    imageAlt: "Rear view of modern home with pool",
    beds: 3,
    baths: 2,
    title: "Modern home in city center in the heart of historic Los Angeles",
    formattedPrice: "$1,900.00",
    reviewCount: 34,
    rating: 4,
  };

  let [productData, setProductData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [loading, setLoading] = useState(false);

  let headers = {
    "Content-Type": "application/json",
  };

  const fetchrecords = async () => {
    try {
      const config = { headers };
      const res = await API.get("/api/products/user", config);
      if (!res) return false;
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  useEffect(async () => {
    $(document).ready(function () {
      $("#myInput").on("input", function () {
        var value = $(this).val().toLowerCase();
        console.log(value);
        $("#grid div").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
    });

    const products = await fetchrecords();
    if (!products) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    setProductData(products.products);
    console.log(products);
    setLoading(true);
  }, [refreshData]);

  return (
    // <Button colorScheme="blue">Button</Button>
    <div className="container mt-4">
      <div className="text-center">
        <Heading as="h3" size="xl">
          Our Menu
        </Heading>
      </div>

      <div className="mt-5">
        <div className="row mb-4">
          <div className="col-sm-4"></div>
          <div className="col-sm-4">
            <div className="text-sm-right">
              <button
                type="button"
                onClick={() => {
                  setLoading(false);
                  setRefreshData(!refreshData);
                }}
                className="btn btn-success waves-effect waves-light mb-2 mr-1"
              >
                <i className="mdi mdi-refresh" />
              </button>
            </div>
          </div>
          <div className="col-sm-4">
            <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group mb-2 col-sm-12 pl-0">
                <label htmlFor="inputPassword2" className="sr-only">
                  Search
                </label>
                <input
                  type="search"
                  className="form-control col-sm-12"
                  id="myInput"
                  placeholder="Search..."
                />
              </div>
            </form>
          </div>
          {/* end col*/}
        </div>

        <Center>
          <Box w="90%">
            <SimpleGrid columns={3} spacing={10} id="grid">
              {loading &&
                productData &&
                productData.length >= 1 &&
                productData.map((product, index) => (
                  <MenuCard product={product} />
                ))}
            </SimpleGrid>

            {loading && productData && productData.length === 0 && (
              <div className="text-center py-3">
                <Heading as="h6" size="sm">
                  There are no products yet.
                </Heading>
                <h3> Kindly check back later.</h3>
              </div>
            )}
            {!loading && (
              <div className="text-center py-5">
                <Loader size="lg" content="Loading" />
              </div>
            )}
            {/* {product}
            {Array(20)
              .fill("")
              .map((_, i) => (
                <MenuCard property={property} />
              ))} */}
          </Box>
        </Center>
      </div>
    </div>
  );
};

export default MenuComponent;
