import React from "react";
import { Box } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";

const MenuCard = ({ property }) => {
  return (
    <div class="card" style={{ width: "100%", border: "1px solid #cccccc" }}>
      <img
        class="card-img-top"
        loading="lazy"
        src="https://bit.ly/2Z4KKcF"
        alt="Card image cap"
      />
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <a href="#" class="btn btn-primary mt-2">
          Go somewhere
        </a>
      </div>
    </div>

    // <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
    //   <Image style={{ height : "200px" }}
    // objectFit="cover" src={property.imageUrl} alt={property.imageAlt} />

    //   <Box p="6">
    //     <Box d="flex" alignItems="baseline">
    //       <Badge borderRadius="full" px="2" colorScheme="teal">
    //         New
    //       </Badge>
    //       <Box
    //         color="gray.500"
    //         fontWeight="semibold"
    //         letterSpacing="wide"
    //         fontSize="xs"
    //         textTransform="uppercase"
    //         ml="2"
    //       >
    //         {property.beds} beds &bull; {property.baths} baths
    //       </Box>
    //     </Box>

    //     <Box
    //       mt="1"
    //       fontWeight="semibold"
    //       as="h4"
    //       lineHeight="tight"
    //       isTruncated
    //     >
    //       {property.title}
    //     </Box>

    //     <Box>
    //       {property.formattedPrice}
    //       <Box as="span" color="gray.600" fontSize="sm">
    //         / wk
    //       </Box>
    //     </Box>

    //     <Box d="flex" mt="2" alignItems="center">
    //       {Array(5)
    //         .fill("")
    //         .map((_, i) => (
    //           <i
    //             key={i}
    //             className="fas fa-star"
    //             style={
    //               i < property.rating ? { color: "#FFD700" } : { color: "gray" }
    //             }
    //           />
    //         ))}
    //       <Box as="span" ml="2" color="gray.600" fontSize="sm">
    //         {property.reviewCount} reviews
    //       </Box>
    //     </Box>
    //   </Box>
    // </Box>
  );
};

export default MenuCard;
