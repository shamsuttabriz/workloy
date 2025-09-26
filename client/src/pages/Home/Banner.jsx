import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import BannerLogo1 from "../../assets/banner/banner1.jpg";
import BannerLogo2 from "../../assets/banner/banner2.jpg";
import BannerLogo3 from "../../assets/banner/banner3.jpg";

export default function Banner() {
  return (
    <Carousel
      autoPlay={true}
      infiniteLoop={false}
      showThumbs={false}
      showStatus={false}
      showArrows={false}
      className="my-10"
    >
      <div>
        <img
          className="rounded-lg object-fit max-h-[580px]"
          src={BannerLogo1}
        />
      </div>
      <div>
        <img
          className="rounded-lg object-fit max-h-[580px]"
          src={BannerLogo2}
        />
      </div>
      <div>
        <img
          className="rounded-lg object-fit max-h-[580px]"
          src={BannerLogo3}
        />
      </div>
    </Carousel>
  );
}
