import React from "react";
import { Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const StarRating = ({ rating = 0 }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} sx={{ color: "#FFC107" }} />);
    }

    // Render half star if applicable
    if (hasHalfStar) {
      stars.push(<StarHalfIcon key={fullStars} sx={{ color: "#FFC107" }} />);
    }

    // Render empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarBorderIcon key={`empty-${i}`} sx={{ color: "#FFC107" }} />
      );
    }

    // Ensure there are always 5 stars
    while (stars.length < 5) {
      stars.push(
        <StarBorderIcon
          key={`empty-${stars.length}`}
          sx={{ color: "#FFC107" }}
        />
      );
    }

    return stars;
  };

  return <Box sx={{ display: "flex" }}>{renderStars()}</Box>;
};

export default StarRating;
