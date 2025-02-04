import StarRating from "react-star-ratings";

export function Star({ starClick, numberOfStars }) {
  return (
    <div>
      <StarRating
        changeRating={() => starClick(numberOfStars)}
        numberOfStars={numberOfStars}
        starDimension="20px"
        starSpacing="2px"
        starHoverColor="red"
        starEmptyColor="red"
      />
    </div>
  );
}
