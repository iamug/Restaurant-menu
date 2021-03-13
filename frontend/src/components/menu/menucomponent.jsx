import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react"
import { Container } from "@chakra-ui/react"
import { Badge } from "@chakra-ui/react";
//import { Staricon } from "@chakra-ui/icons";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Center, Square, Circle } from "@chakra-ui/react"
import MenuCard from "./menucards"


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

  return (
    // <Button colorScheme="blue">Button</Button>
    <Center>
    <Box w="90%">
  
   <SimpleGrid columns={4} spacing={20}>
    {Array(7)
            .fill("")
            .map((_, i) => (
               <MenuCard property={property} />
            ) )}
    <MenuCard property={property} />
    <div class="card"  style={{ width: "18rem" }}>
  <img class="card-img-top" src="https://bit.ly/2Z4KKcF" alt="Card image cap"/>
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
    </SimpleGrid>
    </Box>
    </Center>
  );
};

export default MenuComponent;
