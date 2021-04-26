import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { useToast } from "@chakra-ui/react";
import { Loader } from "rsuite";
import { Affix } from "rsuite";
import { Container } from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
//import { Staricon } from "@chakra-ui/icons";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Center, Square, Circle } from "@chakra-ui/react";
import MenuCard from "./menucards";
import { Heading } from "@chakra-ui/react";
import { capitalize } from "../../controllers/utils";

const MenuComponent = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [userData, setUserData] = useState([]);
  let [productData, setProductData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [loading, setLoading] = useState(false);
  let [valid, setValid] = useState(true);
  let [cartItems, setCartItems] = useState([]);

  let headers = {
    "Content-Type": "application/json",
  };

  const { id } = props.match.params;

  const fetchrecords = async () => {
    try {
      const config = { headers };
      const res = await API.get("/api/guest/products/" + id, config);
      if (!res) return false;
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleAddToCart = (item) => {
    const isItemInCart = cartItems.find((value) => value._id === item._id);
    const isCatInCart = cartItems.find(
      (value) => value.productCategory._id === item.productCategory._id
    );
    if (isItemInCart) {
      toast({
        title: "Already in cart.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (isCatInCart) {
      toast({
        title: `You can only select one ${item.productCategory.name}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setCartItems([...cartItems, item]);
    toast({
      title: "Cart added.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const DoesNotExist = () => (
    <div className="text-center py-3">
      <Heading as="h6" size="sm">
        This user does not exist.
      </Heading>
      <h3> </h3>
      <a
        href="#"
        onClick={() => {
          props.history.push("/menu");
        }}
        class="btn btn-primary mt-2"
      >
        Go back to users
      </a>
    </div>
  );

  useEffect(async () => {
    const data = await fetchrecords();
    if (!data) setValid(false);
    data.user && setUserData(data.user);
    setProductData(data.products);
    setLoading(true);
    if (data.user && data.user.bannerImg) {
      document.getElementById("header").style.background =
        "#ffffff url(' " + data.user.bannerImg + " ') no-repeat fixed center";
      document.getElementById("header").style.backgroundSize = "cover";
    }
    console.log({ data });
    $(document).ready(function () {
      console.log("innnnnnn");
      $("#myInput").on("input", function () {
        var value = $(this).val().toLowerCase();
        console.log(value);
        $("#grid div").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
    });
    return () => {
      $("body").css({ "background-image": "unset" });
    };
  }, [refreshData]);

  useEffect(() => {
    console.log("changed", { cartItems });
  }, [cartItems]);

  return (
    // <Button colorScheme="blue">Button</Button>
    <React.Fragment>
      {loading ? (
        <>
          <div className="">
            <div className="">
              <header id="header" className="py-4 ">
                <div className="container">
                  {loading && valid && userData && (
                    <div className="col-sm-12 col-12 col-md-8 col-lg-6 p-0">
                      <div className="text-left card p-3">
                        <Heading as="h4" size="lg" className="mb-2">
                          {userData && userData.name}'s Menu
                        </Heading>
                        <Heading as="h6" size="sm" className="text-muted mb-1">
                          Email : {userData && userData.email}
                        </Heading>
                        <Heading as="h6" size="sm" className="text-muted mb-1">
                          Phone : {userData && userData.phone}
                        </Heading>
                        <Helmet>
                          <title>{userData && userData.name}</title>
                          <meta name="description" content="Your description" />
                          <meta
                            name="keywords"
                            content="Aguziendu Ugochukwu Portfolio events menu app "
                          ></meta>
                        </Helmet>
                      </div>
                    </div>
                  )}
                </div>
              </header>

              <div className="text-center">
                {/* <Heading as="h3" size="xl">
            Our Menu
          </Heading> */}
              </div>

              <div className="container mt-5">
                <div className="row mb-2">
                  <div className="col-sm-4 col-7 col-md-6">
                    <form
                      className="form-inline"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="form-group mb-2 col-sm-12 px-0">
                        <label htmlFor="" className="sr-only">
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
                  <div className="col-sm-4 col-5 col-md-3 order-12 offset-md-3">
                    <div className="text-right">
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
                      <button
                        type="button"
                        onClick={() => {
                          toggleShowDrawer(!showDrawer);
                          onOpen();
                        }}
                        className="btn btn-primary waves-effect waves-light mb-2"
                      >
                        <i className="mdi mdi-cart" />
                        <small className=" badge badge-dark rounded-pill">
                          {cartItems.length}
                        </small>
                      </button>
                    </div>
                  </div>
                  {/* end col*/}
                </div>

                <Center>
                  <Box w="100%">
                    <div className="my-4">
                      <Tabs variant="soft-rounded" colorScheme="purple">
                        <TabList>
                          <Tab>One</Tab>
                          <Tab>Two</Tab>
                          <Tab>Three</Tab>
                        </TabList>
                      </Tabs>
                    </div>

                    {loading && productData && (
                      <SimpleGrid
                        columns={[1, 2, 3, 3, 4]}
                        spacing={10}
                        id="grid"
                      >
                        {loading &&
                          productData &&
                          productData.length >= 1 &&
                          productData.map((product, index) => (
                            <MenuCard
                              product={product}
                              index={index}
                              key={index}
                              handleAddToCart={handleAddToCart}
                            />
                          ))}
                      </SimpleGrid>
                    )}

                    {loading && !valid && <DoesNotExist />}

                    {loading && productData && productData.length === 0 && (
                      <div className="text-center py-3">
                        <Heading as="h6" size="sm">
                          There are no products yet.
                        </Heading>
                        <h3> Kindly check back later.</h3>
                      </div>
                    )}
                    {!loading && (
                      <div className="text-center py-5 my-5 h-100">
                        <div
                          class="spinner-border avatar-xxl text-primary m-2"
                          role="status"
                        ></div>
                        <h4> Loading...</h4>
                      </div>
                    )}
                  </Box>
                </Center>
              </div>
            </div>
          </div>
          <Drawer onClose={onClose} isOpen={isOpen} size="md" placement="right">
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton className="mt-1" />
                <DrawerHeader borderBottomWidth="1px">
                  <span>
                    Your Cart
                    <small className="font-weight-bold ml-2 badge badge-primary rounded-pill">
                      {cartItems.length}
                    </small>
                  </span>
                </DrawerHeader>
                <DrawerBody>
                  <div className="col-12">
                    {/* <h4 className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-primary">Your cart</span>
                  <span className="badge bg-primary rounded-pill">3</span>
                </h4> */}
                    {cartItems && cartItems.length > 0 && (
                      <>
                        <ul className="list-group mb-3">
                          {cartItems.map((item, index) => (
                            <li className="py-2" key={index}>
                              <div>
                                <div className="shadow-sm row g-0 border rounded overflow-hidden flex-md-row">
                                  <div className="col-sm-5 col-5 col-md-5 pl-0 ">
                                    <img
                                      src={item.imageUrl}
                                      className="img-fluid"
                                      style={{ height: "130px" }}
                                    />
                                  </div>
                                  <div className="col-sm-7 col-xs-7 col-7 col-md-7 p-2 pr-0">
                                    <h3 className="font-weight-bolder font-16">
                                      {capitalize(item.name)}
                                    </h3>
                                    <h6 className="mt-3">
                                      {item.productCategory &&
                                        item.productCategory.name &&
                                        item.productCategory.name}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div>
                          <a href="#" class="btn btn-primary mt-2">
                            Place Order
                          </a>
                        </div>
                      </>
                    )}

                    {cartItems.length === 0 && (
                      <div className="text-center py-3">
                        <Heading as="h6" size="sm">
                          No items in cart.
                        </Heading>
                      </div>
                    )}
                  </div>
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      ) : (
        /* content */
        <div className="text-center py-5 my-5 h-100">
          <div
            className="spinner-border avatar-lg text-primary m-2"
            role="status"
          ></div>
          <h4> Loading...</h4>
        </div>
      )}
    </React.Fragment>
  );
};

export default MenuComponent;
