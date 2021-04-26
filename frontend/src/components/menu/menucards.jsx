import React from "react";
import { Box } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { formatAmount, capitalize } from "../../controllers/utils";

const MenuCard = ({ product, index, handleAddToCart }) => {
  return (
    <div
      class="card"
      style={{ width: "100%", border: "1px solid #cccccc" }}
      key={index}
    >
      <Image
        height={{ base: "260px", sm: "260px", md: "200px", lg: "170px" }}
        objectFit="cover"
        src={product.imageUrl}
        alt={product.name}
      />
      {/* <img
        class="card-img-top"
        height={{ md: 40 }}
        loading="lazy"
        src={product.imageUrl}
        alt={product.name}
      /> */}
      <div class="card-body">
        <Heading as="h3" size="md" className="mb-1">
          {capitalize(product.name)}
        </Heading>

        <p class="card-text my-2">{capitalize(product.description)}</p>
        <p>
          <span className="text-muted mb-2">
            {" "}
            {product.productCategory &&
              product.productCategory.name &&
              product.productCategory.name}
          </span>
        </p>
        {/* <p className="font-weight-bold mb-2">{formatAmount(product.price)}</p> */}
        <button
          onClick={() => handleAddToCart(product)}
          class="btn btn-primary mt-2"
        >
          Add to Order
        </button>
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
