import StarRating from "react-star-ratings";

export function showAverage(p) {
  let result = 0; // Inicializamos result con 0

  if (p && p.ratings) {
    let ratingsArray = p.ratings;
    let total = [];
    let length = ratingsArray.length;
    /* console.log("length", length); */

    ratingsArray.map((r) => total.push(r.star));
    let totalReduced = total.reduce((p, n) => p + n, 0);
 /*    console.log("totalReduced", totalReduced); */

    let highest = length * 5;
   /*  console.log("highest", highest); */

    result = (totalReduced * 5) / highest;
   /*  console.log("result", result); */
  }

  return (
    <div className="text-center pt-1 pb-3" style={{display:"flex", justifyContent:"center"}}>
      <span
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width:"8vw",
        }}
      >
        <StarRating
          starDimension="20px"
          starSpacing="2px"
          starRatedColor="red"
          rating={result}
          
        />
        ({p.ratings.length})
      </span>
    </div>
  );
}
